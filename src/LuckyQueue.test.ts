import {LuckyQueue, OnCapacityExceeded} from "./LuckyQueue";

interface TestObject {
    foo: string;
    bar: string;
}

test('I can create a lucky queue' , ()=> {
    const lq = new LuckyQueue();
    expect(lq).toEqual( expect.objectContaining({"q": []}));
})

test('I can enqueue' , ()=> {
    const lq = new LuckyQueue<TestObject>();
    lq.enqueue({foo: 'lucky' , bar: 'crush'})
    expect(lq).toEqual( expect.objectContaining({"q": [{foo: 'lucky' , bar: 'crush'}]}));
})

test('I can dequeue' , ()=> {
    const lq = new LuckyQueue<TestObject>();
    let item = {foo: 'lucky' , bar: 'crush'};
    lq.enqueue(item)
    expect(lq).toEqual(expect.objectContaining( {"q": [{foo: 'lucky' , bar: 'crush'}]}));

    lq.dequeue();
    expect(lq).toEqual(expect.objectContaining( {"q": []}))
})

test('I can get length of my lucky queue' , ()=> {
    const lq = new LuckyQueue<TestObject>();
    lq.enqueue({foo: 'hello' , bar: 'world'})
    lq.enqueue({foo: 'lucky' , bar: 'crush'})

    expect(lq.length).toBe(2)
})

test('I can get iterate my lucky queue' , ()=> {
    const lq = new LuckyQueue<TestObject>();
    lq.enqueue({foo: 'hello' , bar: 'world'})
    lq.enqueue({foo: 'lucky' , bar: 'crush'})

    for (let i = 0; i < lq.length; i++) {
        expect(lq.getItem(i)).toBeTruthy()
    }
})


test('I can create a lucky queue with capacity' , ()=> {
    const lq = new LuckyQueue(1000);
    expect(lq).toEqual(expect.objectContaining( { "maxSize": 1000, "q": []}))
})

test('If capacity is exceeded it should raise an event OnCapacityExceeded' , ()=> {
    const lq = new LuckyQueue<TestObject>(1);
    const listener = jest.fn();
    lq.on(OnCapacityExceeded, listener)

    lq.enqueue({foo: 'hello' , bar: 'world'})
    lq.enqueue({foo: 'lucky' , bar: 'crush'})

    expect(listener).toBeCalled()
    expect(lq.length).toBe(1)
})

test('it should provide an onCapacityExceeded function  ' , ()=> {
    const lq = new LuckyQueue(1);
    const listener = jest.fn();
    lq.onCapacityExceeded(listener)

    lq.enqueue({foo: 'hello' , bar: 'world'})
    lq.enqueue({foo: 'lucky' , bar: 'crush'})
    expect(listener).toBeCalled()
    expect(lq.length).toBe(1)

})

test('I can get my enqueue rate per ms ' , async ()=> {
    const lq = new LuckyQueue<number>();
    const onRate = jest.fn()
    lq.startRate(10, onRate); //default 1000ms

    for (let i = 0; i < 10; i++) {
        lq.enqueue(i);
        lq.dequeue()
        await new Promise((r) => setTimeout(r, 10));
    }
    lq.stopRate();

    expect(onRate).toBeCalled()
    expect(onRate).toHaveBeenCalledWith(1, 1)
    expect(onRate).toBeCalledTimes(10)
})



