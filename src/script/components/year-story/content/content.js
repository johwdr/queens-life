'use strict';

import './content.scss'

const isIE11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);

const layoutTranslations = {
    top: 'top',
    bund: 'bottom',
    midt: 'center',
    spredt: 'spread'
}

export default class Content {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.slideEls = [];

        this.currentActiveSlide = null;
        this.build();

    }

    build() {

        this.contentWrapper = document.createElement('div');
        this.contentWrapper.id = 'story-content-wrapper';
        this.container.appendChild(this.contentWrapper);
        if (!this.data) {
            console.error('no data for this year')
            return
        }
        this.data.forEach((slide, index) => {

            this.addContentSlide(index)
        })

    }
    getCurrentActiveSlideElement() {
        return this.slideEls[this.currentActiveSlide];
    }
    setActiveSlide(slide) {
        this.slideEls[slide].style.display = 'flex';
        this.startVideo(slide)
        if (this.currentActiveSlide || this.currentActiveSlide===0) {
            this.slideEls[this.currentActiveSlide].style.display = 'none';
        }
        this.currentActiveSlide = slide;
    }
    stopVideo(slide) {

        if (!this.data[slide].videoElement) {
            return;
        }

        this.data[slide].videoElement.pause();
        this.data[slide].videoElement.currentTime = 0;

    }
    startVideo(slide) {

        if (!this.data[slide].videoElement) {
            return;
        }

        this.data[slide].videoElement.currentTime = 0;
        this.data[slide].videoElement.play();
    }
    isVideo(fileName) {
        return (fileName.split('.').pop() === 'mp4');
    }
    addContentSlide(activeSlide) {

        const currentSlideContents = this.data[activeSlide];
        const lastSlide = (activeSlide === this.data.length - 1);
        const el = document.createElement('div');
        let textOnly = true;

        el.classList.add('story-slide');
        el.classList.add('story-slide-number-' + activeSlide);



        let content = '';


        if (currentSlideContents.baggrundsfarve) {


            const backgroundTypeClass = 'story-background-color';
            content += `
                <div class="story-background ${backgroundTypeClass}" style="background: ${currentSlideContents.baggrundsfarve}">

                </div>
            `;
        } else if (currentSlideContents.baggrund) {
            textOnly = false;
            const bgExtension = currentSlideContents.baggrund.split('.').pop();
            let backgroundTypeClass = 'story-image-other';
            switch (bgExtension) {
                case 'gif':
                    backgroundTypeClass = 'story-image-gif';
                    break;
                case 'mp4':
                    backgroundTypeClass = 'story-video';
                    break;


            }
            if (bgExtension === 'mp4') {
                content += `
                    <div class="story-background ${backgroundTypeClass}">
                        <video loop muted playsinline>
                            <source src="${currentSlideContents.baggrund}" type="video/mp4" />
                        </video>
                    </div>
                `;
            } else {
                content += `
                    <div class="story-background ${backgroundTypeClass}">
                        <img src="${currentSlideContents.baggrund}" />
                    </div>
                `;
            }
        }

        if (currentSlideContents.overskrift) {
            textOnly = false;
            content += `
                <h1><span class="story-text-hilite">${currentSlideContents.overskrift}</span></h1>

            `;
        }
        if (currentSlideContents.billede) {
            textOnly = false;
            const extension = currentSlideContents.billede.split('.').pop();

            const fileTypeClass = (extension === 'gif') ? 'story-image-gif' : 'story-image-other';



            content += `
                <div class="story-content-wrapper-image ${fileTypeClass}">
                    <img src="${currentSlideContents.billede}" />
                </div>
            `;
        }


        if (currentSlideContents.tekst) {
            content += `
                <div class="story-content-wrapper-body${(textOnly) ? ' text-only' : ''} ${(lastSlide) ? ' last-slide' : ''}">
                    <div class="story-content-wrapper-body-inner-background"></div>
                    <div class="story-content-wrapper-body-inner">
                    ${currentSlideContents.tekst}
                    </div>
                </div>
            `;
        }
        // LAST SLIDE
        if (lastSlide) {
            content += `
                <div class="story-content-restart-wrapper">
                    <button id="story-restart-button">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 150 150" style="enable-background:new 0 0 150 150;" xml:space="preserve">
                            <style type="text/css">
                                .restart-button-bg{fill:#FF001E;}
                                .restart-button-path{fill:#FFFFFF;}
                            </style>
                            <g>
                                <circle class="restart-button-bg" cx="75.4" cy="75.5" r="75"/>
                                <g>
                                    <polygon class="restart-button-path" points="72.3,73.7 49.6,51.2 72.2,28.6 79,35.4 63.2,51.1 79.1,66.9 		"/>
                                    <path class="restart-button-path" d="M77.4,110.1c-17.8,0-32.4-14.5-32.4-32.4h9.6c0,12.5,10.2,22.8,22.8,22.8c12.5,0,22.8-10.2,22.8-22.8
                                        C100.2,65.2,90,55,77.4,55H60.8v-9.6h16.6c17.8,0,32.4,14.5,32.4,32.4C109.8,95.5,95.2,110.1,77.4,110.1z"/>
                                </g>
                            </g>
                        </svg>

                    </button>
                </div>
            `;
        }

        if (currentSlideContents.link && currentSlideContents['link-tekst']) {
            content += `
                <a href="${currentSlideContents.link}" class="story-content-link">

                    ${currentSlideContents['link-tekst']}

                </a>
            `;
        }


        el.innerHTML = content;
        this.setClasses(el, currentSlideContents)



        this.slideEls.push(el)

        this.contentWrapper.appendChild(el)

        if (currentSlideContents['tekst-baggrund-stil']) {

            const bg = el.querySelector('.story-content-wrapper-body-inner-background');

            const style = JSON.parse(currentSlideContents['tekst-baggrund-stil'])

            if (bg) {
                Object.keys(style).forEach(key => {
                    bg.style[key] = style[key]
                })
            }

            const headerHilite = el.querySelector('h1 .story-text-hilite');
            if (headerHilite) {
                let bgColor = ('background' in style) ? style['background'] : '#fff';
                const boxShadow = "2px -2px 0 5px " + bgColor;
                headerHilite.style.boxShadow = boxShadow;
                headerHilite.style.background = bgColor;

                if (isIE11) {
                    headerHilite.style.outlineColor = bgColor;
                }

            }


            //console.log(style)
        }

        if (currentSlideContents['billed-stil']) {

            const img = el.querySelector('.story-content-wrapper-image img');
            console.log(currentSlideContents['billed-stil'])
            const style = JSON.parse(currentSlideContents['billed-stil'])
            Object.keys(style).forEach(key => {

                img.style[key] = style[key]
            })
            //console.log(style)
        }
        if (currentSlideContents['tekst-farve']) {
            const textColor = currentSlideContents['tekst-farve'];
            const text = el.querySelector('.story-content-wrapper-body-inner');
            if (text) {
                text.style.color = textColor
            }
            const headerHilite = el.querySelector('h1 .story-text-hilite');

            if (headerHilite) {


                headerHilite.style.color = textColor;



            }
        }
        if (this.isVideo(currentSlideContents.baggrund)) {
            this.data[activeSlide].videoElement = el.querySelector('video');
        }


    }
    setClasses(el, contents) {

        if (contents.layout && contents.layout in layoutTranslations) {
            el.classList.add('layout-' + layoutTranslations[contents.layout])
        }

    }

}