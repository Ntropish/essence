import { $, unit } from './sns.js'

const computed = $ => {
  return {
    value: fn => {
      let cache = fn($)
      return {
        get: () => cache,
        [unit]: true,
      }
    },
    [unit]: true,
  }
}
const watch = $ => {
  return {
    value: fn => {},
    [unit]: true,
  }
}
const test = $ => {
  return {
    value: fn => {},
    [unit]: true,
  }
}
const assert = $ => {
  return {
    value: fn => {},
    [unit]: true,
  }
}

export const standard = {
  computed,
  watch,
  test,
  assert,
}

// an sns, pronounced essence, is a function
// that takes a context as an argument
const application = $ => {
  // the context is abbreviated to $ because its
  // used heavily inside snses

  // create units on this context
  $.square = n => n ** 2
  $.display = console.log.bind(console)
  $.n = 0

  // standard is a collection of essences
  // this is just a shorhand for instantiating
  // and applying each one to the context
  Object.entries(standard).forEach(([property, sns]) => ($[property] = $(sns)))

  // (pretending $.square is a library off somewhere else)
  // having tests close to their use-cases
  // seems WAY more intuitive once refactoring gets heavy.
  //
  // certainly any user created abstractions should
  // be tested entirely by use-case tests. if an abstraction
  // has no use cases it should be removed.
  //
  // maybe even with libraries users should be
  // importing tests from those libraries and putting
  // them next to their use-cases. then, when a dev
  // wants to switch out a library they can keep the old
  // tests to verify the new library and account for changes
  // before switching to the new library's tests
  //
  // either way, when a context can tell something
  // is wrong with its environment then you will be free
  // to change the environment without worry
  $.test($ => {
    $.assert({
      actual: $.square(3),
      expected: 9,
    })
  })
  // computed is a standard property that when called
  // with an essence
  $.result = $.computed(() => {
    return $.square($.n)
  })

  // watch
  $.watch($ => {
    $.display($.result)
  })
}

// const displayPanel = document.getElementById('display')

// execute essence
$(application)
