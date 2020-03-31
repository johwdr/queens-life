


import './timer.scss'

export default class Timer {

    constructor(callback) {

        this.initialTime = 5;
        this.frequency = 25;
        this.totalTime = this.initialTime * 1000;
        this.circleRadius = 52;
        this.dashNumber = (this.circleRadius * 2 * Math.PI)
        console.log(this.dashNumber)
        this.callback = callback;

        return this.build();

    }
    restart() {
        this.end();
        this.totalTime = this.initialTime * 1000;

        this.start();
    }
    build() {
        this.wrapper = document.createElement('div');
        this.wrapper.id = "countdown-clock"
        this.wrapper.addEventListener('click', () => {
            clearInterval(this.interval)
            this.formatTime(0)
            this.callback();
        })
        this.timeText = document.createElement('div');
        this.timeText.innerText = '0'
        this.wrapper.appendChild(this.timeText);
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");


        this.svg.setAttribute('view-box', "0 0 120 120")

        this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.circle.setAttribute('r', this.circleRadius)
        this.circle.setAttribute('cx', "60")
        this.circle.setAttribute('cy', "60")
        this.circle.style.strokeDasharray = this.dashNumber + 'px'

        this.svg.appendChild(this.circle);



        this.wrapper.appendChild(this.svg);


        return this;
    }
    start() {
        this.final = false;
        this.wrapper.classList.remove('final')
        this.currentTime = this.totalTime;


        this.update();
        this.interval = setInterval(() => {
            this.currentTime -= this.frequency;
            this.update();
            if (this.currentTime <= 0) {
                clearInterval(this.interval)
                this.formatTime(0)
                this.callback()

            }
        }, this.frequency);
    }
    end() {
        clearInterval(this.interval)
    }
    update() {

        const progress = ((this.totalTime - this.currentTime) / this.totalTime);

        this.circle.style.strokeDashoffset = Math.ceil((this.dashNumber * progress) * 100) / 100 + 'px'
        this.timeText.innerText = this.formatTime(this.currentTime + 1000);
    }
    formatTime(time) {

        function pad(n, z) {
            z = z || 2;
            return ('00' + n).slice(-z);
        }
        let s = time;
        var ms = s % 1000;

        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;


        let showMS = ms + Math.round(Math.random() * 10);

        if (time === 0) {
            showMS = 0;
        }

        //return pad(secs) + ':' + pad(showMS, 2);
        return secs;


    }

}