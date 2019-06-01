import template from './gameView.tmpl.xml';
import View from '../../libs/views';
import userBlock from '../../components/userBlock/userBlock';

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

        return this;
    }
}