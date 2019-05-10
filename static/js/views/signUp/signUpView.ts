import View from '../../libs/views';
import template from './signUpView.tmpl.xml';

import {OK_VALIDATE_EMAIL, OK_VALIDATE_LOGIN, OK_VALIDATE_PASSWORD} from '../../components/constants';

import '../../components/userBlock/userblock.scss';
import '../../../css/form.scss';
import EventBus from '../../libs/eventBus';

export default class signUpView extends View {
    form: HTMLFormElement;
    passwordInput: HTMLInputElement;
    constructor(eventBus: EventBus) {
        super(template, eventBus);
        this.render(document.getElementsByClassName('body-cnt')[0]);
        this.localEventBus.getEvent('signupResponse', this.onSignupResponse.bind(this));
    }

    render(root: Element, data = {}) {
        super.render(root, data);

        this.form = (document.getElementsByClassName('js-signup-form')[0] as HTMLFormElement);
        this.passwordInput = this.form.elements['password'];
        const submit = document.getElementsByClassName('js-submit')[0];
        submit.addEventListener('click', (event) => {
            event.preventDefault();
            this.onSubmit();
        });
        return this;
    }

    onSignupResponse(data: { arrReturn: string[]; error: string; }, check = 0) {
        const elementEmail = document.getElementsByClassName('js-email')[0];
        const elementLogin = document.getElementsByClassName('js-login')[0];
        const elementPassword = document.getElementsByClassName('js-password')[0];

        const emailWarning = document.getElementsByClassName('js-warning-email')[0];
        const loginWarning = document.getElementsByClassName('js-warning-login')[0];
        if (check !== 0) {
            if (data.arrReturn[0] !== OK_VALIDATE_EMAIL) {
                emailWarning.classList.remove('hide');
                elementEmail.classList.remove('valid');
                elementEmail.classList.add('invalid');
                emailWarning.innerHTML = data.arrReturn[0];
            } else {
                elementEmail.classList.remove('invalid');
                elementEmail.classList.add('valid');
                emailWarning.classList.add('hide');
            }

            const loginWarning = document.getElementsByClassName('js-warning-login')[0];
            if (data.arrReturn[1] !== OK_VALIDATE_LOGIN) {
                loginWarning.classList.remove('hide');
                elementLogin.classList.remove('valid');
                elementLogin.classList.add('invalid');
                loginWarning.innerHTML = data.arrReturn[1];
            } else {
                elementLogin.classList.remove('invalid');
                elementLogin.classList.add('valid');
                loginWarning.classList.add('hide');
            }

            const passwordWarning = document.getElementsByClassName('js-warning-password')[0];
            if (data.arrReturn[2] !== OK_VALIDATE_PASSWORD) {
                passwordWarning.classList.remove('hide');
                elementPassword.classList.remove('valid');
                elementPassword.classList.add('invalid');
                passwordWarning.innerHTML = data.arrReturn[2];
            } else {
                elementPassword.classList.remove('invalid');
                elementPassword.classList.add('valid');
                passwordWarning.classList.add('hide');
            }
        }
        if (data.error === 'email conflict') {
            emailWarning.textContent = 'This email is used!';
        } else if (data.error === 'login conflict') {
            loginWarning.textContent = 'This login is used!';
        } else {
            loginWarning.textContent = 'Server is not OLLO';
        }
    }

    onSubmit() {
        const email: String | string = this.form.elements['email'].value;
        const login: String | string = this.form.elements['login'].value;
        const pass: String | string = this.form.elements['password'].value;

        this.localEventBus.callEvent('signup', { email, login, pass });
    }
}