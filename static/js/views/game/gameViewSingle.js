import template from './gameView.tmpl.xml';
import View from '../../libs/views';
import userBlock from '../../components/userBlock/userBlock';
import launchFullscreen from '../../libs/fullscreenApi';

import './game.scss';


export default class gameView extends View {
    constructor(eventBus) {
        super(template, eventBus);
        this.localEventBus = eventBus;

        this.isChecked = false;
        this.isStart = false;

        this.render(document.getElementsByClassName('body-cnt')[0]);
        this.localEventBus.getEvent('onGetUserDataForGameResponse', this.getUserResponse.bind(this));
    }

    getUserResponse(data = {}) {
        
        const block = new userBlock();
        block.gameButtons(data);
        const menuButton = document.getElementsByClassName('js-back-to-menu')[0];
        menuButton.addEventListener('click', () => {
            this.localEventBus.callEvent('stopGameManualy');
        });
        this.localEventBus.callEvent('startGame');  
    }

    render(root, data = {}) {
        super.render(root, data);
        this.localEventBus.callEvent('getUserDataForGame');

        this.canvas = document.getElementById('canvas');

<<<<<<< HEAD
=======
        launchFullscreen(this.canvas);
        screen.orientation.lock('landscape');

>>>>>>> a9513d613e117c065cbd55ac377b4d4c13e6416b
        return this;
    }
}