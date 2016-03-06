var child_process   = require('child_process');
var fs   		    = require('fs-extra');
const PNG_EXTENSION = ".png"; 

init();

function init(){
    fs.readJson("./optimizationConfig.json", function(err, config){
        if (err){
            if (err.code == 'ENOENT'){
                console.log("ConfigException : Config does not exist. Creation of default config file 'optimizationConfig.json'. Please complete it.");
                fs.writeJson('./optimizationConfig.json', 
                    {
                        pngquantPath : "",
                        list         : []
                    }, 
                    function (err) {
                        if (err) {
                            console.log(err)
                        }
                    }
                );
                return;
            }

            console.log("ConfigException : " + err);
            return;
        }

        if (!config.list || !config.list.length){
            console.log("ConfigException : do not find any optimization of pngs in list");
            return;
        }

        var optimization;
        var path; 
        var command;
        var files;
        var file;
        var lstat;

        for (var i in config.list){
            optimization = config.list[i];
            path         = optimization.path    || "";
            command      = optimization.command || "";
            lstat        = fs.lstatSync(path);
            
            if (lstat.isDirectory()){
            	files = getFiles(path);

            	if (!files.length){
            		console.log("Folder : " + path + " is empty.");
            		continue;
            	}

            	for (var fileIndex in files){
					file = files[fileIndex];
					
					if (file.indexOf(PNG_EXTENSION) == file.length - PNG_EXTENSION.length && file.length >= PNG_EXTENSION.length){
						execPngquant(config.pngquantPath, file, command);
					}
				}

            } else if (lstat.isFile()) {
            	if (file.indexOf(PNG_EXTENSION) == file.length - PNG_EXTENSION.length && file.length >= PNG_EXTENSION.length){
            		execPngquant(config.pngquantPath, path, command);
				} else {
					console.log("ConfigException : " + path + ", use pngquant only for png!");
				}
            } else {
            	console.log("ConfigException : " + path + " not supported");
            }
        }
    });
}

function execPngquant(pngquantPath, file, command){
	console.log("Starting optimization for " + file + " with command " + command)

	command = command.split(" ");
	command.push(file);

	var script_process = child_process.spawn(pngquantPath, command);
	
	script_process.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	script_process.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	script_process.on('close', function (code) {
		console.log('child process exited with code ' + code);
	});
}

function getFiles (dir, files_){
    files_    = files_ || [];
    var files = fs.readdirSync(dir);

    for (var i in files){
        var name = dir + '/' + files[i];

        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }

    return files_;
}