'use strict';

import './frontpage.scss'

export default class Frontpage {
    constructor(selector) {
        this.selector = selector;
        this.build();
    }


    build() {

        this.container = document.createElement('div');
        this.container.id = 'frontpage-container'
        this.container.classList.add('story-slide');

        this.frontpageContent = document.createElement('div');

        this.frontpageContent.innerHTML = `

            <h1><span class="story-text-hilite">Hvad lavede dronningen, da hun var på din alder</span></h1>
        `;
        this.container.appendChild(this.frontpageContent)

        this.container.appendChild(this.selector)

        return {
            container: this.container
        }
    }
    hide() {
        this.container.classList.add('frontpage-hidden')
    }
}