var chai = require ("chai")
require('colors')

function testReport(description, func) {
  var report = {description: description, success: true}
  try {
    func()
    return report
  } catch(e) {
    report.success = false
    report.stack = e.stack
    return report
  }
}

function picture(suiteDescription, suite) {
  var report = {description: suiteDescription, success: true, tests: []}
  var tests = []

  function it(testDescription, test) {
    tests.push({description: testDescription, func: test})
  }

  var report = testReport(suiteDescription, function() {
    suite(it, chai.expect)
  })

  report.tests = tests.map(function(test) {
    return testReport(test.description, test.func)
  })

  return report
}

picture.out = function() {
  report = picture.apply({}, arguments)
  console.log(report.description)
  report.tests.forEach(function(test) {
    console.log(("  " + test.description)[test.success ? 'green' : 'red'])
    if (!test.success) {
      console.log("   " + test.stack)
    }
  })
  return report
}


picture.out("Picture handles tests that fail", function(it, expect) {
  var report = testReport("throws an error", function() { 
    throw new Error("oops") 
  })

  it("includes test description", function() { 
    expect(report.description).to.equal("throws an error") 
  })

  it("knows the test failed", function() { 
    expect(report.success).to.be.false
  })

  it("passes along the stack", function() { 
    expect(report.stack).to.match(/oops/)
  })
})

picture.out("... and those that succeed", function(it, expect) {
  var report = testReport("passes", function() { 
  })

  it("knows it was successful", function() {
    expect(report.success).to.be.true
  })
})

picture.out("... and different it blocks", function(it, expect) {
  var report = picture("a sandwich", function(it) {
    var sandwich = {ingredients: ["avocado"]}
    it("has one ingredient", function() {
      expect(sandwich.ingredients).to.have.length(1)
    })

    it("is mayo", function() {
      expect(sandwich.ingredients[0]).to.equal("mayo")
    })
  })

  it("has two tests", function() {
    expect(report.tests).to.have.length(2)
  })

  it("has the messages", function() {
    expect(report.tests[0].description).to.equal("has one ingredient")
  })

  it("knows which tests failed", function() {
    expect(report.tests[1].success).to.be.false
  })
})

module.exports = picture