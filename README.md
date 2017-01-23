# Reactive fun with streams/observables in JavaScript

Uses such libraries as [xstream](https://github.com/staltz/xstream) and [RxJS](https://github.com/Reactive-Extensions/RxJS/).

## Getting started

```
npm install
```

## Concurrent (xstream)

Limits a stream to N concurrent events, incorporating a feedback loop to free up new events. Useful for batching asynchronous requests of varying duration.

```
import concurrent from 'concurrent/concurrent'

// create a proxy to close the circular dependency
const responsesProxy$ = xs.create();

// limits the requests$ to 3 at most
const 3requests$ = concurrent(requests$, responsesProxy$, 3);

// do something with the requests
const responses$ = 3requests$.addListener(/* ... */);

// closes the circular dependency by passing our completed responses back in order to free up more requests
responsesProxy$.imitate(responses$);
```

### Marble diagram

With a concurrency of 3:

```
requests:  -a-b-c-d-e--------f-g-h-i---|
responses: ----------T---T-T-T----T--T--
output:    -a-b-c----d---e---f-g--h--i-|
```

Requests demo (max of 3)

```
npm run-script concurrent
```

## Zip (xstream)

Zips multiple streams together, emits arrays of values if and when all streams have something new to offer. 

```
import zip from 'zip/zip'

zip(stream1$, stream2$);
```

### Marble diagram ([RxMarbles](rxmarbles.com/#zip))

```
input1: -1--2------3--4---|
input2: ---a--b--c--d-----|
output: ---1a-2b---3c-4d--|


input1: -a---b---c-----d----|
input2: --1-----2----3---4--|
input3: -j----k-------l-----|
output: --a1j---b2k---c3l---|
```
