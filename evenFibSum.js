module.exports = function($) {
  // asserts can be 'pulled up' into the definition
  // if they are general like this one. But, if a test
  // is for a special use case it should remain
  // with the consumer, next to that use case
  $.assert({
    given: 'fib called with 5',
    should: 'return 1, 2, 3, 5, 8, in an array',
    actual: $.fib(5),
    expected: [1, 2, 3, 5, 8],
  })
  // sometimes tests are too low level for given/should
  // to be useful. the actual/expected are more descriptive
  // alone in these cases
  $.assert({
    given: 'one',
    actual: $.fib(1),
    expected: [1],
  })
  // asserts are tests that ensure the use cases needed
  // in this node are accounted for. They will block app
  // compilation until they are addressed so that the use
  // case isn't forgotten. This speeds development by actively
  // presenting the next issue until the app is known to be valid.
  // The functionality written to fulfil the asserted use case
  // will probably be created long after the test was written
  //
  // maybe all abstractions should be developed against use case tests?
  $.assert({
    actual: $.sum([2, 99, -5]),
    expected: 96,
  })

  return count => {
    const fibs = $.fib(count)
    const evenFibs = fibs.filter(n => n % 2 === 0)
    return $.sum(evenFibs)
  }
}
