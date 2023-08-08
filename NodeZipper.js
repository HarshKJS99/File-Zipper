
// npm install adm-zip

var arguments = process.argv;

const file_system = require('fs')
const AdmZip = require("adm-zip");

// Check whether node_modules folder exists
var nodeModulePath = arguments[2] + '\\node_modules';
console.log(nodeModulePath);
if (!file_system.existsSync(nodeModulePath)) {
    console.log("ERROR: node_modules folder doesn't exist");
    return;
}

// this is going to contain Directory Names of directories inside node_modules
var FolderArray = [];

// Walk through the directory and push its individual sub-directory paths to FolderArray 
var path = require("path");
function recursivelyListDir(dir, callback) {
    file_system.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = file_system.statSync(dirPath).isDirectory();
        isDirectory
            ? FolderArray.push(dirPath)
            : console.log('Skipping Files');
    });
}

// Call the above function passing node_modules directory path
recursivelyListDir(nodeModulePath, function (filePath) {
    const fileContents = file_system.readFileSync(filePath, "utf8");
});


var startingDir = arguments[2];
var dir = arguments[2] + '\\tmp';
var tempFile = 'target.zip';


FolderArray.forEach(element => {
    var FolderName = element.substr(element.lastIndexOf('\\') + 1, element.length);

    if (!file_system.existsSync(dir)) {
        file_system.mkdirSync(dir);
    }

    // Zip the individual folders of node_modules to tmp directory
    function createZipArchive() {
        try {
            const zip = new AdmZip();
            const outputFile = dir + "\\" + FolderName + ".zip";
            const localFolder = nodeModulePath + "\\" + FolderName;
            zip.addLocalFolder(localFolder);
            zip.writeZip(outputFile);
            console.log(`Created ${outputFile} successfully`);
        } catch (e) {
            console.log(`Something went wrong. ${e}`);
        }
    }

    createZipArchive(); 
});

// Zip the tmp directory and name it as node_modules.zip
function createZipArchive() {
    try {
        const zip = new AdmZip();
        const outputFile = startingDir + "\\node_modules.zip";
        const localFolder = dir;
        zip.addLocalFolder(localFolder);
        zip.writeZip(outputFile);
        console.log(`Created ${outputFile} successfully`);
    } catch (e) {
        console.log(`Something went wrong. ${e}`);
    }
}

createZipArchive();


// Delete the tmp directory
try {
    file_system.rmdirSync(dir, { recursive: true })

    console.log(`${dir} is deleted!`)
} catch (err) {
    throw err;
}

/*
// Delete the node_modules folder (Optional)
try {
    file_system.rmdirSync(nodeModulePath, { recursive: true })

    console.log(`${nodeModulePath} is deleted!`)
} catch (err) {
    throw err;
}
*/





