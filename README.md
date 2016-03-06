# PNGOptimization
Optimize all pngs in your folders

## Instructions:
Download and install [nodeJs](https://nodejs.org/en/)<br />
Download and install [pngquant](https://pngquant.org/)<br />
Download pngOptimization.js and package.json<br /><br />
Install node module with command line 
```
npm install
```
<br />Launch application with 
```
node pngOptimization.js
```

<br />Configure optimizationConfig.json
```
{
  "pngquantPath": "./myPathToPngQuant/pngquant.exe",
  "list": [
  	{
  		"path"    : "./pathWhereAllPngWillBeOptimized",
  		"command" : "--ext .png --force --verbose 256"
  	},
    {
  		"path"    : "./pathOfAPng/myPngName.png",
  		"command" : "--ext .png --force --verbose 256"
  	}
  ]
}
```
