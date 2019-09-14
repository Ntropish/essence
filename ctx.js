const listeners = new WeakMap()

export default createCtx = (fn, parent = null) => {
  const watch = fn => {
    // let cursor = ctx
    // while (cursor && !cursor.hasOwnProperty(property)) {
    //   cursor = Object.getPrototypeOf(cursor)
    // }
    // if (cursor) {
    //   // property located in the chain

    // }
    ctx[property].watchers.push('')
  }

  // contexts use a prototype chain to provide their enclosing contexts
  const ctx = Object.create(parent, {
    watch,
  })

  const ctxInterface = new Proxy(ctx, {
    // gets a property from the context
    get(target, prop, receiver) {
      if (prop in ctx) {
        return ctx[prop].value
      } else {
        const output = value => (target[prop] = value)
        return fn => {
          const newCtx = createCtx(fn, ctx)
          // if (
        }
      }
    },
  })

  let value
  let setValue = newValue => (value = newValue)
  let output = fn(ctxInterface, setValue)
  return {
    value,
    onChange,
  }
}

const onChange = fn => {
  const oldListeners = listeners.get(ctx[prop]) || []
  listeners.set(ctx[prop], [fn, oldListeners])
}
