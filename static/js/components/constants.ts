export const FIRST_POS = 1;

export const EVENT_LIST_ABOUT = [
    'checkAuthorizationResponse',
    'checkAuthorization',
    'signOut',
    'closeView'
];

export const EVENT_LIST_LEADERBOARS = [
    'checkAuthorizationResponse',
    'checkAuthorization',
    'load',
    'loadResponse',
    'loadPaginator',
    'loadPaginatorResponse',
    'checkAuthError',
    'signOut',
    'closeView'
];

export const EVENT_LIST_LOGIN = [
    'login',
    'loginResponse',
    'loginSuccess',
    'loadWaiting',
    'loginOrEmailRTCheck',
    'passwRTCheck',
    'loginOrEmailRTCheckResponse',
    'passwRTCheckResponse',
];

export const EVENT_LIST_MENU = [
    'checkAuthorizationResponse',
    'checkAuthorization',
    'signoutResponse',
    'signOut',
    'closeView'
];

export const EVENT_LIST_PROFILE = [
    'checkAuth',
    'checkAuthResponse',
    'loadUser',
    'loadUserResponse',
    'checkAuthError',
    'changeEmail',
    'changeEmailResponse',
    'changePassword',
    'changePasswordResponse',
    'changeAvatar',
    'changeAvatarResponse',
    'changeAvatarSuccess',
    'submitEmail',
    'submitEmailResponse',
    'submitEmailSuccess',
    'submitPassword',
    'submitPasswordResponse',
    'submitPasswordSuccess',
    'logOutResponse',
    'signOut',
    'closeView'
];

export const EVENT_LIST_SIGNUP = [
    'signup',
    'signupResponse',
    'signupSuccess',
    'changeEmail',
    'changeEmailResponse',
    'changeLogin',
    'changeLoginResponse',
    'changePassword',
    'changePasswordResponse',
    'changePasswordRepeat',
    'changePasswordRepeatResponse',
    'loadWaiting',
    'loginRTCheck',
    'emailRTCheck',
    'passwRTCheck',
    'loginRTCheckResponse',
    'emailRTCheckResponse',
    'passwRTCheckResponse',
];

export const EVENT_LIST_GAME_SINGLE = [
    'getUserDataForGame',
    'onGetUserDataForGameResponse',
    'gameOver',
    'stopGameManualy',
    'startGame',
    'gameOverRender',
    'updateState',
    'callingGameWS',
    'sendButton'
];

export const EVENT_LIST_GAME_MULTI = [
    'stopGameManualy',
    'startGame',
    'gameOver',
    'gameOverFirstLost',
    'gameOverSecondLost',
    'gameMultiEnd',
    'firstLost',
    'secondLost',
    'startWs',
    'stopToBack',
    'updateState',
    'callingGameWS',
    'sendButton'
];

export const NETWORK_ADRESS = 'http://95.163.180.8:8001';
export const NETWORK_ADRESS_WS_GAME = 'ws://95.163.180.8:8003/api/game/ws';
// export const NETWORK_ADRESS = 'http://localhost:5051';

export const DEFAULT_AVATAR = '';
export const AVATAR_DEFAULT = '../../../img/default.jpg';


// game constants
export const DEFAULT_GHOST_SPEED = 80;
export const DEFAULT_GHOST_DAMAGE = 1;

export const PLAYER_INITIAL_HP = 5;
export const SCORE_FOR_SYMBOL = 10;
export const SCORE_FOR_GHOST = 60;


export const ANAUTH_RESPONSE = 401;
export const OK_RESPONSE = 200;

export const COUNT_OF_PAGES = 5;
export const NUM_OF_POSITIONS = 5;

export const EMAIL_EXPRESSION = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/);
export const LOGIN_EXPRESSION = new RegExp(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/);
export const PASSWORD_EXPRESSION = new RegExp(/[^а-яёА-ЯЁ]{4,}$/);

export const EMPTY_LOGIN = 'Login field is empty';
export const EMPTY_EMAIL = 'Email field is empty';
export const EMPTY_PASSWORD = 'Password field is empty';

export const INCORRECT_EMAIL = 'Email should contain "@" and latin letters, numbers, special symbols';
export const INCORRECT_LOGIN = 'Login should have 4-20 symbols and contain latin letters and numbers';
export const INCORRECT_PASSWORD = 'Password should has at least 4 symbols and not contain russian letters';

export const OK_VALIDATE_LOGIN = 'Ok login';
export const OK_VALIDATE_EMAIL = 'Ok email';
export const OK_VALIDATE_PASSWORD = 'Ok password';
export const OK_VALIDATE_AVATAR = 'Ok avatar';

export const JPEG_AVATAR_FORMAT = 'image/jpeg';
export const PNG_AVATAR_FORMAT = 'image/png';

export const INCORRECT_LOGIN_OR_EMAIL = 'Incorrect login or email!';
export const INCORRECT_AVATAR_FORMAT = 'Avatar must be jpeg or png format!';

export const MAP_OF_MODALS = new Map ([
    ['Game multi end', ''],
    ['Game multi leave', ''],
    ['Game training', '<h1 class="text-title modal-window__header">Do you want to start training?</h1><div class="modal-window-btns"><button class="btn btn_inlined modal-window__btn js-skip-training">No</button><button class="btn btn_contained modal-window__btn js-start-training">Yes</button></div>'],
    ['Game single end', '<h1 class="text-title modal-window__header">Game Over! You Lost!</h1><p class="js-set-final-score"></p><a class="btn btn_contained js-back-to-menu-modal" href="/">Back to menu</a>'],
    ['Game single pause', ''],
    ['Game single leave', ''],
    ['Menu multi waiting for player', '<h1 class="text-title modal-window__header">Please, wait. We are looking for your opponent...</h1><button class="btn btn_contained modal-window__btn js-close-mw">Cancel</button>'],
    ['Menu multi error login', '<h1 class="text-title modal-window__header">To play multiplayer you need to be logged in!</h1><button class="btn btn_contained modal-window__btn js-close-mw">Close</button>'],
    ['Profile change password', '<h1 class="text-title modal-window__header">Change password</h1><div class="modal-window__input-rows"><label class="form__label"><input class="form__input form__input_profile js-password-old" type="password" id="old-password" placeholder="Enter old password" autocomplete="current-password"/></label><label class="form__label"><input class="form__input form__input_profile js-password-new" type="password" id="new-password" placeholder="Enter new password" autocomplete="new-password"/></label></div><button class="btn btn_contained modal-window__btn form__btn form__btn_change-password js-button-submit" type="submit">Change</button>'],
    ['Profile change password success', '<h1 class="text-title modal-window__header">Password successfully changed!</h1><button class="btn btn_contained modal-window__btn js-close-mw">Close</button>'],
    ['Shop error login', ''],
    ['mobileBlock', '<h1 class="text-title modal-window__header">Sorry, game is not avaliable on phone... For now...</h1><button class="btn btn_contained modal-window__btn js-close-mw">Cancel</button>'],
]);

export const MAP_OF_USER_BLOCKS = new Map([
    ['isAuth block', '<a class="btn users__btn users__btn_profile" href="/profile"></a><a class="btn users__btn users__btn_logout js-signout" href="/"></a>'],
    ['unAuth block', '<a class="btn users__btn login-btn" href="/login">login</a><a class="btn users__btn signup-btn" href="/signup">signup</a>'],
    ['inGame unAuth', '<a class="btn users__btn signup-btn js-back-to-menu" href="/">Back to menu</a>'],
]);