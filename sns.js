import createScope from './scope.js'

const set = Symbol('set')

const scopeToSns = new WeakMap()

export default function sns(fn) {
  const createSnsScope = fn => scopeHandle => {
    const snsHandle = new Proxy(
      {},
      {
        get(target, prop, receiver) {
          if (prop === 'output') {
            return scopeHandle.output
          } else if (prop === 'set') {
            return value => ({
              [set]: true,
              value,
            })
            // TODO: add prefix to built-in props
          } else if (prop === 'subscribe') {
            return (prop, handler) => {
              const unsubscribe = scopeHandle.read(prop).subscribe(handler)
              return unsubscribe
            }
          } else {
            const scope = scopeHandle.read(prop)
            return scope.value
          }
        },
        set(target, prop, value, receiver) {
          if (prop === 'input') {
            scopeHandle.setInput(value)
          } else if (typeof value === 'object' && value[set]) {
            const readProp = scopeHandle.read(prop)
            readProp.value = value.value
          } else {
            scopeHandle.scope(prop, createSnsScope(value))
          }
          return true
        },
      },
    )
    return fn(snsHandle)
  }

  return createScope(createSnsScope(fn))
}

// basic props needed for most programs
export const standard = $ => {
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

  $.watch = $.con(function watch(fn) {
    return $ => {
      let reads = {}
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
      }
      run()
    }
  })
}
