var expect = require ('chai').expect

function TestReport(description, func) {
  this.description = description
  this.func = func
}
TestReport.prototype.run = function() {
  var report = {description: this.description, success: true}
  try {
    this.func()
    return report
  } catch(e) {
    report.success = false
    report.stack = e.stack
    return report
  }
}


describe("a test that fails", function() {
  var report = new TestReport('throws an error', function() { 
    throw new Error('oops') 
  }).run()

  it('includes test description', function() { 
    expect(report.description).to.equal('throws an error') 
  })

  it('knows the test failed', function() { 
    expect(report.success).to.be.false
  })

  it('passes along the stack', function() { 
    expect(report.stack).to.match(/oops/)
  })
})

describe("a test that passes", function() {
  var report = new TestReport('passes', function() { 
  }).run()

  it('knows it was successful', function() {
    expect(report.success).to.be.true
  })
})