import sns from './sns.js'

const outputs = []
sns(async function main($) {
  $.con = function conDef($) {
    return function con(value) {
      return function conDefiner($) {
        return value
      }
    }
  }
  $.mut = function mutDef($) {
    return function mut(value) {
      return function mutDefiner($) {
        $.input = $.output
        return value
      }
    }
  }
  $.log = $.con(console.log.bind(console))
  $.a = $ => 'a string 1'
  $.mutable = $.mut(0)
  $.b = function bDef() {
    $.a = $ => 'a string 2'
    $.c = $ => {
      $.a = $ => 'a string 5'
      $('mutable', (a, b) => {
        $.log(a)
      })
    }
  }
  await new Promise(r => setTimeout(r, 5000))
  $.mutable = $.set(1)
  $.mutable = $.set(2)
})
