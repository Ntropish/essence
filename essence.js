function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  )
}

const node = Symbol('Node')

function createContext(value, parent = null) {
  const context = Object.create(parent, {})
  const interface = new Proxy(() => {}, {
    set: function writeContext(target, prop, value, receiver) {
      if (interface !== receiver) return
      const descriptor = valueIsNode(value) ? value : createVariableNode(value)
      Object.defineProperty(context, prop, descriptor)
    },
    get: function readContext(target, prop, receiver) {
      if (interface !== receiver) return
      console.assert(context[prop], `Property must exist in context`)
      return context[prop]
    },
    apply(target, thisArg, args) {
      return createContext(args[0], context)
    },
  })

  if (isFunction(value)) return value(interface)
}

function valueIsNode(value) {
  return typeof value === 'object' && value !== null && value[node] === true
}

const createVariableNode = value => {
  return {
    get: () => value,
    set(newValue) {
      value = newValue
      return true
    },
  }
}

module.exports = {
  $: createContext,
  node,
}
