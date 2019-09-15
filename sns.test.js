import sns, { standard } from './sns.js'

const outputs = []
sns(async function main($) {
  // main ^^^ is a definition because it accepts
  // and uses a definition handle "$"

  // "import" other definitions by running them against
  // the provided handle
  standard($)

  $.a = $.mut(0)
  /* 
  | $.mut(0) |
  this function call creates a definition. a def is a function
  that describes how a scope should behave.
  
  | $.a = def |
  this creates a subscope on this scope using the definition
  */

  // all side effects should be as close to the top as possible
  // so low level definitions can be used anywhere
  $.log = $.con(console.log.bind(console))

  // log a every time it changes
  $.watch($ => {
    $.log($.a)
  })($)

  $.first = $.mut('justin')
  $.last = $.con('stone')

  // computed prop by returning a value
  $['full name'] = $.watch($ => $.first + ' ' + $.last)

  // log a every time it changes
  $.watch($ => {
    $.log($['full name'])
  })($)

  $.a = $.input(1)
  $.first = $.input('rustin')
  $.a = $.input(2)
})
