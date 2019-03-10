import View from '../../libs/views.js';

export default class aboutView extends View {
    constructor({ eventBus = {} } = {}) {
        super('about/about.tmpl', eventBus);
        this.render(document.getElementsByClassName('body-cnt')[0]);
    }

    render(root, data = {}) {
        super.render(root, data);
    }
}