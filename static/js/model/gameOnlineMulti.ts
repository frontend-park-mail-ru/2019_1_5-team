import Game from '../components/game/game';
import ModalWindow from '../components/modalWindow/modalWindow';
import EventBus from '../libs/eventBus';
import { exitFullscreen } from '../libs/fullscreenApi';

/**
 * STATE - состояние игры
 * MOVE - отправляем символ
 * END - игра закончилась
 */

export default class gameOnlineMulti {
    localEventBus: EventBus;
    scene: Game;
    MW: ModalWindow;
    winnerText: Element;

    constructor(eventBus: EventBus) {
        this.localEventBus = eventBus;
        this.scene = null;
        this.MW = new ModalWindow();

        this.localEventBus.getEvent('startGame', this.onStart.bind(this));
        this.localEventBus.getEvent('gameOver', this.onGameOver.bind(this));
        this.localEventBus.getEvent('gameOverWS', this.onGameOver.bind(this));
        this.localEventBus.getEvent('stopGameManualy', this.stopGame.bind(this));
        this.localEventBus.getEvent('close', this.stopGame.bind(this));
    }

    onGameOver() {
        console.log('this.scene first', this.scene);
        if (this.scene.state.isGameOver) {
            this.scene.destroy();
        }
        this.MW.createModal('Game multi end');

        // TODO(): заменить id на никнеймы
        this.winnerText = document.getElementsByClassName('modal-window__header')[0];
        if (this.scene.state.Players[0].hp === 0) {
            console.log('first won', this.scene.state.Players[0].id);
            this.winnerText.textContent = `Game over! ${this.scene.state.Players[0]} won!`;
        } else {
            console.log('second won', this.scene.state.Players[1].id);
            this.winnerText.textContent = `Game over! ${this.scene.state.Players[1].id} won!`;
        }
    }  

    stopGame() {
        this.scene.destroy();
        exitFullscreen();
    }

    onStart() {
        this.scene = new Game(this.localEventBus, true);
    }
}