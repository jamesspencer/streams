import xs from 'xstream';


// Zips multiple streams together, emits arrays of values when
// all streams have something new to offer
// 
// input1: -a--b-----c--d---|
// input2: --1--2--3--4-----|
// output: --1a-2b---3c-4d--|
export default function zip(...streams) {

  const outputBuffers = Array(streams.length);

  function getStreamListener(n) {
    return {
      next: val => outputBuffers[n].push(val)
    };
  }

  streams.map((stream$, i) => {
    outputBuffers[i] = [];
    stream$.addListener(getStreamListener(i))
  });

  const output$ = xs.merge(...streams)
    // Only pass events when we have a value in each buffer
    .filter(s => {
      return !outputBuffers.find(x => !x.length);
    })
    // create an array from the first value from each buffer
    .map(x => {
      let val = outputBuffers.reduce((tot, cur) => {
        tot.push(cur.shift())
        return tot;
      }, []);
      return val;
    });

  return output$;
}
