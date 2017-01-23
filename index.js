import xs from 'xstream';
import concurrent from 'concurrent/concurrent'
import delay from 'xstream/extra/delay'

// Creates a stream of 15 sequentially numbered "requests" [0, 1, 2, 3...]
let requests = [...Array(15).keys()];
const requests$ = xs.fromArray(requests);

// Creates a responses proxy that we can pass to concurrent
// This enables our circular dependency of passing the completed responses to
// the request limiter
const responsesProxy$ = xs.create();

// Creates the limited stream of requests (and track it)
const limitedRequests$ = concurrent(requests$, responsesProxy$, 3).debug();

// Time to do something with the concurrent requests!
// We would usually map limitedRequests$ to XHR calls and deal
// with a stream of responses but, for this example, we'll
// delay the concurrent requests then map them to `true`
const responses$ = limitedRequests$.map(x => true).compose(delay(1000));

// Now we pipe our responses to the responsesProxy that limitedRequests$ uses to
// release another request
responsesProxy$.imitate(responses$);
