'use strict';

import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch'
import './year-story.scss'

import ScreenWarnings from '../screen-warnings/screen-warnings'
import Infobox from '../infobox/infobox'
import Progress from './progress/progress'
import Content from './content/content'
import Navigation from './navigation/navigation'
import Pointer from './pointer/pointer'
import Selector from './selector/selector'
import Frontpage from './frontpage/frontpage'
import End from './end/end'
import Pingvin from "../pingvin/pingvin";


export default class YearStory {
    constructor() {

        // UGLY NAV-BAR HACK
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);


        const url = window.location.href;
        const inApp = url.indexOf("app_mode=true") > 0;
        console.log(inApp)
        if (inApp) {
            document.documentElement.classList.add('in-app-browser');
        }

        // UGLY ZOOM HACH
        const viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');

        this.freq = 5000; //MS
        this.activeSlide = 0;
        this.callBacksPreloadMedia = 0;
        this.currentlyPreloadMedia = 0;
        this.noPreloadImages = 4;

        const el = document.querySelector('[data-story]');
        this.container = el;

        this.seen = 0;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('story-inner-wrapper')

        const pingvinNamespace = (process.env.STATS_PREFIX + '-queens-year').toLowerCase();
        const pingvinURL = 'https://pingvin-server.public.prod.gcp.dr.dk'
        this.pingvin = new Pingvin(pingvinNamespace, pingvinURL)

        new ScreenWarnings(this.wrapper);


        el.appendChild(this.wrapper)

        if (!this.wrapper) {
            console.error('No data-story element.')
            return;
        }
        this.dataURL = el.dataset.story;
        if (!this.dataURL) {
            console.error('No data given.')
            return;
        }
        this.configURL = el.dataset.config;

        const promises = [];

        if (this.configURL) {
            promises.push(this.fetchConfig())
        }

        promises.push(this.fetchData());

        Promise.all(promises).then(() => {
            this.build();
            this.setup();
        });
    }
    setup() {

        if (this.config['baggrund']) {
            this.container.style.backgroundImage = `url("${this.config['baggrund']}")`
        }
    }
    getStory() {
        console.log(this.config)
    }
    preloadImages() {
        const bgs = [];
        const imgs = [];
        this.data.forEach((slide, index) => {

            if (slide.baggrund) {

                const type = slide.baggrund.split('.').pop();
                if (type === 'mp4') {
                    //preload video?
                    bgs[index] = document.createElement("video");
                    if (this.callBacksPreloadMedia < this.noPreloadImages) {
                        bgs[index].addEventListener('canplaythrough', (event) => {
                            this.incrementPreload(event)

                            console.log('preloaded video: ' + slide.baggrund)
                        });
                        this.callBacksPreloadMedia++
                    }

                    bgs[index].src = slide.baggrund;
                    bgs[index].load();
                } else {
                    bgs[index] = new Image();
                    if (this.callBacksPreloadMedia < this.noPreloadImages) {
                        bgs[index].onload = (event) => {
                            this.incrementPreload(event)
                        };
                        this.callBacksPreloadMedia++
                    }
                    bgs[index].src = slide.baggrund;
                }
            }
            if (slide.billede) {
                imgs[index] = new Image();
                if (this.callBacksPreloadMedia < this.noPreloadImages) {
                    imgs[index].onload = (event) => {
                        this.incrementPreload(event)
                    };
                    this.callBacksPreloadMedia++
                }
                imgs[index].src = slide.billede;
            }



        })
    }
    incrementPreload(event) {
        this.currentlyPreloadMedia++;

        if (this.currentlyPreloadMedia >= this.noPreloadImages || this.currentlyPreloadMedia == this.callBacksPreloadMedia) {


            this.container.classList.remove('story-loading')
            this.content.setActiveSlide(0);
            this.navigation.setActiveSlide(0);
            this.startStory()

        }

    }
    fetchConfig() {
        return fetch(this.configURL)
            .then(data => {
                return data.json()
            })
            .then(data => {

                this.config = data.data[0];
            })
    }
    fetchData() {
        return fetch(this.dataURL)
            .then(data => {
                return data.json()
            })
            .then(data => {
                this.data = {}
                data.data.forEach(element => {
                    if (element.aarstal) {

                        if (element.aarstal in this.data) {
                            this.data[element.aarstal].push(element)
                        } else {
                            this.data[element.aarstal] = [element]
                        }
                    }
                });
                //this.noSlides = data.data.length;

                return this.data;
            })
            .catch(err => {
                console.error('Could not load data.')
                return;
            })
    }

    setHash(hash) {
        window.location.hash = '#' + hash;
    }
    getHash() {
        return window.location.hash.replace('#', '')
    }
    build() {
        const hash = this.getHash();
        this.yearWrapper = document.createElement('div');
        this.yearWrapper.id = 'year-wrapper';
        this.wrapper.appendChild(this.yearWrapper);

        this.infobox = new Infobox(this.config);


        if (hash) {

            this.startStory(hash);
            this.container.classList.remove('story-loading')
        } else {



            this.frontPageSelector = new Selector((year) => {

                this.frontPage.hide();
                this.frontPageSelector.hide();
                //this.setHash(year);
                this.startStory(year, true);
                this.pingvin.ping('first-select')

            })
            this.frontPage = new Frontpage(this.infobox, this.frontPageSelector.container);
            this.wrapper.appendChild(this.frontPage.container);
            this.container.classList.remove('story-loading')

        }
        this.endScreenSelector = new Selector((year) => {

            this.endScreen.hide();
            this.pingvin.ping('select')
            //this.setHash(year);
            this.startStory(year);

        }, false)

        this.endScreen = new End(this.endScreenSelector, (year) => {
            this.endScreen.hide();
            this.pingvin.ping('next-auto')
            this.startStory(year)
        }, this.config);
        this.wrapper.appendChild(this.endScreen.container);

    }

    startStory(year, birthYear = false) {

        this.seen++;

        this.pingvin.ping('seen-' + this.seen)


        this.yearWrapper.innerHTML = '';

        console.log('START STORY YEAR: ' + year);

        this.year = year;

        this.noSlides = this.data[this.year].length + 1;
        this.progress = new Progress(this.yearWrapper, this.noSlides)
        this.content = new Content(this.yearWrapper, this.data[this.year], year, birthYear)
        this.content.setActiveSlide(0);
        this.navigation = new Navigation(this)
        this.navigation.setActiveSlide(0);
        if (!this.pointer) {
            this.pointer = new Pointer(this.navigation.getWrapper());
        }

        this.playing = true;
        this.startTime = new Date().getTime();
        this.tick();
        /*this.pingvin.ping('start')*/
    }
    tick() {
        const current = new Date().getTime();
        this.currentInterval = current - this.startTime;

        if (this.currentInterval > (this.freq * this.noSlides)) {
            this.end()

        }
        if (this.playing) {
            this.updateUI()
            requestAnimationFrame(() => {
                this.tick();
            })
        }
    }
    end() {
        console.log('end')
        this.playing = false;
        this.progress.end();
        this.navigation.end();
        this.navigation.hide();
        this.pause();
        this.content.destroy();
        this.activeSlide = 0;
        this.pointer.end();
        this.endScreen.updateContent(this.year)
        this.endScreen.show();
        this.endScreenSelector.clear();

    }

    updateUI() {
        const activeSlide = Math.floor(this.currentInterval / this.freq);

        if (activeSlide != this.activeSlide) {
            console.log(activeSlide, this.activeSlide)
            if (activeSlide  === this.noSlides) {
                this.end();
                return;
            }
            this.content.stopVideo(this.activeSlide)
            this.activeSlide = activeSlide;
            this.content.setActiveSlide(activeSlide);
            this.progress.reset(activeSlide);
            this.navigation.setActiveSlide(activeSlide);


            // if last slide
            /*if (activeSlide >= (this.noSlides)) {
                this.setStateForLastSlide()

            }*/
        }



        this.slideProgess = this.currentInterval % this.freq;

        this.progress.update(activeSlide, this.slideProgess / this.freq);

    }
    /*setStateForLastSlide() {
        console.log('set last slide');
        this.pingvin.ping('end')
        this.navigation.end()
        this.pointer.end();
    }*/



    goForward() {

        if (this.activeSlide > this.noSlides-1) {

            return;
        }

        this.startTime = new Date().getTime()
        this.startTime -= (this.activeSlide + 1) * this.freq;
    }

    goBack() {

        if (this.activeSlide < 0) {
            return;
        }
        this.startTime = new Date().getTime()

        const step = (this.activeSlide > 1) ? (this.activeSlide-1) : 0;

        if (this.data[step] && this.data[step].baggrund && this.content.isVideo(this.data[step].baggrund) && this.activeSlide === step) {
            this.content.startVideo(step);
        }

        this.startTime -= step * this.freq;
    }
    pause() {

        this.pauseTime = new Date().getTime();
        this.playing = false;

        const el = this.content.getCurrentActiveSlideElement();

        if (!el) return;

        const i = el.querySelector('.story-image-gif img');
        if (i) {
            freeze_gif(i);
        }

        const v = el.querySelector('.story-video video');
        if (v) {
            v.pause();
        }
        const il = el.querySelector('.inline-video');
        if (il) {
            il.pause();
        }

    }
    restart() {

        this.playing = true;
        const el = this.content.getCurrentActiveSlideElement();
        const c = el.querySelector('.story-image-gif canvas');
        if (c) {
            restart_gif(c);
        }


        const v = el.querySelector('.story-video video');
        if (v) {
            v.play();
        }
        const il = el.querySelector('.inline-video');
        if (il) {
            il.play();
        }

        const current = new Date().getTime();
        const delta = current - this.pauseTime;

        this.startTime += delta;
        this.tick();
    }

}

function restart_gif(c) {

    if (!c) return;
    var i = document.createElement('img');
    i.src = c.dataset.src;

    var w = i.width = c.width;
    var h = i.height = c.height;
    for(var j = 0, a; a = c.attributes[j]; j++)
        i.setAttribute(a.name, a.value);


    delete i.dataset.src;


    c.parentNode.replaceChild(i, c);


}


function freeze_gif(i) {

    if (!i) return;
    i.removeAttribute('height')
    i.removeAttribute('width')
    var c = document.createElement('canvas');
    c.dataset.src = i.src;

    var w = c.width = i.width;
    var h = c.height = i.height;
    c.getContext('2d').drawImage(i, 0, 0, w, h);

    for (var j = 0, a; a = i.attributes[j]; j++) {
        c.setAttribute(a.name, a.value);
    }

    i.parentNode.replaceChild(c, i);


}