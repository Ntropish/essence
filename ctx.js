export default createCtx = (fn, parent = null) => {
  // contexts use a prototype chain to provide their enclosing contexts
  const link = Object.create(parent, {})

  let getLinkByProp = prop => {
    if (prop in link) {
      let cursor = link
      while (cursor && !cursor.hasOwnProperty(prop)) {
        cursor = Object.getPrototypeOf(cursor)
      }
      if (cursor) {
        return cursor[prop]
      }
    }
  }

  let handlers = {}

  let output

  const ctxInterface = {
    read(prop) {
      return link[prop]
    },
    createLink(fn) {
      link[prop] = createCtx(fn, link)
    },
    setOutput(value) {
      const oldValue = value
      output = value
      Object.values(handlers).forEach(handler => handler(value, oldValue))
    },
  }

  output = fn(ctxInterface)

  let nextChangeHandlerId = 0
  const onChange = fn => {
    const id = nextChangeHandlerId++
    handlers[id] = fn
    return () => {
      delete handlers[id]
    }
  }

  return {
    get value() {
      return output
    },
    onChange,
  }
}
