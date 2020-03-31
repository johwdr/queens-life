'use strict';

import './navigation.scss'



export default class Navigation {
    constructor(caller) {
        this.caller = caller;

        if (!this.caller.wrapper) {
            return
        }

        this.firstPause = false;
        this.firstForward = false;
        this.firstBackward = false;

        this.build();
    }
    setActiveSlide(slide) {

        this.activeSlide = slide;

        if (slide === 0) {
            this.backArrow.classList.add('arrow-hidden')
        } else {
            this.backArrow.classList.remove('arrow-hidden')
        }



        if ((slide >= this.caller.noSlides)) {
            this.forwardArrow.classList.add('arrow-hidden')
        } else {
            this.forwardArrow.classList.remove('arrow-hidden')
        }
        //this.backArrow.style.display = (slide === 0 || (slide >= this.caller.noSlides - 1)) ? 'none' : 'block';
        //this.forwardArrow.style.display = (slide >= this.caller.noSlides-1) ? 'none' : 'block';

    }
    getWrapper() {
        return this.innerWrapper
    }
    build() {
        let events;
        if (this.isTouchDevice()) {
            events = {
                start: 'touchstart',
                end: 'touchend'
            }
        } else {
            events = {
                start: 'mousedown',
                end: 'mouseup'
            }
        }

        const innerWrapper = document.createElement('div');
        innerWrapper.id = 'buttons-wrapper';
        this.innerWrapper = innerWrapper;

        const forward = document.createElement('div');
        const back = document.createElement('div');





        //forward.innerText = 'frem';
        forward.id = 'forward-button'
        forward.classList.add('navigation-button')

        //back.innerText = 'tilbage';
        back.id = 'back-button'
        back.classList.add('navigation-button')


        const forwardArrow = document.createElement('a');
        const backArrow = document.createElement('a');

        forwardArrow.classList.add('navigation-arrow')
        forwardArrow.id = 'forward-arrow'
        forwardArrow.href = ''
        forwardArrow.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 70 70" style="enable-background:new 0 0 70 70;" xml:space="preserve"><style type="text/css"> .st0{fill:white;}</style><path class="st0" d="M35.2,0.2c-19.3,0-35,15.7-35,35s15.7,35,35,35c19.3,0,35-15.7,35-35S54.6,0.2,35.2,0.2z M31.6,52l-6.5-6.3 l10.4-10.4L25.1,24.9l6.5-6.3l16.7,16.7L31.6,52z"/></svg>`;
        backArrow.classList.add('navigation-arrow')
        backArrow.id = 'back-arrow'
        backArrow.href = ''
        backArrow.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 70 70" style="enable-background:new 0 0 70 70;" xml:space="preserve"><style type="text/css"> .st0{fill:white;}</style><path class="st0" d="M35.2,70.2c19.3,0,35-15.7,35-35s-15.7-35-35-35c-19.3,0-35,15.7-35,35S15.9,70.2,35.2,70.2z M38.9,18.5 l6.5,6.3L35,35.2l10.4,10.4L38.9,52L22.2,35.2L38.9,18.5z"/></svg>`



        if (this.caller.goForward) {
            forward.addEventListener(events.start, () => {
                this.mouseDown('forward')
            })
            forward.addEventListener(events.end, () => {
                this.mouseUp()
            })
            forwardArrow.addEventListener('click', (event) => {
                event.preventDefault();
                this.caller.pingvin.ping('forward-arrow')
                this.caller.goForward();
            })
        }
        if (this.caller.goBack) {

            back.addEventListener(events.start, () => {
                this.mouseDown('back')
            })
            back.addEventListener(events.end, () => {
                this.mouseUp()
            })
            backArrow.addEventListener('click', (event) => {
                event.preventDefault();
                this.caller.pingvin.ping('backward-arrow')
                this.caller.goBack();
            })

        }

        if (this.caller.goBack && this.caller.goForward) {
            document.addEventListener('keyup', (e) => {
                if (e.code === "ArrowRight") {
                    this.caller.pingvin.ping('forward-key')
                    this.caller.goForward();
                }
                else if (e.code === "ArrowLeft") {
                    this.caller.pingvin.ping('backward-key')
                    this.caller.goBack();
                }
                if (e.code === "Space") {
                    this.mouseUp()
                }
            });

            document.addEventListener('keydown', (e) => {

                if (e.code === "Space") {
                    this.mouseDown('Space')
                }
            })
        }
        innerWrapper.appendChild(forward);
        innerWrapper.appendChild(back);

        this.caller.wrapper.appendChild(innerWrapper);

        this.caller.wrapper.appendChild(forwardArrow);
        this.caller.wrapper.appendChild(backArrow);

        this.backArrow = backArrow;
        this.forwardArrow = forwardArrow;
        this.forward = forward;
        this.back = back;
    }
    mouseDown(direction) {

        this.longpress = false;
        this.direction = direction;
        this.caller.pause();

        this.timeout = setTimeout(() => {
            this.longpress = true;
        }, 200)
    }

    mouseUp() {
        clearTimeout(this.timeout);

        this.caller.restart();
        if (this.longpress) {
            this.caller.pingvin.ping('pause')
            if (!this.firstPause) {
                this.caller.pingvin.ping('first-pause')
                this.firstPause = true;
            }
            return;
        }
        if (this.direction === 'forward') {
            this.caller.pingvin.ping('forward')
            if (!this.firstForward) {
                this.caller.pingvin.ping('first-forward')
                this.firstForward = true;
            }
            this.caller.goForward();
        } else if (this.direction === 'back') {
            this.caller.pingvin.ping('backward')
            if (!this.firstBackward) {
                this.caller.pingvin.ping('first-backward')
                this.firstBackward = true;
            }
            this.caller.goBack();
        }


    }
    isTouchDevice() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mq = function (query) {
            return window.matchMedia(query).matches;
        }

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }

        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }
    end() {

        this.forward.classList.add('navigation-button-removed')
        this.back.classList.add('navigation-button-removed')

    }
    hide() {
        this.innerWrapper.classList.add('navigation-hidden')
        this.backArrow.classList.add('navigation-hidden')
        this.forwardArrow.classList.add('navigation-hidden')

    }


    restart() {
        this.forward.classList.remove('navigation-button-removed')
        this.back.classList.remove('navigation-button-removed')

    }

}