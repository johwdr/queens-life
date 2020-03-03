'use strict';

import './end.scss'

export default class End {
    constructor(selector) {
        this.selector = selector;
        return this.build();
    }

    build() {

        this.container = document.createElement('div');

        this.container.id = 'end-container'
        this.container.classList.add('story-slide');
        this.container.classList.add('end-slide-hidden');

        this.endSlideContent = document.createElement('div');

        this.endSlideContent.innerHTML = `

            <h1><span class="story-text-hilite">SLUT</span></h1>
        `;
        this.container.appendChild(this.endSlideContent)

        this.container.appendChild(this.selector)

        return this;
    }
    show() {
        this.container.classList.remove('end-slide-hidden');
    }
    hide() {
        this.container.classList.add('end-slide-hidden');
    }
}