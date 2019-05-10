import template from './gameView.tmpl.xml';
import View from '../../libs/views';
import userBlock from '../../components/userBlock/userBlock';

import './game.scss';

export default class gameViewMulti extends View {
    constructor(eventBus) {
        super(template, eventBus);
        this.state = {
            user: {
                first: {
                    nickname: 'Pasha',
                },
                second: {
                    nickname: 'Kirill',
                },
            },
        };
        this.render(document.getElementsByClassName('body-cnt')[0]);
    }

    render(root, data = {}) {
        super.render(root, data);

        const userStates = new userBlock();
        userStates.gameButtonsMulti(this.state);
        const menuButton = document.getElementsByClassName('js-back-to-menu')[0];
        menuButton.addEventListener('click', () => {
            this.localEventBus.callEvent('stopGameManualy');
        });
        this.localEventBus.callEvent('startGame'); 
        return this; 
    }
}