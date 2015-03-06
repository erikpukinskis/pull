var Library = require('./library')
var library = new Library()

function out(string) {
  console.log("!$ "+string)
}

library.inject('picture.out', out)

library.call('phone')
// and then this will log out the phone tests. 
// but without injection, it is silent