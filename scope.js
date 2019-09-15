export default function createScope(fn, parent = null) {
  // contexts use a prototype chain to provide their enclosing contexts
  const link = Object.create(parent, {})

  const hasOwnProperty = (obj, prop) => ({}.hasOwnProperty.call(obj, prop))

  let input
  const handle = {
    read(prop) {
      return link[prop]
    },
    readSelf(prop) {
      if (hasOwnProperty(link, prop)) {
        return link[prop]
      }
    },
    scope(prop, fn) {
      const fnIsFunction = fn && {}.toString.call(fn).includes('Function')
      console.assert(fnIsFunction, `Corrupted sns, ${fn} not a function`)
      return (link[prop] = createScope(fn, link))
    },
    output(value) {
      // call every handler with (newValue, oldValue)
      const oldValue = output
      output = value
      Object.values(handlers).forEach(handler => handler(value, oldValue))
    },
    setInput(value) {
      input = value
    },
  }

  // subscriptions are handled manually so they can be run synchronously
  let handlers = {}
  let nextChangeHandlerId = 0
  const subscribe = handler => {
    const id = nextChangeHandlerId++
    handlers[id] = handler
    // initial call for the subscription has no previous value
    handler(output, undefined)
    return function unsubscribe() {
      delete handlers[id]
    }
  }

  let output
  // using implicit output when it's undefined would override more useful values
  let implicitOutput = fn(handle)
  if (implicitOutput !== undefined) output = implicitOutput

  return {
    get value() {
      return output
    },
    set value(value) {
      input(value)
    },
    subscribe,
  }
}
