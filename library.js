var expect = require("chai").expect
function Library() {
  this.libs = {}
}
Library.prototype.describe = function(name, deps, func) {
  this.libs[name] = func
}
Library.prototype.call = function(name, deps, injections) {
  var args = []
  for(var i=0; i<deps.length; i++) {
    var dep = deps[i]
    var arg = {}
    for (key in injections[dep] || {}) {
      arg[key] = injections[dep][key]
    }
    args.push(arg)
  }

  this.libs[name].apply({}, args)
}

describe("a library with a library in it", function() {
  it("passes data to a function's dependencies when you call it", function() {

    var library = new Library()

    var hostFromInside

    library.describe("test-1", ["phone"], function(phone) {
      hostFromInside = phone.host
    })

    library.call("test-1", ["phone"], {phone: {host: "birdland:"}})

    expect(hostFromInside).to.equal("birdland:")
  })
})
