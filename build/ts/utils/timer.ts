module EUtilsLib {
    export class TimeRecorder {
        private _start: any;
        private _end: any;
        private _totalTime: number;

        constructor() {
            this._start = new Date();
            this._end = new Date();
            this._totalTime = 0;
        }

        start() {
            this._start = new Date();
        }

        end() {
            this._end = new Date();
        }

        printTotalTime() {
            console.log("Total time:" + this._totalTime);
        }

        printElapsedTime() {
            var timeDiff = this._end - this._start; //in ms
            var seconds = timeDiff / 1000;
            this._totalTime += seconds;
            console.log("elapsed time:" + seconds + " seconds");
        }
    }
}