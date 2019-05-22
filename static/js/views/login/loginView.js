import View from '../../libs/views';
import template from './loginView.tmpl.xml';

import '../../components/userBlock/userblock.scss';
import '../../../css/form.scss';

export default class loginView extends View {
    constructor(eventBus) {
        super(template, eventBus);
        this.render(document.getElementsByClassName('body-cnt')[0]);
        this.localEventBus.getEvent('loginResponse', this.onSubmitResponse.bind(this));
    }

    render(root, data = {}) {
        super.render(root, data);
        const form = document.getElementsByClassName('js-login-form')[0];
        form.addEventListener('submit', this.onSubmit.bind(this, form));
        return this;
    }

    onSubmit(form, event) {
        event.preventDefault();
        const data = {
            loginOrEmail: form.elements['login-or-email'].value,
            pass: form.elements['password-input'].value
        };
        this.localEventBus.callEvent('login', data);
    }

    onSubmitResponse(data) {
        const error = data.error;
        console.log(error);

        // TODO(): добавление стиля к полям, что все хуево, понять - почему не светится красным
        console.log(data);
        const incorrectField = document.getElementsByClassName(data.inputField)[0];
        incorrectField.classList.add('invalid');
    }
}
