import 'babel-polyfill'
import { jsdom } from 'jsdom'

global.document = jsdom()
global.window = document.defaultView
global.navigator = { userAgent: 'node.js' }

const element = document.createElement('div')
element.id = 'app'
document.body.appendChild(element)
