'use strict';

import './progress.scss'

export default class Progress {
    constructor(container, noSlides) {
        this.container = container;
        this.noSlides = noSlides;
        this.build();
    }

    build() {
        this.progressEl = document.createElement('div');
        this.progressEl.id = 'story-progress-element';
        this.progressSlideEls = [];
        for (let n = 0; n < this.noSlides; n++) {
            const slideEl = document.createElement('div');
            slideEl.classList.add('story-progress-element-slide');

            const slideProgress = document.createElement('div');
            slideProgress.classList.add('story-progress-element-slide-progress');
            slideProgress.style.transform =  'scaleX(0)';

            slideEl.appendChild(slideProgress);
            this.progressSlideEls.push(slideProgress);

            this.progressEl.appendChild(slideEl);


        }
        this.container.appendChild(this.progressEl);
    }
    reset(currentSlide) {
        for (let n = currentSlide; n < this.noSlides; n++ ) {
            this.progressSlideEls[n].style.transform = 'scaleX(0)';
        }
    }
    update(currentSlide, progress) {

        if (currentSlide > 0) {
            for (let n = 0; n < currentSlide; n++) {
                this.progressSlideEls[n].style.transform = 'scaleX(1)';
            }
        }
        this.progressSlideEls[currentSlide].style.transform = 'scaleX(' + progress + ')';
    }
    end() {
        this.progressEl.classList.add('story-progress-element-hidden')
        this.progressSlideEls[this.progressSlideEls.length - 1].style.transform = 'scaleX(1)';
    }
}