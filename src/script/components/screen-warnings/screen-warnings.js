'use strict';

import './screen-warnings.scss'

export default class ScreenWarnings {
    constructor(container) {



        this.build(container);
        this.setup()
    }

    build(container) {

        this.mobileWarning = document.createElement('div');

        this.mobileWarning.classList.add('screen-size-warning-wrapper-content')
        this.mobileWarning.id = "screen-size-warning-wrapper-mobile";
        this.mobileWarning.innerHTML = this.getMobileWarning();
        container.appendChild(this.mobileWarning);

        this.desktopWarning = document.createElement('div');
        this.desktopWarning.classList.add('screen-size-warning-wrapper-content')
        this.desktopWarning.id = "screen-size-warning-wrapper-desktop";
        this.desktopWarning.innerHTML = this.getDesktopWarning();
        //this.desktopWarning.style.display = 'none';
        container.appendChild(this.desktopWarning);


    }

    setup() {


        if (this.isTouchDevice()) {


            const isLandscapeQuery = window.matchMedia("(orientation: landscape)");

            isLandscapeQuery.addListener(() => {
                this.checkMobileOrientation(isLandscapeQuery);
            });
            this.checkMobileOrientation(isLandscapeQuery);
        }
    }



    checkMobileOrientation(isLandscape) {


        if (isLandscape.matches) {
                // you're in LANDSCAPE mode
                console.log('is landscape')

                //this.mobileWarning.style.display = 'flex';
            } else {
                console.log('is portrait')
                this.mobileWarning.style.display = 'none';

            }

    }
    checkScreenSize() {

        console.log('is desk')
        if (window.innerHeight < 660 && window.outerHeight < screen.height) {

            //this.desktopWarning.style.display = 'flex';

        } else {
            this.desktopWarning.style.display = 'none';
        }

    }
    isTouchDevice() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mq = function (query) {
            return window.matchMedia(query).matches;
        }

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }

        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }


    getMobileWarning() {
        return `<p>
            Vend lige skærmen en gang
        </p>`
    }
    getDesktopWarning() {
        return `<p>
            Hov. Prøv at gøre vinduet lidt højere.
        </p>`
    }
}