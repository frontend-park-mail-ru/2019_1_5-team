import View from '../../libs/views.js';

export default class loginView extends View {
    constructor({ eventBus = {} }) {
        super('login/loginView.tmpl', eventBus);
        this.render(document.querySelector('.body-cnt'));
        this.localEventBus.getEvent('loginResponse', this._onSubmitResponse.bind(this));
    }

    render(root, data = {}) {
        super.render(root, data);

        let form = document.querySelector('.form');
        this.warning = this.element.querySelector('.signin__warning');
        form.addEventListener('submit', this._onSubmit.bind(this, form));
    }

    _onSubmit (form, event) {
        event.preventDefault();
        const data = {
            loginOrEmail: form.elements['login-or-email'].value,
            pass: form.elements['password-imput'].value
        };
        this.localEventBus.callEvent('login', data);
    }

    _onSubmitResponse (data) {
        const error = data.error;
        console.log(error);
    }
}