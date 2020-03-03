'use strict';

import './selector.scss'



export default class Selector {
    constructor(callback) {


        this.isBirthYear = true;
        this.callback = callback;
        this.container = document.createElement('div');
        this.container.id = 'story-selector-wrapper';
        this.build();

    }
    hide() {
        this.container.classList.add('hidden');
    }

    build() {


        this.digitsInput = [];
        this.currentDigits = [];

        for (let n=0; n<4; n++) {

            this.currentDigits[n] = null;

            const input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('id', 'y' + n);
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('maxlength', '1');
            if (n===0) {
                input.setAttribute('pattern', '[1-2]');
                input.setAttribute('min', '1');
                input.setAttribute('max', '2');
                input.setAttribute('autofocus', 'true');
            } else {
                input.setAttribute('pattern', '[0-9]');
                input.setAttribute('min', '0');
                input.setAttribute('max', '9');
            }
            input.addEventListener('keydown', (event) => {
                if (this.isValid(event)) {
                    setTimeout(() => {
                        this.handleInput(event);

                    },10)
                } else if (this.isMoveChar(event)) {
                    this.moveFocus(event);
                } else {
                    event.preventDefault();
                }
            })
            input.addEventListener('focus', (event) => {
                event.target.value = ''
            })
            this.container.appendChild(input);
            this.digitsInput[n] = input;
        }




    }
    isValid(event) {
        // Max one char
        if (event.target.value > 0) {
            return false
        }
        // Dissallow other chars than numbers
        if (event.which != 0 && event.which < 48 || event.which > 57) {
            return false
        }

        // If first fields disallow others than 1 and 2
        console.log(event.target.id)
        if (event.target.id === 'y0' && (event.which < 48 || event.which > 50)) {
            console.log('first')
            return false
        }
        // If first fields disallow others than 1 and 2
        if (event.target.id === 'y1' && (event.which != 48 && event.which != 57)) {
            console.log('second')
            return false
        }

        return true;

    }

    isMoveChar(event) {


        return ([8, 37, 39].indexOf(event.which) > -1) ;

    }
    handleInput(event) {



        console.log('handle input: ' + event)

        const currentDigit = Number(event.target.id[1]);

        this.currentDigits[currentDigit] = this.digitsInput[currentDigit].value

        if (currentDigit < 3) {
            this.digitsInput[currentDigit+1].focus()
        }


        if (currentDigit === 3 && this.allValid()) {
            const year = Number(this.digitsInput[0].value + this.digitsInput[1].value + this.digitsInput[2].value + this.digitsInput[3].value);
            console.log('GOITO: ' + year);

            if (this.isBirthYear) {
                this.callback(this.convertBirthYear(year));
            } else {
                this.callback(year)
            }
            // goto year
        }
        if (currentDigit === 3 && !this.allValid()) {

            if (this.missingDigit()) {
                this.gotoMissingDigit();
            }
        }

    }
    convertBirthYear(year) {
        const age = 2020 - year;
        const queenYear = 1940 + age;
        return queenYear;
    }
    missingDigit() {
        for (let n = 0; n < 4; n++) {
            if (this.digitsInput[n].value.length < 1) {
                return true;
            }
        }
        return false;
    }
    gotoMissingDigit() {
        for (let n = 0; n < 4; n++) {
            if (this.digitsInput[n].value.length < 1) {
                this.digitsInput[n].focus();
            }
        }

    }
    allValid() {

        const year = Number(this.digitsInput[0].value + this.digitsInput[1].value + this.digitsInput[2].value + this.digitsInput[3].value);

        return (year > 1900 && year <= 2020);

    }
    moveFocus(event) {

        const currentDigit = Number(event.target.id[1]);

        // backspace
        console.log(event.which)
        if (event.which === 8) {

            this.digitsInput[currentDigit].value = '';
            if (currentDigit > 0) {
                setTimeout(() => {

                    this.digitsInput[currentDigit-1].focus()
                }, 10)
            }

            // delete and move back
        }
        if (event.which === 37) {
            // move back
            if (currentDigit > 0) {
                setTimeout(() => {
                    if (this.digitsInput[currentDigit].value.length === 0 && this.currentDigits[currentDigit] !== null) {
                        this.digitsInput[currentDigit].value = this.currentDigits[currentDigit];
                    }
                    this.digitsInput[currentDigit-1].focus()
                }, 10)
            }
        }
        if (event.which === 39) {
            // move forward
            if (currentDigit < 3) {
                setTimeout(() => {
                    if (this.digitsInput[currentDigit].value.length === 0 && this.currentDigits[currentDigit] !== null) {
                        this.digitsInput[currentDigit].value = this.currentDigits[currentDigit];
                    }
                    this.digitsInput[currentDigit+1].focus()
                }, 10)
            }
        }
        console.log('move focus: ' + event)
    }


}