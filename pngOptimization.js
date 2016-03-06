var child_process   = require('child_process');
var fs   		    = require('fs-extra');
const PNG_EXTENSION = ".png"; 

init();

function init(){
    fs.readJson("./optimizationConfig.json", function(err, config){
        if (err){
            if (err.code == 'ENOENT'){
                console.log("ConfigException : Config do not exist. Creation of default config file 'optimizationConfig.json'. Please complete it.");
                fs.writeJson('./optimizationConfig.json', 
                    {
                        pngquantPath    : "",
                        pngsFolderPaths : []
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

        if (!config.pngsFolderPaths || !config.pngsFolderPaths.length){
            console.log("ConfigException : do not find any folders of pngs");
            return;
        }

        var folderPath;
        var files;
        var file;

        for (var folderIndex in config.pngsFolderPaths){
            folderPath = config.pngsFolderPaths[folderIndex];
            files      = getFiles(folderPath);
            
            for (var fileIndex in files){
				file = files[fileIndex];
				
				if (file.indexOf(PNG_EXTENSION) == file.length - PNG_EXTENSION.length && file.length >= PNG_EXTENSION){
					execPngquant(configCopy.pngquantPath, pngFiles[fileIndex]);
				}
			}
        }
    });
}

function execPngquant(pngquantPath, file){
	var script_process = child_process.spawn(pngquantPath, ["--ext", ".png", "--force", "--verbose", "256", file]);
	
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