var readline = require('readline');
var fs = require('fs');
var path = require('path');
require('shelljs/global');

var replaceInFile = function (filePath, searchPattern, value) {
    var filePath = path.join('wb-ui-module-template', filePath), str = fs.readFileSync(filePath, {encoding: 'utf-8'});
    str = str.replace(new RegExp(searchPattern, 'g'), value);
    fs.writeFileSync(filePath, str);
};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

exec("git clone http://192.168.3.5:7990/scm/~aselva/wb-ui-module-template.git");
rl.question("Please Enter the module name: ", function(moduleName) {

    replaceInFile('package.json', '##PROJECT_NAME##', moduleName);
    replaceInFile('README.md', '##PROJECT_NAME##', moduleName);
    replaceInFile('bower.json', '##PROJECT_NAME##', moduleName);
    replaceInFile(path.join('app', 'index.html'), '##PROJECT_NAME##', moduleName);
    replaceInFile(path.join('config', 'environment.js'), '##PROJECT_NAME##', moduleName);
    replaceInFile(path.join('tests', 'index.html'), '##PROJECT_NAME##', moduleName);
    replaceInFile(path.join('tests', 'blanket-options.js'), '##PROJECT_NAME##', moduleName);

    rl.question("Please enter the port number allocated for " + moduleName + ": \n(You can lookup the ports already in use here http://192.168.3.5:8090/pages/viewpage.action?pageId=622928) \n", function (portNumber) {
        replaceInFile('.ember-cli', '##PORT_NUMBER##', portNumber);
        replaceInFile('README.md', '##PORT_NUMBER##', portNumber);

        fs.renameSync('wb-ui-module-template', moduleName);

        cd(moduleName);
        exec('git commit -a -m "[aselva] Initial setup"');
        exec('git remote rm origin');
        
        process.exit(0);
    });
});