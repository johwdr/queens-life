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
    constructor(container, data, year, birthYear) {
        this.year = year;
        this.container = container;
        this.data = data;
        this.slideEls = [];
        this.birthYear = birthYear;
        this.currentActiveSlide = null;
        this.build();

    }
    destroy() {
        //this.contentWrapper.classList.add('story-content-wrapper-hidden')
        this.container.removeChild(this.contentWrapper);
        this.currentActiveSlide = null;
    }

    build() {

        this.contentWrapper = document.createElement('div');
        this.contentWrapper.id = 'story-content-wrapper';
        this.container.appendChild(this.contentWrapper);
        if (!this.data) {
            console.error('no data for this year')
            return
        }
        this.buildStartSlide(this.data);
        this.data.forEach((slide, index) => {

            this.addContentSlide(index)
        })

    }
    buildStartSlideContent() {

        const age = this.year - 1940;

        if (age === 0) {
            return `Dronning Margrethe bliver født i ${this.year}`;
        }
        if (age === 80) {
            return `Dronning Margrethe bliver ${age} år gammel i ${this.year}`;
        }
        console.log('--- ' + this.birthYear)
        if (this.birthYear) {
            return `Dronning Margrethe er på din alder i ${this.year}, hvor hun fylder ${age} år`;
        } else {
            return `Dronning Margrethe fylder ${age} år i ${this.year}`;
        }
    }
    buildStartSlide() {

        const el = document.createElement('div');
        const content = this.buildStartSlideContent();
        let textOnly = true;

        el.classList.add('story-slide');
        el.classList.add('story-slide-number-frontpage');


        let age = this.year - 1940;
        if (age < 10) {
            age = '0' + age;
        }
        el.style.backgroundImage = `url(https://dr.dk/nyheder/htm/grafik/2020/M80/alder/${age}.jpg`;

        el.innerHTML = `<div class="slide-frontpage-content">${content}</div>`
        this.slideEls.push(el)
        this.contentWrapper.appendChild(el)
    }
    getCurrentActiveSlideElement() {
        return this.slideEls[this.currentActiveSlide];
    }
    setActiveSlide(slide) {
        if (!this.slideEls[slide]) {
            console.log('NO ' + slide)
            return
        }

        this.slideEls[slide].style.display = 'flex';
        console.log('set active')
        this.startVideo(slide)
        if (this.currentActiveSlide || this.currentActiveSlide===0) {
            this.slideEls[this.currentActiveSlide].style.display = 'none';
        }
        this.currentActiveSlide = slide;
    }
    stopVideo(slide) {

        if (this.data[slide] && this.data[slide].videoElement) {
            this.data[slide].videoElement.pause();
            this.data[slide].videoElement.currentTime = 0;
        }
        console.log('stop')
        if (this.data[slide] && this.data[slide].videoInlineElement) {
            console.log('stop inline - ' + slide)
            this.data[slide].videoInlineElement.pause();
            this.data[slide].videoInlineElement.currentTime = 0;
        }

    }
    startVideo(slide) {

        if (slide < 1) {
            return;
        }

        slide = slide-1;
        if (this.data[slide] && this.data[slide].videoElement) {
            this.data[slide].videoElement.currentTime = 0;
            this.data[slide].videoElement.play();
        }
        console.log('start')

        console.log(slide, this.data[slide])
        if (this.data[slide] && this.data[slide].videoInlineElement) {
            console.log('start inline' + slide)
            this.data[slide].videoInlineElement.currentTime = 0;
            this.data[slide].videoInlineElement.play();
        }

    }
    isVideo(fileName) {

        console.log(fileName)
        return (fileName.split('.').pop() === 'mp4');
    }
    addContentSlide(activeSlide) {

        const currentSlideContents = this.data[activeSlide];
        const lastSlide = (activeSlide === this.data.length - 1);
        const el = document.createElement('div');
        let textOnly = true;

        el.classList.add('story-slide');
        el.classList.add('story-slide-number-' + activeSlide);

        if (currentSlideContents.retning && currentSlideContents.retning.toLowerCase() === 'omvendt') {
            el.classList.add('story-slide-reversed');
        }



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
                    <div class="story-background ${backgroundTypeClass}" style="background-image: url(${currentSlideContents.baggrund})">
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


            if (extension === 'mp4') {
                const fileTypeClass = 'story-image-video';

                content += `
                    <div class="story-content-wrapper-image ${fileTypeClass}">
                        <video class="inline-video" autoplay muted playsinline>
                            <source src="${currentSlideContents.billede}" type="video/mp4">
                        </video>
                    </div>
                `;
            } else {
                const fileTypeClass = (extension === 'gif') ? 'story-image-gif' : 'story-image-other';

                content += `
                    <div class="story-content-wrapper-image ${fileTypeClass}">
                        <img src="${currentSlideContents.billede}" />
                    </div>
                `;
            }
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
        if (currentSlideContents.baggrund && this.isVideo(currentSlideContents.baggrund)) {
            this.data[activeSlide].videoElement = el.querySelector('video');
        }


        if (currentSlideContents.billede && this.isVideo(currentSlideContents.billede)) {

            console.log('HAS INLINE VIDEO')
            this.data[activeSlide].videoInlineElement = el.querySelector('.inline-video');
        }


    }
    setClasses(el, contents) {

        if (contents.layout && contents.layout in layoutTranslations) {
            el.classList.add('layout-' + layoutTranslations[contents.layout])
        }

    }

}