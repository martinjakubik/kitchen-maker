let oHttp = require("http");
let oUrl = require("url");
let oFs = require("fs");
let oPath = require("path");
let sBaseDirectory = ".";

let nPort = 8080;

oHttp.createServer(function (oRequest, oResponse) {
  try {
    let oRequestUrl = oUrl.parse(oRequest.url);

    let sPath = oRequestUrl.pathname;

    // need to use oPath.normalize so people can't access directories underneath sBaseDirectory
    let sFSPath = sBaseDirectory + oPath.normalize(sPath);
    console.log("normalized path: \"" + sFSPath + "\"");

    if (process.platform === 'win32') {
      console.log('we\'re on windows');
      if (sFSPath === '.\\') {
        sFSPath = '.\\index.html';
      }
    } else {
      if (sFSPath === './') {
        sFSPath = './index.html';
      }
    }

    console.log("transformed path: \"" + sFSPath + "\"");

    let sContentType = "text/plain";

    if (sFSPath.includes("/css/")) {
        sContentType = "text/css";
    } else if (sFSPath.includes("/html/")) {
        sContentType = "text/html";
    } else if (sFSPath.includes("/js/")) {
        sContentType = "application/javascript";
    }

    let oHeaders =  {
       "Content-Type": sContentType
    };

    oResponse.writeHead(200, oHeaders);
    let oFileStream = oFs.createReadStream(sFSPath);
    oFileStream.pipe(oResponse);
    oFileStream.on('error' ,function(e) {
        // assumes the file doesn't exist
        oResponse.writeHead(404);
        oResponse.end()
    });
  } catch(e) {
     oResponse.writeHead(500);

     // ends the oResponse so browsers don't hang
     oResponse.end();
     console.log(e.stack)
  }
}).listen(nPort);

console.log("listening on nPort \"" + nPort + "\"");
