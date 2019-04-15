import Game from '../components/game/game.js';
import api from '../libs/api.js';
import { ANAUTH_RESPONSE } from '../components/constants.js';

export default class gameOfflineModel {
    constructor(eventBus) {
        this.scene = null;
        this.localEventBus = eventBus;

        this.localEventBus.getEvent('startGame', this.onStart.bind(this));
        this.localEventBus.getEvent('gameOver', this.onGameOver.bind(this));
        this.localEventBus.getEvent('getUserDataForGame', this.getUser.bind(this));
        this.localEventBus.getEvent('stopGameManualy', this.stopGame.bind(this));
    }

    getUser() {
        return api.sessionCheck()
            .then(res => {
                if (res.status === ANAUTH_RESPONSE) {
                    this.localEventBus.callEvent('onGetUserDataForGameResponse', {status: 'unAuthUser'});
                } else {
                    api.loadUser()
                        .then(res => {
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
    }

    onGameOver() {
        if (this.scene.state.isGameOver) {
            this.scene.destroy();
            this.updateUserScore(this.scene.state.score);
        }
    }

    // updateUserScore(score) {
    //     api.updateUser({
            
    //     }).then(res => {
    //         if (res.ok) {
    //             this.localEventBus.callEvent('submitPasswordSuccess', {newPassword: passNew});
    //         } else {
    //             res.json().then(res => {
    //                 this.localEventBus.callEvent('changePasswordResponse', {error: res.error});
    //             });
    //         }
    //     });
    // }
}