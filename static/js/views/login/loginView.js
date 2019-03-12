import View from '../../libs/views.js';

export default class loginView extends View {
    constructor({ eventBus = {} }) {
        super('login/loginView.tmpl', eventBus);
        this.render(document.getElementsByClassName('body-cnt')[0]);
        this.localEventBus.getEvent('loginResponse', this.onSubmitResponse.bind(this));
    }

    render(root, data = {}) {
        super.render(root, data);

        const form = document.getElementsByClassName('form')[0];
        form.addEventListener('submit', this.onSubmit.bind(this, form));
    }

    onSubmit (form, event) {
        event.preventDefault();
        const data = {
            loginOrEmail: form.elements['login-or-email'].value,
            pass: form.elements['password-input'].value
        };
        this.localEventBus.callEvent('login', data);
    }

    onSubmitResponse (data) {
        const error = data.error;
        console.log(error);
    }
}
