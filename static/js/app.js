// import eventBus from './libs/eventBus.js';
import menuController from './controllers/menuCtrl.js';
import aboutController from './controllers/aboutCtrl.js';
import loginController from './controllers/loginCtrl.js';
import signUpController from './controllers/signUpCtrl.js';
import leaderboardController from './controllers/leaderboardCtrl.js';
import profileController from './controllers/profileCtrl.js';

import Router from './libs/router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('debug point: start work!');

    const page = document.querySelector('.body-cnt');
    createPage(page);
    const main = document.querySelector('.main-container');
    const router = new Router(page);

    const menuCntl = new menuController();
    const aboutCtrl = new aboutController();
    const loginCtrl = new loginController({router});
    const signUpCtrl = new signUpController({router});
    const leaderboardCtrl = new leaderboardController();
    const profileCtrl = new profileController({router});

    router.add('/about', main, aboutCtrl.aboutView);
    router.add('/login', main, loginCtrl.loginView);
    router.add('/signup', main, signUpCtrl.signUpView);
    router.add('/leaders', main, leaderboardCtrl.leaderboardView);
    router.add('/profile', main, profileCtrl.profileView);
    router.add('/', main, menuCntl.menuView);

    router.start();
});

function createPage(page) {
    page.innerHTML = '<main class="main-container"></main>';
}
