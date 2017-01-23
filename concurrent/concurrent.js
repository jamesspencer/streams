import xs from 'xstream';
import concat from 'xstream/extra/concat'
import zip from 'zip/zip'


// Limits an `input$` stream to `limit` concurrent events.
// Events on `canSendNext$` release new events on the output stream
// Concurrency of 3:
// input:       -a-b-c-d-e--------f-g-h-i---|
// canSendNext: ----------A---B-C-D----E--F--
// output:      -a-b-c----d---e---f-g--h--i-|
export default function concurrent(input$, canSendNext$, limit = 10) {

  // The initial pool of canSendNext events
  const initialCanSendNext$ = xs.fromArray(Array(limit).fill(true));

  // Zipping gives us 
  return zip(input$, concat(initialCanSendNext$, canSendNext$))
    .map(x => x[0]);
}
