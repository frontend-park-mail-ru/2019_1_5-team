import { MAP_OF_MODALS } from './constants.js';

export default class ModalWindow {

    createModal(element) {
        const modalElement = document.getElementsByClassName('modal-window')[0];
        modalElement.classList.remove('hide');
        modalElement.innerHTML = '<div class="blur"></div><div class="modal"><div class="content content_modal"></div></div>';
        const divToAppend = document.getElementsByClassName('content_modal')[0];
        const elemToRender = MAP_OF_MODALS.get(element);
        divToAppend.innerHTML = elemToRender;

        this.noCase = document.getElementsByClassName('js-skip-training')[0];
        this.closeMW = document.getElementsByClassName('js-close-mw')[0];
        this.blur = document.getElementsByClassName('blur')[0];

        if (this.noCase !== undefined) {
            this.noCase.addEventListener('click', (event) => {
                event.preventDefault();
                this.removeModal();
            });
        }

        if (this.blur !== undefined) {
            this.blur.addEventListener('click', (event) => {
                event.preventDefault();
                this.removeModal();
            });
        }

        if (this.closeMW !== undefined) {
            this.closeMW.addEventListener('click', (event) => {
                event.preventDefault();
                this.removeModal();
            });
        }
    }

    removeModal() {
        const modalElement = document.getElementsByClassName('modal-window')[0];
        modalElement.classList.add('hide');
        modalElement.innerHTML = '';
    }
}