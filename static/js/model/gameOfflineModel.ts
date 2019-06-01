import Game from '../components/game/game';
import api from '../libs/api';
import { ANAUTH_RESPONSE } from '../components/constants';
import EventBus from '../libs/eventBus';
import { exitFullscreen } from '../libs/fullscreenApi';

interface IResponseGame extends Response {
    error?: string;
    nickname?: string;
}

export default class gameOfflineModel {
    scene: Game;
    localEventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.scene = null;
        this.localEventBus = eventBus;

        this.localEventBus.getEvent('startGame', this.onStart.bind(this));
        this.localEventBus.getEvent('gameOver', this.onGameOver.bind(this));
        this.localEventBus.getEvent('getUserDataForGame', this.getUser.bind(this));
        this.localEventBus.getEvent('stopGameManualy', this.stopGame.bind(this));
        this.localEventBus.getEvent('close', this.stopGame.bind(this));
    }

    getUser() {
        console.log('getUser');
        return api.sessionCheck()
            .then(res => {
                if (res.status === ANAUTH_RESPONSE) {
                    this.localEventBus.callEvent('onGetUserDataForGameResponse', {status: 'unAuthUser'});
                } else {
                    api.loadUser()
                        .then((res: IResponseGame) => {
                                const responseOnUser = {
                                    nickname: res.nickname,
                                };
                                this.localEventBus.callEvent('onGetUserDataForGameResponse', {status: 'authUser', user: responseOnUser});
                        });
                }
            });
    }

    onStart() {
        this.scene = new Game(this.localEventBus);
    }

    stopGame() {
        this.scene.destroy();
        exitFullscreen();
    }

    onGameOver() {
        if (this.scene.state.isGameOver) {
            this.scene.destroy();
        }
    }
}