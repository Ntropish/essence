import sns from './sns.js'

const outputs = []
sns(async function main($) {
  // con defines constants on the scope
  $.con = function conDef($) {
    return function con(value) {
      return $ => {
        $.input = () => console.error('cannot change a constant')
        return value
      }
    }
  }

  // mut defines mutables
  $.mut = $.con(function mut(value) {
    return $ => {
      $.input = $.output
      return value
    }
  })

  $.log = $.con(console.log.bind(console))

  // $.watch = $.con(function watch(fn) {
  //   return
  // })

  $.mutable = $.mut(0)

  $.watcher = $ => {
    let reads = {}
    const fn = $ => {
      $.log($.mutable)
    }
    // skimmer is to intercept all "get"s during fn run
    const skimmer = new Proxy($, {
      get(target, prop, receiver) {
        const value = $[prop]
        reads[prop] = { value }
        return value
      },
    })
    // this is called to initialize or rerun the watch
    const run = () => {
      // clear all data
      Object.values(reads).forEach(read => read.unsubscribe())
      reads = {}

      fn(skimmer)

      // wait to subscribe until after so it doesn't re-trigger
      Object.entries(reads).forEach(([prop, read]) => {
        reads[prop].unsubscribe = $.subscribe(prop, (newValue, oldValue) => {
          if (newValue !== read.value) {
            run()
          }
        })
      })

      console.log('run complete - watching:', reads)
    }
    run()
  }

  $.a = $ => 'a string 1'
  $.b = function defineB($) {
    // setting to a property creates a new sub-scope
    $.a = $ => 'a string 2'
    $.c = $ => {
      $.a = $ => 'a string 5'

      $.subscribe('mutable', (a, b) => {
        $.log($.a)
        $.log(a)
      })
    }
  }

  // TODO: change set to mutate
  $.mutable = $.set(1)
  $.mutable = $.set(2)
})
