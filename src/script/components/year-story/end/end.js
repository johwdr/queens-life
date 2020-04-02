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
        this.selector.classList.add('end-element-hidden')
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
            this.label.classList.remove('end-element-hidden')
            this.selector.classList.remove('end-element-hidden')
        })


        this.link = document.createElement('a');
        this.link.id = 'end-more-link'
        this.link.innerText = this.config['linktekst']
        this.link.href = this.config['linkurl']
        console.log(this.config)

        //this.endSlideContent.innerHTML = endContent;
        this.container.appendChild(this.endSlideContent)

        this.label = document.createElement('div')
        this.label.classList.add('selector-label')
        this.label.classList.add('end-element-hidden');
        this.label.innerText = 'Gå direkte til et årstal'
        this.container.appendChild(this.label)

        this.container.appendChild(this.selector)



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

        this.yearSelectButton.innerText = 'Vælg et andet år';
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
        this.selector.classList.add('end-element-hidden')
        this.timer.start();
    }
    hide() {
        this.container.classList.add('end-slide-hidden');
    }
}