import ModalWindow from '../modalWindow/modalWindow';
import Recognizer from './recognition';
import Ws from '../../libs/websocket';
import detectMobile from '../detectMobile';

import { DEFAULT_GHOST_SPEED, DEFAULT_GHOST_DAMAGE, PLAYER_INITIAL_HP } from '../constants';
import { SCORE_FOR_SYMBOL, SCORE_FOR_GHOST } from '../constants';
import EventBus from '../../libs/eventBus';

const symbolImgWidth: number = 60;

export default class Game {
    protected isMulti?: Boolean;
    protected localEventBus?: EventBus;
    protected MW: ModalWindow;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected ws: Ws;
    protected isSet?: Boolean;

    protected axisY: number;
    protected heartsBlockY: number;
    protected symbolsOffset: number;
    protected lastDrawing: Number;
    protected lastTime: number;
    protected deltaX: number;

    state: {    Players?: Array<{sprite: any, x: number, id: Number, hp: number, score: Number}>, 
                player?: {sprite: any, x: number, hp: number}, 
                ghosts: Array<{x: number, speed: number, symbolsQueue?: Array<number>, 
                symbols?:Array<number>, sprite: any, damage: number}>, 
                score?: number, gameTime: number, isGameOver: Boolean
            };
    oldState: {    Players?: Array<{sprite: any, x: number, id: Number, hp: number, score: Number}>, 
            player?: {sprite: any, x: number, hp: number}, 
            ghosts: Array<{x: number, speed: number, symbolsQueue?: Array<number>, 
            symbols?:Array<number>, sprite: any, damage: number}>, 
            score?: number, gameTime: number, isGameOver: Boolean
        };

    protected recognizer: Recognizer;
    protected requestID: any;

    protected playerImg: HTMLImageElement;
    protected ghostLeftImg: HTMLImageElement;
    protected ghostRightImg: HTMLImageElement;
    protected heartImg: HTMLImageElement;

    protected symbolLR: any;
    protected symbolTD: any;
    protected symbolDTD: any;

    /*
     * this.lastDrawing - последний считанный нарисованный символ
     * this.recognizer - распознаватель нарисованных символов
     * this.bindedResizer - обработчик изменения размеров экрана для корректного ререндера
     * this.state - состояние игры
     * @param {boolean} isMulti - true - мультиплеер
     */
    constructor(eventBus: EventBus, isMulti = false) {
        this.isMulti = isMulti;
        this.localEventBus = eventBus;

        this.MW = new ModalWindow();
        this.canvas = (document.getElementsByClassName('temp_class_canvas')[0] as HTMLCanvasElement);
        this.ctx = this.canvas.getContext('2d');

        /*
         * Общие координаты
         */
        this.axisY = this.canvas.clientHeight - this.canvas.height / 40; // координата Y оси X
        this.heartsBlockY = this.canvas.height / 3; // координата Y блока с сердечками
        this.symbolsOffset = this.canvas.height / 12;  // расстояние между призраком и символами над его головой

        this.lastDrawing = 0;
        this.isSet = false;

        this.recognizer = new Recognizer();

        window.addEventListener('resize', this.resizer.bind(this));
        this.resizer();

        this.requestID = null;

        this.playerImg = (document.getElementById('player-sprite') as HTMLImageElement);
        this.ghostLeftImg = (document.getElementById('ghost-left-sprite') as HTMLImageElement);
        this.ghostRightImg = (document.getElementById('ghost-right-sprite') as HTMLImageElement);
        this.heartImg = (document.getElementById('heart-sprite') as HTMLImageElement);

        this.deltaX = this.ghostLeftImg.width / 2;  //  для изменения стейтов

        this.symbolLR = document.getElementById('symbol_LR');
        this.symbolTD = document.getElementById('symbol_TD');
        this.symbolDTD = document.getElementById('symbol_DTD');

        this.localEventBus.getEvent('updateState', this.setState.bind(this));

        if (detectMobile.detect()) {
            console.log('kukuku');
        } else {
            console.log('kekeke');
        }
        this.lastTime = Date.now();

        if (!this.isMulti) {  // если синглплеер
            this.state = {
                player: {
                    sprite: this.playerImg,
                    x: this.canvas.width / 2 - this.playerImg.width / 2,
                    hp: PLAYER_INITIAL_HP
                },
                ghosts: [],

                score: 0,
                gameTime: 0,
                isGameOver: false
            };
            this.gameLoop();
        } else {
            console.log('creating ws');
            this.ws = new Ws(this.localEventBus);
        }
    }

    setState(state: { Players: { score: Number, x?: number, id?: Number, hp?: number }[]; Objects: { items: any; }; }) {
        console.log(state);

        this.state = {
            Players: [{
                sprite: this.playerImg,
                x: state.Players[0].x,
                id: state.Players[0].id,
                hp: state.Players[0].hp,
                score: state.Players[0].score,
            }, {
                sprite: this.playerImg,
                x: state.Players[1].x,
                id: state.Players[1].id,
                hp: state.Players[1].hp,
                score: state.Players[1].score,
            }],
            ghosts: state.Objects.items,
            gameTime: 0,
            isGameOver: false
        };

        if (!this.isSet) {
            this.oldState = this.state;
            this.isSet = true;
        }
        
        this.gameLoop();
    }

    resizer(): void {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;

        this.recognizer.gcanvas.height = window.innerHeight;
        this.recognizer.gcanvas.width = window.innerWidth;
    }

    destroy(): void {
        if (this.requestID) {
            cancelAnimationFrame(this.requestID);
        }
        console.log('called');
        this.recognizer.destroyRecognizer();

        console.log('final score is', this.state.score);
        window.removeEventListener('resize', this.resizer.bind(this));
    }

    gameLoop(): void {
        let now = Date.now() / 1000.0;
        let dt = (now - this.lastTime);

        if (!this.isMulti) {
            this.updateSingle(dt);
            this.renderSingle();
        } else {
            this.renderMulti(dt);
        }

        if (this.state.isGameOver === true) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.destroy();
            let finalScore = this.state.score;
            this.MW.createModal('Game single end');
            const scoreElement = (document.getElementsByClassName('js-set-final-score')[0] as HTMLElement);
            scoreElement.innerText = `Your score is : ${finalScore}`;
            return;
        }

        this.lastTime = now;
        this.requestID = requestAnimationFrame(this.gameLoop.bind(this));
    }

    updateSingle(dt: number): void {
        this.state.gameTime += dt;

        // Почему это тут? Вот почему: в конструкторе стейта
        // картинка не успевает прогрузиться, ширина равна 0 и не получается вычислить Х игрока
        // Пока хз, что делать с этим
        this.state.player.x = this.canvas.width / 2 - this.playerImg.width / 2;

        if (Math.random() < 1 - Math.pow(.993, this.state.gameTime)) {
            if (this.state.ghosts.length === 0) {  // если призраков нет
                let generatedDirection = this.generateDirection();
                this.state.ghosts.push(this.createGhost(generatedDirection));
            } else if (this.state.ghosts.length === 1) {
                if (this.state.ghosts[0].speed < 0) {  // если есть призрак справа
                    this.state.ghosts.push(this.createGhost('left'));
                } else if (this.state.ghosts[0].speed > 0) {  // если есть призрак слева
                    this.state.ghosts.push(this.createGhost('right'));
                }
            }
        }

        //  убиваем призраков
        for (let i = 0; i < this.state.ghosts.length; i++) {
            // сносим символ
            if (this.state.ghosts[i].symbolsQueue[0] === this.lastDrawing) {
                this.state.ghosts[i].symbolsQueue.shift();
                this.state.score += SCORE_FOR_SYMBOL;
            }

            // убили
            if (this.state.ghosts[i].symbolsQueue.length === 0) {
                if (this.state.ghosts[i].speed > 0) {
                    this.ctx.clearRect(0, this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth - this.symbolsOffset,
                        this.state.player.x, this.state.ghosts[i].sprite.height + symbolImgWidth + this.symbolsOffset);
                } else if (this.state.ghosts[i].speed < 0) {
                    this.ctx.clearRect(this.state.player.x + this.state.player.sprite.width,
                        this.axisY - this.state.ghosts[i].sprite.height  - symbolImgWidth - this.symbolsOffset,
                        this.canvas.width / 2, this.state.ghosts[i].sprite.height + symbolImgWidth + this.symbolsOffset);
                }
                this.state.ghosts.splice(i, 1);
                this.state.score += SCORE_FOR_GHOST;
            }
        }

        this.lastDrawing = 0;

        // двигаем призраков и дамажим героя
        for (let i = 0; i < this.state.ghosts.length; i++) {
            if (this.state.ghosts.length !== 0) {
                if (this.state.ghosts[i].speed > 0) {
                    if (this.state.ghosts[i].x + this.state.ghosts[i].sprite.width < this.state.player.x) {
                        this.moveGhost(this.state.ghosts[i], dt);
                    } else {
                        this.state.player.hp -= this.state.ghosts[i].damage;
                        this.state.ghosts.splice(i, 1);
                    }
                } else if (this.state.ghosts[i].speed < 0) {
                    if (this.state.ghosts[i].x > this.state.player.x + this.state.player.sprite.width) {
                        this.moveGhost(this.state.ghosts[i], dt);
                    } else {
                        this.state.player.hp -= this.state.ghosts[i].damage;
                        this.state.ghosts.splice(i, 1);
                    }
                }
            }

            if (this.state.player.hp === 0) {
                if (this.recognizer.jager.isDrawingPatch) {
                    this.recognizer.jager.clearPath();
                    this.recognizer.destroyRecognizer();
                }
                this.state.isGameOver = true;
                this.localEventBus.callEvent('gameOver');
                return;
            }
        }
    }

    renderSingle(): void {
        let heartsBetweenOffset = this.heartImg.width / 4;

        let heartOffset = this.heartImg.width;
        this.ctx.clearRect(0, this.heartsBlockY,
            (this.heartImg.width + heartsBetweenOffset) * PLAYER_INITIAL_HP + heartOffset, this.heartImg.height);
        for (let i = this.state.player.hp; i > 0; i--) {
            this.ctx.drawImage(this.heartImg, (heartOffset + heartsBetweenOffset) * i, this.heartsBlockY,
                this.heartImg.width, this.heartImg.height);
        }

        // игрок
        this.ctx.clearRect(this.state.player.x, this.axisY - this.state.player.sprite.height,
            this.state.player.sprite.width, this.state.player.sprite.height);
        this.ctx.drawImage(this.state.player.sprite, this.state.player.x,
            this.axisY - this.state.player.sprite.height);

        for (let i = 0; i < this.state.ghosts.length; i++) {  // призраки
            let leftSymbolOffset = (this.state.ghosts[i].sprite.width / 2 - (this.state.ghosts[i].symbolsQueue.length * symbolImgWidth) / 2);

            if (this.state.ghosts[i].speed > 0) {
                // очистка + рендер призрака
                this.ctx.clearRect(0, this.axisY - this.state.ghosts[i].sprite.height,
                    this.state.player.x, this.state.ghosts[i].sprite.height);
                this.ctx.drawImage(this.state.ghosts[i].sprite,
                    this.state.ghosts[i].x,this.axisY - this.state.ghosts[i].sprite.height);

                // очистка + рендер символов над призраком
                this.ctx.clearRect(0,
                    this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth - this.symbolsOffset,
                    this.canvas.width / 2, symbolImgWidth);

                let symbolsCounter = -2;
                for (let j = this.state.ghosts[i].symbolsQueue.length; j >= 0; j--) {
                    symbolsCounter = this.state.ghosts[i].symbolsQueue.length - j;
                    switch (this.state.ghosts[i].symbolsQueue[j]) {
                        case 2:  // LR - горизонтальный символ left-right
                            this.ctx.drawImage(this.symbolLR,
                                this.state.ghosts[i].x + symbolImgWidth * symbolsCounter + leftSymbolOffset,
                                this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth);
                            break;
                        case 3:  // TD - вертикальный символ - top-down
                            this.ctx.drawImage(this.symbolTD,
                                this.state.ghosts[i].x + symbolImgWidth * symbolsCounter + leftSymbolOffset,
                                this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth);
                            break;
                        case 4:  // DTD - стрелка - down-top-down
                            this.ctx.drawImage(this.symbolDTD,
                                this.state.ghosts[i].x + symbolImgWidth * symbolsCounter + leftSymbolOffset,
                                this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth);
                            break;
                    }
                }
            } else if (this.state.ghosts[i].speed < 0) {  // все то же самое, что и для призрака справа
                this.ctx.clearRect(this.state.player.x + this.state.player.sprite.width,
                    this.axisY - this.state.ghosts[i].sprite.height,
                    this.canvas.width / 2, this.state.ghosts[i].sprite.height);

                this.ctx.drawImage(this.state.ghosts[i].sprite,
                    this.state.ghosts[i].x, this.axisY - this.state.ghosts[i].sprite.height);

                this.ctx.clearRect(this.state.player.x + this.state.player.sprite.width / 2,
                    this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth - this.symbolsOffset,
                    this.canvas.width / 2, symbolImgWidth);
                for (let j = 0; j < this.state.ghosts[i].symbolsQueue.length; j++) {
                    switch (this.state.ghosts[i].symbolsQueue[j]) {
                        case 2:  // LR
                            this.ctx.drawImage(this.symbolLR,
                                this.state.ghosts[i].x + symbolImgWidth * j + leftSymbolOffset,
                                this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth - this.symbolsOffset);
                            break;
                        case 3:  // TD
                            this.ctx.drawImage(this.symbolTD,
                                this.state.ghosts[i].x + symbolImgWidth * j + leftSymbolOffset,
                                this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth - this.symbolsOffset);
                            break;
                        case 4:  // DTD
                            this.ctx.drawImage(this.symbolDTD,
                                this.state.ghosts[i].x + symbolImgWidth * j + leftSymbolOffset,
                                this.axisY - this.state.ghosts[i].sprite.height - symbolImgWidth - this.symbolsOffset);
                            break;
                    }
                }
            }
        }

        if (this.recognizer.gcanvas && this.state.player.hp !== 0) {
            if (this.recognizer.mouseIsDown) {  // отрисовываем символы на втором канвасе
                this.recognizer.gctx.clearRect(0, 0, this.recognizer.gcanvas.scrollWidth, this.recognizer.gcanvas.scrollHeight);
                this.recognizer.jager.drawPatch(this.recognizer.path, this.recognizer.gctx, this.recognizer.jager.recognise(this.recognizer.path));
            }
        }

        if (this.recognizer.lastDrawing !== null) {
            this.lastDrawing = this.recognizer.lastDrawing;
            this.recognizer.lastDrawing = null; // чтобы не сносить сразу все одинаковые символы, идущие подряд
        }
    }

    renderMulti(dt: number): void {
        let currentState: {     Players?: Array<{sprite: any, x: number, id: Number, hp: number, score: Number}>,
                                player?: {sprite: any, x: number, hp: number},
                                ghosts: Array<{x: number, speed: number, symbolsQueue?: Array<number>,
                                symbols?:Array<number>, sprite: any, damage: number}>,
                                score?: number, gameTime: number, isGameOver: Boolean
        };
        currentState = this.oldState;

        /*
         * Блок первого игрока
         */
        let heartsBetweenOffset = this.heartImg.width / 4;
        let heartOffset = this.heartImg.width;
        this.ctx.clearRect(0, this.heartsBlockY,
            (this.heartImg.width + heartsBetweenOffset) * PLAYER_INITIAL_HP + heartOffset, this.heartImg.height);
        for (let i = currentState.Players[0].hp; i > 0; i--) {  // вывод сердец здоровья
            this.ctx.drawImage(this.heartImg, (heartOffset + heartsBetweenOffset) * i, this.heartsBlockY,
                this.heartImg.width, this.heartImg.height);
        }

        let leftPlayerX = this.canvas.width / 2 - currentState.Players[0].sprite.width;  // позиция игрока
        currentState.Players[0].x = leftPlayerX;

        this.ctx.clearRect(leftPlayerX, this.axisY - currentState.Players[0].sprite.height,
            this.playerImg.width, this.playerImg.height);

        this.ctx.drawImage(this.playerImg, leftPlayerX,
            this.axisY - this.playerImg.height);

        /*
         * Блок второго игрока
         */
        heartsBetweenOffset = this.heartImg.width / 4;
        heartOffset = this.heartImg.width;

        this.ctx.clearRect(this.canvas.width - (this.heartImg.width + heartsBetweenOffset) * PLAYER_INITIAL_HP - heartOffset, this.heartsBlockY,
            (this.heartImg.width + heartsBetweenOffset) * PLAYER_INITIAL_HP + heartOffset, this.heartImg.height);
        for (let i = currentState.Players[1].hp; i > 0; i--) {  // вывод сердец здоровья
            this.ctx.drawImage(this.heartImg, this.canvas.width - (heartOffset + heartsBetweenOffset) * i - heartOffset, this.heartsBlockY,
                this.heartImg.width, this.heartImg.height);
        }

        // позиция игрока
        let rightPlayerX = leftPlayerX + this.playerImg.width;
        currentState.Players[1].x = rightPlayerX;

        this.ctx.clearRect(rightPlayerX, this.axisY - this.playerImg.height,
            this.playerImg.width, this.playerImg.height);
            
        this.ctx.drawImage(this.playerImg, rightPlayerX,
            this.axisY - this.playerImg.height);


        for (let i = 0; i < currentState.ghosts.length; i++) {  // призраки
            this.moveGhost(currentState.ghosts[i], dt);
            let leftSymbolOffset = (this.ghostLeftImg.width / 2 - (currentState.ghosts[i].symbols.length * symbolImgWidth) / 2);

            if (currentState.ghosts[i].speed > 0) {
                // очистка + рендер призрака
                this.ctx.clearRect(0, this.axisY - this.ghostLeftImg.height,
                    currentState.Players[0].x, this.ghostLeftImg.height);
                this.ctx.drawImage(this.ghostLeftImg,
                    currentState.ghosts[i].x,this.axisY - this.ghostLeftImg.height);

                // очистка + рендер символов над призраком
                this.ctx.clearRect(0,
                    this.axisY - this.ghostLeftImg.height - symbolImgWidth - this.symbolsOffset,
                    this.canvas.width / 2, symbolImgWidth);

                let symbolsCounter = -2;
                for (let j = currentState.ghosts[i].symbols.length; j >= 0; j--) {
                    symbolsCounter = currentState.ghosts[i].symbols.length - j;
                    switch (currentState.ghosts[i].symbols[j]) {
                        case 2:  // LR - горизонтальный символ left-right
                            this.ctx.drawImage(this.symbolLR,
                                currentState.ghosts[i].x + symbolImgWidth * symbolsCounter + leftSymbolOffset,
                                this.axisY - this.ghostLeftImg.height - symbolImgWidth);
                            break;
                        case 3:  // TD - вертикальный символ - top-down
                            this.ctx.drawImage(this.symbolTD,
                                currentState.ghosts[i].x + symbolImgWidth * symbolsCounter + leftSymbolOffset,
                                this.axisY - this.ghostLeftImg.height - symbolImgWidth);
                            break;
                        case 4:  // DTD - стрелка - down-top-down
                            this.ctx.drawImage(this.symbolDTD,
                                currentState.ghosts[i].x + symbolImgWidth * symbolsCounter + leftSymbolOffset,
                                this.axisY - this.ghostLeftImg.height - symbolImgWidth);
                            break;
                    }
                }
            } else if (currentState.ghosts[i].speed < 0) {  // все то же самое, только для призрака справа

                this.ctx.clearRect(currentState.Players[1].x + this.playerImg.width,
                    this.axisY - this.ghostRightImg.height,
                    this.canvas.width / 2, this.ghostRightImg.height);

                this.ctx.drawImage(this.ghostRightImg,
                    currentState.ghosts[i].x, this.axisY - this.ghostRightImg.height);

                this.ctx.clearRect(this.canvas.width / 2,
                    this.axisY - this.ghostRightImg.height - symbolImgWidth - this.symbolsOffset,
                    this.canvas.width / 2, symbolImgWidth);
                for (let j = 0; j < currentState.ghosts[i].symbols.length; j++) {
                    switch (currentState.ghosts[i].symbols[j]) {
                        case 2:  // LR
                            this.ctx.drawImage(this.symbolLR,
                                currentState.ghosts[i].x + symbolImgWidth * j + leftSymbolOffset,
                                this.axisY - this.ghostRightImg.height - symbolImgWidth - this.symbolsOffset);
                            break;
                        case 3:  // TD
                            this.ctx.drawImage(this.symbolTD,
                                currentState.ghosts[i].x + symbolImgWidth * j + leftSymbolOffset,
                                this.axisY - this.ghostRightImg.height - symbolImgWidth - this.symbolsOffset);
                            break;
                        case 4:  // DTD
                            this.ctx.drawImage(this.symbolDTD,
                                currentState.ghosts[i].x + symbolImgWidth * j + leftSymbolOffset,
                                this.axisY - this.ghostRightImg.height - symbolImgWidth - this.symbolsOffset);
                            break;
                    }
                }
            }
        }

        if (this.recognizer.gcanvas) {
            if (this.recognizer.mouseIsDown) {  // отрисовываем символы на втором канвасе
                this.recognizer.gctx.clearRect(0, 0, this.recognizer.gcanvas.scrollWidth, this.recognizer.gcanvas.scrollHeight);
                this.recognizer.jager.drawPatch(this.recognizer.path, this.recognizer.gctx, this.recognizer.jager.recognise(this.recognizer.path));
            }
        }

        if (this.recognizer.lastDrawing !== null) {
            this.lastDrawing = this.recognizer.lastDrawing;
            this.recognizer.lastDrawing = null; // чтобы не сносить сразу все одинаковые символы, идущие подряд
        }
    }

    generateDirection(): 'left' | 'right' {
        return Math.floor(Math.random() * 2) === 0 ? 'left' : 'right';
    }

    generateDrawingsSequence(): number[] {
        const maxSymbolsLength = 2, minSymbolsLength = 6;
        let generatedSymbolsLength = Math.floor(Math.random() * (maxSymbolsLength - minSymbolsLength + 1)) + minSymbolsLength;

        let generatedDrawings = [];
        for (let i = 0; i < generatedSymbolsLength; i++) {
            let generatedSymbolNumber = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            switch (generatedSymbolNumber) {
                case 2:
                    generatedDrawings.push(2);  // LR
                    break;
                case 3:
                    generatedDrawings.push(3);  // TD
                    break;
                case 4:
                    generatedDrawings.push(4);  // DTD
                    break;
            }
        }
        return generatedDrawings;
    }

    createGhost(direction: string): {x: number, speed: number, damage: number, sprite: HTMLImageElement, symbolsQueue: number[]} {
        if (direction === 'left') {
            return {
                x: -this.ghostLeftImg.width,
                speed: DEFAULT_GHOST_SPEED,
                damage: DEFAULT_GHOST_DAMAGE,
                sprite: this.ghostLeftImg,
                symbolsQueue: this.generateDrawingsSequence()
            };
        } else if (direction === 'right') {
            return {
                x: this.canvas.width + this.ghostRightImg.width,
                speed: -DEFAULT_GHOST_SPEED,
                damage: DEFAULT_GHOST_DAMAGE,
                sprite: this.ghostRightImg,
                symbolsQueue: this.generateDrawingsSequence()
            };
        }
    }

    moveGhost(ghost: { x: number; speed: number; }, dt: number) {
        dt *= 1000 / 975;
        ghost.x += ghost.speed * dt;
    }

    /*
     *  Конвертирует координаты с бэка
     *  под текущую ширину канваса (экрана)
     */
    convertCoordinate(coordinate: number) {
        const serverAxisLength = 1440;
        const segmentServerAxis = 1 / serverAxisLength;

        const newAxisLength = this.canvas.width;
        const segmentNewAxis = segmentServerAxis * (1 / newAxisLength);

        return coordinate * segmentNewAxis;
    }
}
