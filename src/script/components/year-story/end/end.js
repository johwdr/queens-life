'use strict';

import './end.scss'

const url = 'https://storage.googleapis.com/sheet-parser/082da609c0b703cc96c80bfbe1c3c5be-hvadlavededronningenpminalder-forslag.json'

export default class End {
    constructor(selector, linkFunction) {
        this.currentLinkIndex = 0;
        this.selector = selector;
        this.linkFunction = linkFunction;
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

        this.yearSelectButton = document.createElement('button');
        this.yearSelectButton.classList.add('year-link')

        this.yearSelectButton.addEventListener('click', () => {
            console.log('CLICK')
            console.log(this.nextYear)
            this.linkFunction(this.nextYear)
        })



        //this.endSlideContent.innerHTML = endContent;
        this.container.appendChild(this.endSlideContent)



        this.container.appendChild(this.selector)

        this.container.appendChild(this.yearSelectButton)

        return this;
    }
    updateContent(year) {
        this.currentYear = year;

        const next = this.getNextLink();
        if (this.currentLinkIndex >= this.data.length) {
            this.currentLinkIndex = 0;
        }

        this.yearSelectButton.innerText = next.text;
        this.nextYear = next.aarstal;

        this.endSlideContent.innerHTML = year + ' - random shit: ' + Math.random();
    }
    getNextLink() {

        const data = this.data[this.currentLinkIndex];
        console.log(data)
        if (Number(data.aarstal) === Number(this.currentYear)) {
            this.currentLinkIndex++;
            return this.data[this.currentLinkIndex];
        }
        return data;
    }
    show() {
        this.container.classList.remove('end-slide-hidden');
    }
    hide() {
        this.container.classList.add('end-slide-hidden');
    }
}