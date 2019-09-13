export default $($ => {
  // This creates a namespace to hide nextId
  $.node = $($ => {
    let nextId = 0
    $.s = {}
    $.list = $.computed($ => $.Object.keys($.s))
    $.createNode = $ => ($.nodes[nextId++] = {})
  })
  $.path = []
  // If path is ever changed then this will rerun
  $.currentNode = $.computed($ => $.path[$.path.length - 1])
  $.enter = $($ => {
    const nodeId = $.currentNode[$.currentOptionIndex]
    $.path.push(nodeId)
  })
  $.exit = $($ => {
    $.path.pop($.args[0])
  })
  $.columns = $.computed($ => path.map(id => $.path.map(id)))
  $.columnWidth = 200
  $.optionIndexes = $.Map()
  $.currentOptionIndex = $.define({
    get: $ => $.optionIndexes.get($.currentNode),
    set: $ => $.optionIndexes.set($.currentNode, $.args[0]),
  })
  // $.keyCommands = ($, commands) => {
  //   $.document.addEventListener('keydown', e => commands[e.keyCode])
  // }
  $.keyCommands({
    37: () => $.enterCurrentNode(),
    38: () => $.currentOptionIndex++,
    39: () => $.exit(),
    40: () => $.currentOptionIndex--,
  })
  $.paneWidth = $.calculated($ => $.path.length * $.columnWidth)

  return $.template(
    [
      // App
      'div',
      { className: 'app' },
      // Columns
      ...$.node.list.map(node => [
        'div',
        { className: 'column' },
        // Option Pane
        $.template(
          [
            'div',
            { className: 'option-list' },
            // Options
            $.Object.keys(node).map(childName => [
              'div',
              { className: 'option' },
              childName,
            ]),
          ],
          {
            optionList: {
              top: $.indexes.get(node) * $.optionHeight,
            },
          },
        ),
      ]),
    ],
    {
      app: {
        display: 'flex',
        width: $.paneWidth,
        left: `calc(50% - ${$.paneWidth})`,
      },
      node: {
        width: $.columnWidth,
      },
    },
  )
})
