'use strict';

import './end.scss'
import Timer from '../timer/timer'

const url = 'https://storage.googleapis.com/sheet-parser/082da609c0b703cc96c80bfbe1c3c5be-hvadlavededronningenpminalder-forslag.json'

export default class End {
    constructor(selector, linkFunction, config) {


        this.timer = new Timer(() => {
            console.log('return form timer')
            this.linkFunction(this.nextYear)
        });

        this.currentLinkIndex = 0;
        this.selector = selector;
        this.selector.container.classList.add('end-element-hidden')
        this.linkFunction = linkFunction;
        this.config = config;
        return this.build();
    }

    build() {

        fetch(url)
            .then(json => {
                return json.json()
            })
            .then(data => {
                this.data = data.data;
                console.log(this.data)
            })

        this.container = document.createElement('div');

        this.container.id = 'end-container'
        this.container.classList.add('story-slide');
        this.container.classList.add('end-slide-hidden');

        this.endSlideContent = document.createElement('div');
        this.endSlideContent.classList.add('next-text')
        this.container.appendChild(this.timer.wrapper)

        this.yearSelectButton = document.createElement('button');
        this.yearSelectButton.classList.add('year-button')

        this.yearSelectButton.addEventListener('click', () => {
            console.log('CLICK')
            console.log(this.nextYear)
            this.timer.end()
            this.link.classList.add('end-element-hidden')
            this.yearSelectButton.classList.add('end-element-hidden')
            this.timer.wrapper.classList.add('end-element-hidden');
            this.endSlideContent.classList.add('end-element-hidden');

            this.selector.container.classList.remove('end-element-hidden')

            this.selector.initFocus()

        })


        this.link = document.createElement('a');
        this.link.id = 'end-more-link'
        this.link.innerHTML = this.config['linktekst'] + `
        <svg version="1.1" class="end-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox = "0 0 12.2 7.05" style = "enable-background:new 0 0 12.2 7.05;" xml: space = "preserve" >
                    <style type="text/css">
                        .st0{fill:#496C60;}
                    </style>
                    <g>
                        <path class="st0" d="M8.61,1.03c0,0.69,0,1.27,0,1.91c-2.49,0-4.9,0-7.32,0c0,0.5,0,0.93,0,1.43c2.46,0,4.87,0,7.37,0
                        c0,0.62,0,1.17,0,1.66c0.86-0.86,1.7-1.69,2.44-2.42C10.35,2.82,9.53,1.98,8.61,1.03z"/>
                    </g>
        </svg>`;
        this.link.href = this.config['linkurl']
        console.log(this.config)

        //this.endSlideContent.innerHTML = endContent;
        this.container.appendChild(this.endSlideContent)

        this.container.appendChild(this.selector.container)




        this.container.appendChild(this.yearSelectButton)

        this.container.appendChild(this.link)

        return this;
    }
    updateContent(year) {
        this.currentYear = year;

        const next = this.getNextLink();
        if (this.currentLinkIndex >= this.data.length) {
            this.currentLinkIndex = 0;
        }

        this.yearSelectButton.innerHTML = `Vælg et andet år <svg version="1.1" class="end-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox = "0 0 12.2 7.05" style="enable-background:new 0 0 12.2 7.05;" xml: space = "preserve" >
                    <style type="text/css">
                        .st0{fill:#496C60;}
                    </style>
                    <g>
                        <path class="st0" d="M8.61,1.03c0,0.69,0,1.27,0,1.91c-2.49,0-4.9,0-7.32,0c0,0.5,0,0.93,0,1.43c2.46,0,4.87,0,7.37,0
                        c0,0.62,0,1.17,0,1.66c0.86-0.86,1.7-1.69,2.44-2.42C10.35,2.82,9.53,1.98,8.61,1.03z"/>
                    </g>
        </svg>`;
        this.nextYear = next.aarstal;

        this.endSlideContent.innerHTML = `Går til året ${next.aarstal}, ${next.text}`;
    }
    getNextLink() {

        const data = this.data[this.currentLinkIndex];
        console.log(data)
        if (Number(data.aarstal) === Number(this.currentYear)) {
            this.currentLinkIndex++;

            if (this.currentLinkIndex >= this.data.length) {
                this.currentLinkIndex = 0;
            }
            return this.data[this.currentLinkIndex];
        }
        return data;
    }
    show() {
        this.container.classList.remove('end-slide-hidden');
        this.link.classList.remove('end-element-hidden')
        this.yearSelectButton.classList.remove('end-element-hidden')
        this.timer.wrapper.classList.remove('end-element-hidden');
        this.endSlideContent.classList.remove('end-element-hidden');
        this.selector.container.classList.add('end-element-hidden')
        this.timer.start();
    }
    hide() {
        this.container.classList.add('end-slide-hidden');
    }
}