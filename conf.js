function send_mail() {
    console.log("Sending Mail with reports for the test execution.");
    var sys = require('util')
    var exec = require('child_process').exec;

    function puts(error, stdout, stderr) {
        sys.puts(stdout)
    }
    exec("node nodemailer.js", puts);
}

exports.config = {
      seleniumAddress: 'http://localhost:4444/wd/hub',
      capabilities: {
          'browserName': 'chrome'
      },
      specs: ['spec.js'],
     framework: 'jasmine2' ,
      onPrepare: function() {
          var jasmineReporters = require('D:/Protractor/node_modules/jasmine-reporters');
          jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter(null, true, true)
          );
		  var fs = require('fs-extra');
 
          fs.emptyDir('Reports/screenshots/', function (err) {
          console.log(err);
             });
 
             jasmine.getEnv().addReporter({
             specDone: function(result) {
             if (result.status == 'failed') {
                browser.getCapabilities().then(function (caps) {
                    var browserName = caps.get('browserName');
 
                    browser.takeScreenshot().then(function (png) {
                        var stream = fs.createWriteStream('Reports/screenshots/' + browserName + '-' + result.fullName+ '.png');
                        stream.write(new Buffer(png, 'base64'));
                        stream.end();
                    });
                });
            }
        }
    });
     },
	 
	 
	 // This will help to read a json dat from the file
//	  params: {
  //   testdata: require('./config.json')
  //}     browser.params.testdata.users
  
  
	 onComplete: function() {
     var browserName, browserVersion;
     var capsPromise = browser.getCapabilities();

     capsPromise.then(function (caps) {
        browserName = caps.get('browserName');
        browserVersion = caps.get('version');

        var HTMLReport = require('protractor-html-reporter');

		testConfig = {
            reportTitle: 'Test Execution Report',
            outputPath: 'Reports/',
            screenshotPath: './screenshots',
            testBrowser: browserName,
            browserVersion: browserVersion,
            modifiedSuiteName: false,
            screenshotsOnlyOnFailure: true
        };
        new HTMLReport().from('junitresults.xml', testConfig);
    });
	send_mail();
 }	 
   };
