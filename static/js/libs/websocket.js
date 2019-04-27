export default class Ws {
    constructor(eventBus = {}, inputAddress) {
        // debugger;
        this.localEventBus = eventBus;
        if (this.localEventBus !== null) {
            this.localEventBus.getEvent('sendButton', this.send.bind(this));
        }

        if (Ws.__instance) {
            return Ws.__instance;
        }
        let address;

        if (inputAddress !== null) {
            address = inputAddress;
        } else {
            address = 'ws://78.155.207.69:5051/api/game/ws';
        }
        this.webs = new WebSocket(address);

        this.webs.onopen = () => {
            console.log(`WebSocket on address ${address} opened`);

            this.webs.onclose = () => {
                console.log(`WebSocket closed`);
            };

            this.webs.onmessage = this.handleMessage.bind(this);
        };

        Ws.__instance = this;
    }

    closeConn() {
        this.webs.close();
    }

    handleMessage(event) {
        if (event === undefined) {
            return;
        }
        const messageText = event.data;
        const message = JSON.parse(messageText);
        console.log(message);

        if (message.type === 'STATE') {
            this.localEventBus.callEvent('updateState', message.payload);
        }

        if (message.type === 'END') {
            this.localEventBus.callEvent('gameOverWS');
        }

        if (message.type === 'EXIST') {
            console.log('updating chat');
        }

        try {
            return {type: message.type, payload: message.payload};
        } catch (err) {
            console.error('smth went wront in handleMessage: ', err);
        }
    }

    send(type, payload) {
        if (type === 'NEW') {
            console.log(JSON.stringify({type, text: payload}));
            this.webs.send(JSON.stringify({type, text: payload}));
        }
        console.log(JSON.stringify({type, payload}));
        this.webs.send(JSON.stringify({type, payload}));
    }
}