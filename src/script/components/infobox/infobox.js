'use strict';

import './infobox.scss';

const closerSVG = `
    <svg version="1.1" id="closer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 70 70" style="enable-background:new 0 0 70 70;" xml:space="preserve">
        <g>
            <rect x="0" y="33.6" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -14.4975 35)" class="info-element" width="70" height="2.8"/>
            <rect x="33.6" y="0" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -14.4975 35)" class="info-element" width="2.8" height="70"/>
        </g>
    </svg>
`

const infoSVG = `
    <svg version="1.1" id="opener" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 70 70" style="enable-background:new 0 0 70 70;" xml:space="preserve">
        <g>
            <path class="info-element" d="M35,70C15.7,70,0,54.3,0,35S15.7,0,35,0s35,15.7,35,35S54.3,70,35,70z M35,3.6C17.7,3.6,3.6,17.7,3.6,35
                S17.7,66.4,35,66.4S66.4,52.3,66.4,35S52.3,3.6,35,3.6z"/>
            <g>
                <path class="info-element" d="M35,21.7c-1.9,0-3.2-1.3-3.2-3c0-1.7,1.3-3,3.2-3c1.8,0,3.1,1.3,3.1,3C38.1,20.4,36.8,21.7,35,21.7z
                        M37.4,50.3h-4.8V26.5h4.8V50.3z"/>
            </g>
        </g>
    </svg>
`

export default class Infobox {
    constructor(config) {

        this.infoboxShown = false;
        this.config = config;
        this.buildBox();
        this.buildButton();

        return this;
    }

    buildBox() {

        const infobox = document.createElement('div');
        infobox.id = 'queens-life-info-box';

        infobox.innerHTML = `
            <div class="info-content-wrapper">${ this.config.credits }</div>
        `;

        infobox.addEventListener('click', () => {
            if (this.infoboxShown) {
                this.box.classList.remove('info-shown')
                this.button.innerHTML = infoSVG;
            }
            this.infoboxShown = !this.infoboxShown;
        })

        this.box = infobox


    }

    buildButton() {

        const button = document.createElement('button');
        button.id = 'queens-life-info-box-toggle';

        button.innerHTML = infoSVG;

        button.addEventListener('click', () => {
            if (this.infoboxShown) {
                this.box.classList.remove('info-shown')
                button.innerHTML = infoSVG;
            } else {
                this.box.classList.add('info-shown')
                button.innerHTML = closerSVG;
            }
            this.infoboxShown = !this.infoboxShown;
        })
        this.button = button


    }

}