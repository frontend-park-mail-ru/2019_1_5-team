import Ws from '../libs/websocket.js';
import { NETWORK_ADDRESS_CHAT } from './constants.js';

export default class chat {
    constructor() {
        this.websocket = new Ws(null, NETWORK_ADDRESS_CHAT);
    }
    
    sendMessage(type, message) {
        this.websocket.send(type, message);
    }

    close() {

    }
}