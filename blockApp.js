export default $.component($ => {
  $.state = {}
  $.result = $.computed($ => $.state.a + $.state.b)
  return $.template([
    'div',
    null,
    ...$.range(0, $.state.a).map(redBlock),
    ...$.range(0, $.state.b).map(blueBlock),
    'Total blocks',
    $.result,
  ])
})
