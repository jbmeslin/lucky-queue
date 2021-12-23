import EventEmitter from "events";

export const OnCapacityExceeded = 'capacity_exceeded';


export class LuckyQueue<T> extends EventEmitter {

    private readonly q: Array<T>;
    private readonly maxSize: number| undefined = undefined;

    private enqueueRateCounter: number= 0;
    private dequeueRateCounter: number= 0;
    private isRating:boolean = false;

    #rateInterval: any = undefined //  use # for fun and test it, I am a noob in TS

    constructor(maxSize? : number) {
        super();

        this.maxSize = maxSize;
        this.q = [];
    }

    enqueue(item: T) {
        if (this.q.length === this.maxSize){
            this.emit(OnCapacityExceeded);
            return;
        }
        this.q.push(item);
        if(this.isRating) {
            this.enqueueRateCounter++
        }
    }

    dequeue() {
        if(this.isRating) {
            this.dequeueRateCounter++
        }
        return this.q.shift();
    }

    get length() {
        return this.q.length
    }

    getItem (index: number): T {
        return this.q[index]
    }

    onCapacityExceeded(callback: () => void) {
        if(this.maxSize)
            this.on(OnCapacityExceeded,callback)
    }

    startRate(timeMs: number = 1000, onRate: (numberEnqueue: number, numberDequeue: number) => void) {
        this.isRating = true;
        this.#rateInterval = setInterval(()=> {

            console.log('rate per', timeMs, this.enqueueRateCounter);
            onRate(this.enqueueRateCounter, this.dequeueRateCounter);
            this.enqueueRateCounter = 0;
            this.dequeueRateCounter = 0;
        }, timeMs)
    }

    stopRate() {
        this.#rateInterval = clearInterval( this.#rateInterval)
        this.isRating = false;

    }
}