import Jager from '../../libs/jager.js';

export default class Recognizer {

    constructor() {
        this.jager = new Jager();

        this.gestureNames = [
            'none', 'click', 'horizontal', 'vertical',
            '^', 'v', '>', '<',
            'pigtail', 'reverse pigtail', 'lightning', 'circle'
        ];

        this.gcanvas = document.getElementsByClassName('canvas_recognizer')[0];
        this.gctx = this.gcanvas.getContext('2d');
        this.gctx.fillStyle = '#FF0000';

        this.mouseIsDown = false;
        this.path = [];

        this.gcanvas.addEventListener('mousedown',  this.gestureStart.bind(this));
        this.gcanvas.addEventListener('mousemove',  this.gestureMove.bind(this));
        this.gcanvas.addEventListener('mouseup',    this.gestureEnd.bind(this));
        this.gcanvas.addEventListener('mouseout',   this.gestureEnd.bind(this));

        this.gcanvas.addEventListener('touchstart', this.gestureStart.bind(this));
        this.gcanvas.addEventListener('touchmove', this.gestureMove.bind(this));
        this.gcanvas.addEventListener('touchcancel', this.gestureEnd.bind(this));
        this.gcanvas.addEventListener('touchend', this.gestureEnd.bind(this));

        this.gcanvas.addEventListener('touchstart', this.gestureStart.bind(this));
        this.gcanvas.addEventListener('touchmove',  this.gestureMove.bind(this));
        this.gcanvas.addEventListener('touchend',   this.gestureEnd.bind(this));

        // this.tick();
    }

    destroyRecognizer() {
        // console.log('before', this.tick);
        // if (this.tick.bind(this)) {
        //     cancelAnimationFrame(this.tick.bind(this));
        // }
        // console.log('after', this.tick.bind(this));
        this.jager = null;
        this.gcanvas.removeEventListener('mousedown',  this.gestureStart.bind(this));
        this.gcanvas.removeEventListener('mousemove',  this.gestureMove.bind(this));
        this.gcanvas.removeEventListener('mouseup',    this.gestureEnd.bind(this));
        this.gcanvas.removeEventListener('mouseout',   this.gestureEnd.bind(this));

        this.gcanvas.removeEventListener('touchstart', this.gestureStart.bind(this));
        this.gcanvas.removeEventListener('touchmove',  this.gestureMove.bind(this));
        this.gcanvas.removeEventListener('touchend',   this.gestureEnd.bind(this));

        this.gcanvas.remove();
    }

    gestureStart(evt) {
        this.mouseIsDown = true;
        this.path = [this.jager.point(evt)];
        evt.preventDefault();
        return false;
    }

    gestureMove(evt) {
        if (this.mouseIsDown) {
            this.path.push(this.jager.point(evt));
            evt.preventDefault();
            return false;
        }
        return true;
    }

    gestureEnd(evt) {
        var gesture;
        if (this.mouseIsDown) {
            this.mouseIsDown = false;

            gesture = this.jager.recognise(this.path, 5000, true);
            console.log(this.gestureNames[gesture]);
            this.gctx.clearRect(0, 0, this.gcanvas.scrollWidth, this.gcanvas.scrollHeight);

            return false;
        }
        return true;
    }

    // tick() {
    //     if (this.mouseIsDown) {
    //         this.gctx.clearRect(0, 0, this.gcanvas.scrollWidth, this.gcanvas.scrollHeight);
    //         this.jager.drawPatch(this.path, this.gctx, this.jager.recognise(this.path));
    //     }
    //
    //     requestAnimationFrame(this.tick.bind(this));
    // }
}