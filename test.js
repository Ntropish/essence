const { $ } = require('./essence.js')
const R = require('ramda')

const fib = count => {
  let result = [1]
  let prevPrev = 1
  let prev = 1
  while (result.length < count) {
    const tmp = prevPrev + prev
    prevPrev = prev
    prev = tmp
    result.push(tmp)
  }
  return result
}

const assert = ({ given, should, actual, expected }) => {
  if (!R.equals(actual, expected)) {
    console.log('actual ->', actual)
    console.log('expected ->', expected)
    throw new Error(
      `given - ${given || actual} - should - ${should || expected}`,
    )
  }
}

const evenFibSum = require('./evenFibSum.js')

// This use case is could be simplified but
// I want to exercise accessing functions
// from lower contexts and writing asserts for them
$($ => {
  $.assert = assert
  $.log = console.log.bind(console)
  $.fib = fib
  $.sum = R.sum
  $.count = 10
  $.log($(evenFibSum))
})
