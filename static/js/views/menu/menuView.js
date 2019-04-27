import View from '../../libs/views.js';
import userBlock from '../../components/userBlock.js';
// import ModalWindow from '../../components/modalWindow.js';
import template from './menuView.tmpl.xml';
import chat from '../../components/chat.js';

export default class viewMenu extends View {
    constructor({ eventBus = {} }) {
        super(template, eventBus);
        this.isAuth = false;
        this.chat = new chat();
        this.render(document.getElementsByClassName('body-cnt')[0]);
        this.localEventBus.getEvent('checkAuthorizationResponse', this.onCheckAuthResponse.bind(this));

        this.chatIsShown = false;
        this.localEventBus.getEvent('showChat', this.onShowingChat.bind(this));
        this.localEventBus.getEvent('hideChat', this.onHidingChat.bind(this));
    }

    onCheckAuthResponse({isAuthorized = false}) {
        this.isAuth = isAuthorized;
        const checkHeader = new userBlock();
        let signoutButton;
        // const MW = new ModalWindow();
        // const singleButton = document.getElementsByClassName('js-single')[0];
        // const multiButton = document.getElementsByClassName('js-multi')[0];

        if (checkHeader.changeButtons(isAuthorized)) {
            signoutButton = document.getElementsByClassName('js-signout')[0];
        }

        signoutButton.addEventListener('click', () => {
            this.isAuth = false;
            this.localEventBus.callEvent('signOut');
        });
    }

    // singleButton.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     MW.createModal('Game training');
    // });

    // multiButton.addEventListener('click', (event) => {
    //     if (this.isAuth) {
    //         event.preventDefault();
    //         MW.createModal('Menu multi waiting for player');
    //     } else {
    //         event.preventDefault();
    //         MW.createModal('Menu multi error login');
    //     }
    // });

    onShowingChat() {
        let chatButton = document.getElementsByClassName('js-chat-btn')[0];
        let returnChatButton = document.getElementsByClassName('js-hidden-chat-btn')[0];

        chatButton.addEventListener('click',  () => {
            if (!this.chatIsShown) {
                document.getElementsByClassName('js-chat-window')[0].classList.remove('hide');
                chatButton.classList.add('hide');
                this.chatIsShown = true;
            }
        });

        returnChatButton.addEventListener('click',  () => {
            if (!this.chatIsShown) {
                document.getElementsByClassName('js-chat-window')[0].classList.remove('hide');
                returnChatButton.classList.add('hide');
                this.chatIsShown = true;
            }
        });

        const messageInput = document.getElementsByClassName('js-message-input')[0];
        messageInput.addEventListener('keydown', (event) => {
            if (event.keyCode !== 13) {
                this.chat.sendMessage('TYPING', messageInput.value);
            } else {
                this.chat.sendMessage('NEW', messageInput.value);
            }
        });
    }

    onHidingChat() {
        const closeChatButton = document.getElementsByClassName('js-close-chat')[0];
        const hideChatButton = document.getElementsByClassName('js-hide-chat')[0];

        closeChatButton.addEventListener('click', () => {
            if (this.chatIsShown) {
                document.getElementsByClassName('js-chat-window')[0].classList.add('hide');
                document.getElementsByClassName('js-chat-btn')[0].classList.remove('hide');
                this.chatIsShown = false;
            }
        });

        hideChatButton.addEventListener('click', () => {
            if (this.chatIsShown) {
                document.getElementsByClassName('js-chat-window')[0].classList.add('hide');
                document.getElementsByClassName('js-hidden-chat-btn')[0].classList.remove('hide');
                this.chatIsShown = false;
            }
        });
    }

    render(root, data = {}) {
        super.render(root, data);
        this.localEventBus.callEvent('checkAuthorization');
    }
}
