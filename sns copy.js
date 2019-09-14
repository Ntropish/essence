export const context = Symbol('context')

function createContext(fn, parent = null) {
  const output = value => {
    currentValue = value
  }
  const context = Object.create(parent, { output })
  const $ = new Proxy(() => {}, {
    set: function writeContext(target, prop, value, receiver) {
      console.assert(
        !(prop in context),
        `Property ${prop} already set on context`,
      )
      const valueIsUnit = typeof value === 'object' && value && value[unit]
      const descriptor = valueIsUnit ? value : createVariableUnit(value)
      Object.defineProperty(context, prop, {
        get: () => currentValue,
      })

      return true
    },
    get: function readContext(target, prop, receiver) {
      // the often unused "in" here is so it searches the prototype chain
      console.assert(prop in context, `Property must exist in context`)
      return context[prop]
    },
    apply(target, thisArg, args) {
      return createContext(args[0], context)
    },
  })

  const fnIsFunction = fn && {}.toString.call(fn) === '[object Function]'

  console.assert(fnIsFunction, `Corrupted sns, ${value} not a function`)

  const currentValue = fn()
  return value($)
}

const createVariableUnit = value => {
  return {
    get: () => value,
    set(newValue) {
      value = newValue
      return true
    },
    // units are identified by this mark
    [unit]: true,
  }
}

export { createContext as $ }
