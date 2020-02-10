'use strict';

import 'navigator.sendbeacon';
import MobileDetect from "mobile-detect";

export default class Pingvin {
    constructor(project, endpoint) {
        if (!project) {
            console.warn('No pingvin-project specified')
            return
        }
        this.project = project
        this.endpoint = endpoint || 'http://localhost:3000'
        this.ping('init')
    }

    ping(data) {
        if (!data) {
            console.warn('No pingvin-event specified')
            return
        }
        if (typeof data === 'object' && !('event' in data)) {
            console.warn('No pingvin-event specified on object')
            return
        }
        if (typeof data === 'string') {
            data = {
                event: data
            }
        }

        const computedAttributes = this.getComputed()
        const resultObject = {...data, ...computedAttributes};
        // const resultObject = Object.assign(data, computedAttributes)
        navigator.sendBeacon(this.endpoint, JSON.stringify(resultObject));
    }

    getComputed() {
        const win = window.top;
        return {
            "project": this.project,
            "url": win.location.href,
            "time": Date.now(),
            "agent": win.navigator.userAgent,
            "zone": 'drn',
            "device": this.getDeviceType()
        }
    }


    getDeviceType() {
        var md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() !== null) {
            return "mobile";
        } else {
            return "other";
        }
    }

    isDevice(type, track) {
        var md;
        if (type === "mobil") {
            if (track.isMobile === undefined) {
                md = new MobileDetect(track.agent);
                track.isMobile = md.mobile() !== null;
            }
            return track.isMobile;
        } else if (type === "tablet") {
            if (track.isTable === undefined) {
                md = new MobileDetect(track.agent);
                track.isTable = md.tablet() !== null && md.mobile() === null;
            }
            return track.isTable;
        } if (type === "andet") {
            if (track.isDesktop === undefined) {
                md = new MobileDetect(track.agent);
                track.isDesktop = md.tablet() === null && md.mobile() === null;
            }
            return track.isDesktop;
        }
    }

}