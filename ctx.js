const listeners = new WeakMap()

export default createCtx = (parent = null) => {
  // contexts use a prototype chain to provide their enclosing contexts
  const ctx = Object.create(parent, { _listeners: {} })
  return new Proxy(ctx, {
    // gets a property from the context
    get(target, prop, receiver) {
      if (prop in ctx) {
        const value = ctx[prop]
        const onChange = fn => {
          const oldListeners = listeners.get(ctx[prop]) || []
          listeners.set(ctx[prop], [fn, oldListeners])
        }
        return [value, onChange]
      } else {
        const output = value => (target[prop] = value)
        return fn => {
          const newCtx = createCtx(ctx)
          const implicitOutput = fn(ctx, output)
          // if (
        }
      }
    },
  })
}

// const isNode = typeof module !== 'undefined' && module.exports
// console.assert(isNode, 'Must be run in node')

//   // NODE IMPLEMENTATION
//   const EventEmitter = require('events')
//   const emitter = new EventEmitter()
//   // Using platform specific implementations to keep it simple
//   // ---

// export default ctx = (parent = null) => {
//   // contexts use a prototype chain to provide their enclosing contexts
//   const context = Object.create(parent, { _listeners: {} })

//   return new Proxy(() => {}, {
//     // defines a property on this context
//     set(target, prop, value, receiver) {
//       Object.defineProperty(context, prop, value)
//       return true
//     },
//     // gets a property from the context
//     get(target, prop, receiver) {
//       return context[prop]
//     },
//     // creates a child context
//     apply(target, thisArg, args) {
//       return ctx(context)
//       // (it was a a miracle)
//     },
//   })
// }
