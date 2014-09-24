/**
 *
 * txt2csJson : text to cheat sheet json
 *
 * reads in a text file and procudes valid chapter json
 *
 * usage:  node txt2csJson.js  inputFile.txt
 *
 * The input file is expected to be of the following format:
 *
 * descriptionLine
 * $ command line starting with a dollar sign
 * descriptionLine
 * optional comment line, ending with a exclamation mark !
 * $ commandLine
 * descriptionLine
 * additional descriptionLine
 * $ commandLine
 *
 */
var fs = require('fs'),
    path = require('path');


function processInput(data) {
    var lines = data.split('\n');

    var expectCommandLine = false;
    var currentCheat;
    var cheats = [];
    lines.forEach(function (line) {
        var trimmedLine = line.trim();
        if (expectCommandLine && trimmedLine.charAt(0) === '$') {
            // we have a command
            currentCheat.command = trimmedLine.replace('$ ', '');
            expectCommandLine = false;
            cheats.push(currentCheat);
        } else if (expectCommandLine && trimmedLine.charAt(trimmedLine.length - 1) === '!') {
            // we have a comment line
            currentCheat.comment = trimmedLine;
        } else if (expectCommandLine) {
            // description goes on...
            currentCheat.description = currentCheat.description + ' ' + trimmedLine;
        } else {
            currentCheat = {
                description: trimmedLine
            };
            expectCommandLine = true;

        }
    });

    var chapter = {
        title: '',
        cheats: cheats
    };
    console.log(JSON.stringify(chapter, null, 4));
}

function run() {
    var commandLineArguments = process.argv.splice(2);
    if (commandLineArguments.length < 1) {
        throw new Error('Please specify input file');
    }

    var inputFile = path.resolve(commandLineArguments[0]);

    fs.exists(inputFile, function (exists) {
        if (exists) {
            fs.readFile(inputFile, 'utf8', function (err, data) {
                if (err) {
                    return console.error(err);
                }
                console.log(inputFile + ' opened...');
                processInput(data);
            });

        } else {
            throw new Error('Input file does not exists: ' + inputFile);
        }
    });

}

run();
