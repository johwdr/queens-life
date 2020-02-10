'use strict';

import './pointer.scss'

export default class Pointer {
    constructor(el) {
        this.enabled = true;
        this.triggerElement = el;
        this.defaultText = 'Hold for pause'
        if (!this.isTouchDevice()) {
            this.build();
            this.setupEvents();
            this.animate();
        }
    }

    build() {


        this.holdLabel = document.createElement('div');
        this.holdLabel.id = 'hold-label';
        this.holdLabel.innerText = this.defaultText;
        this.body = document.body;
        this.body.appendChild(this.holdLabel);
        this.triggerElement.classList.add('cursor-free')

    }
    reenable() {
        if (!this.holdLabel) {
            return;
        }
        this.holdLabel.style.display = 'block';
        this.triggerElement.classList.remove('cursor-free')
        this.enabled = true;
        this.animate();
    }

    end() {
        this.triggerElement.classList.add('cursor-free')
        if (!this.holdLabel) {
            return;
        }
        this.holdLabel.style.display = 'none';
    }

    setupEvents() {

        this.triggerElement.addEventListener('mouseenter', (event) => {
            this.holdLabel.classList.add('active')
            this.active = true;
        })

        this.triggerElement.addEventListener('mouseleave', () => {
            this.holdLabel.classList.remove('active')
            this.active = false;
        })

        this.body.addEventListener('mousemove', (event) => {
                this.x = event.clientX;
                this.y = event.clientY;
        })
        this.body.addEventListener('mousedown', () => {

            this.holdLabel.classList.add('pressed')
            this.pressed = true;
        })

        this.body.addEventListener('mouseup', () => {
            this.holdLabel.classList.remove('pressed')
            this.pressed = false;
        })


    }
    animate() {

        let transformString = '';
        transformString += `translate3d(${this.x - 40}px, ${this.y - 40}px, 0) `;
        if (this.pressed || !this.active) {
            transformString += 'scale3d(0.1, 0.1, 0.1) '
        } else {
            transformString += 'scale3d(1, 1, 1) ';
        }

        this.holdLabel.style.transform = transformString;
        if (this.enabled) {
            requestAnimationFrame(() => {
                this.animate();
            })
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

}