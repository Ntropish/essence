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

const computed = $ => {
  return fn => {
    const result = fn($)
  }
}
const watch = $ => {
  return fn => {}
}

const sumEvenFibs = require('./evenFibSum.js')

// this use case is could be simplified but
// I want to exercise accessing functions
// from lower contexts and writing asserts for them
$($ => {
  // these are dependencies of evenFibSum
  $.fib = fib
  $.sum = R.sum
  $.count = 10

  // these are to be standard
  // $.log = console.log.bind(console)
  const output = []
  $.log = (...args) => output.push(args)
  $.assert = assert

  // sumEvenFibs needs it's own context
  // so it can pretend it does important things
  $.sumEvenFibs = $(sumEvenFibs)

  // logs result every time it changes
  $.result = $.computed($.sumEvenFibs($.count))
  $.watch($ => $.log($.result))
})
