import { default as createCtx } from './ctx.js'

//
// createCtx(handle => {
//   const a = handle.createCtx('a', $ => {
//     let value = 0
//     setInterval(() => handle.output(value++), 3000)
//     return value++
//   })
//   a.subscribe(console.log.bind(console))
// })

createCtx(handle => {
  handle.createCtx('a', () => 'a string 1')
  handle.createCtx('b', handle => {
    handle.createCtx('a', () => 'a string 2')
    handle.createCtx('c', handle => {
      handle.createCtx('a', () => 'a string 3')
      handle.createCtx('d', handle => {
        handle.createCtx('e', handle => {
          console.assert(
            handle.read('a').value === 'a string 3',
            'getting a property should return the nearest property in the chain',
          )
        })
      })
    })
  })
})
