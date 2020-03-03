'use strict';

import './end.scss'

export default class End {
    constructor(selector) {
        this.selector = selector;
        return this.build();
    }

    build() {

        this.container = document.createElement('div');

        return  {
            container: this.container
        }
    }
}