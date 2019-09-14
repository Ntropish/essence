import { $ } from './ctx.js'

//
const gma = $()
const mom = gma(parent)
const smallChild = mom(child)
gma.mom = mom
mom.smallChild = smallChild
