@echo on
set errorlevel = 0
::WebDriver update
start /b webdriver-manager update
    If %errorlevel% neq 0 set &quot;job=webdriver-manager update&quot; exit/b &amp;goto err
    ::exit/b 
     
::Start selenium  server
start /b webdriver-manager start
    If %errorlevel% neq 0 set &quot;job=webdriver-manager start&quot; exit/b &amp;goto err
     
::Change directory
cd D:\Protractor
    If %errorlevel% neq 0 set &quot;job=changing directory&quot; exit/b &amp;goto err
 

 
::Start running tests
protractor conf.js
    If %errorlevel% neq 0 set &quot;job=protractor conf.js&quot; exit/b &amp;goto err
 
:err
    echo ERROR: %job% execution failed with error
	
	pause