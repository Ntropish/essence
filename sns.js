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
            // TODO: Add prefix to built in props
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
