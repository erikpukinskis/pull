var picture = require("./picture")

function Library() {
  this.id = Math.floor(Math.random()*100)
  this.libs = {}
}
Library.prototype.describe = function(name, deps, func) {
  this.libs[name] = func
}
Library.prototype.call = function(name, deps, injections) {
  this.do(deps, injections, this.libs[name])
}
Library.prototype.do = function(deps, injections, func) {
  var args = []
  for(var i=0; i<deps.length; i++) {
    var dep = deps[i]

    if (this.libs[dep]) { 
      var arg = this.libs[dep]()
    } else {
      var arg = require("./"+dep)
    }

    for (key in injections[dep] || {}) {
      arg[key] = injections[dep][key]
    }
    args.push(arg)
  }

  func.apply({}, args)
}
Library.prototype.test = function(description, deps, func) {
  var libs = this.libs
  return picture(description, function(it, expect) {
    var values = deps.map(function(dep) {
      if (dep == 'it') {
        return it
      } else if (dep == 'expect') {
        return expect
      } else {
        return libs[dep]()
      }
    })
    return func.apply({}, values)
  })
}

picture("Library", function(it, expect) {
  it("passes data to a function's dependencies when you call it", function() {
    var library = new Library()

    var hostFromInside

    library.describe("phone", [], function() { return {}})
    library.describe("test-1", ["phone"], function(phone) {
      hostFromInside = phone.host
    })

    library.call("test-1", ["phone"], {phone: {host: "birdland:"}})

    expect(hostFromInside).to.equal("birdland:")
  })

  it("can run functions without naming them", function() {
    var library = new Library()
    var ran = false
    library.do([], {}, function() {
      ran = true
    })
    expect(ran).to.be.true
  })

  it("passes in dependencies", function() {
    var library = new Library()
    library.describe("sandwich", [], function() { return "yummy" })
    var sandwichFromInside
    library.do(["sandwich"], {}, function(sandwich) {
      sandwichFromInside = sandwich
    })
    expect(sandwichFromInside).to.equal("yummy")
  })
})

picture(" ..running a test", function(it, expect) {
  library = new Library()
  library.describe("hatchery", [], function() { return "pengwings"})
  var report = library.test('Hatchery seems ok', ['it'], function(it) {
    it('hatches pengwings', function(){})
  })

  it('includes a test result', function() {
    expect(report.tests).to.have.length(1)
  })

  it("knows it was pengwings", function() {
    expect(report.tests[0].description).to.equal("hatches pengwings")
  })
})

picture.out(" ..falling back to local files", function(it, expect) {
  library = new Library()

  it('should require ./whatever', function() {
    library.do(['picture'], {}, function(pic) {
      expect(pic).to.be.defined
    })    
  })
})

module.exports = Library