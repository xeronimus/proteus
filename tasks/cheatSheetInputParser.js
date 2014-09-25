function throwIfInvalidFirstLine(line) {
    if (line.charAt(0) !== '#') {
        throw new Error('Please specify cheat Sheet header:  # id Then a Title');
    }
}

function getNewCheatSheetFromFirstLine(line) {
    var parts = line.substr(2).split(' ');
    return {
        id: parts[0],
        title: (parts.length > 1) ? parts.splice(1).join(' ') : '',
        chapters: []
    };
}

function isCommentLine(line) {
    return line.charAt(line.length - 1) === '!';
}

function isCommandLine(line) {
    return line.substring(0, 2) === '$ ';
}

function isChapterLine(line) {
    return line.substring(0, 3) === '## ';
}


function throwIfInvalidLineCount(lineCount) {
    if (lineCount < 4) {
        throw new Error('Cheat Sheet input file must have at least 4 lines!');
    }
}
function parse(data) {
    var lines = data.split('\n');
    var lineCount = lines.length;

    throwIfInvalidLineCount(lineCount);

    var trimmedFirstLine = lines[0].trim();
    throwIfInvalidFirstLine(trimmedFirstLine);

    var cheatSheet = getNewCheatSheetFromFirstLine(trimmedFirstLine);
    var currentChapter;
    var currentCheat;

    for (var i = 1; i < lineCount; i++) {
        var line = lines[i];
        var trimmedLine = line.trim();

        if (isChapterLine(trimmedLine)) {
            if (currentChapter) {
                cheatSheet.chapters.push(currentChapter);
            }
            currentChapter = {
                cheats: [],
                title: trimmedLine.substring(3)
            };
        } else if (isCommentLine(trimmedLine)) {
            if (currentCheat) {
                currentCheat.comment = trimmedLine;
            } else {
                throw new Error('no cheat, cannot save comment line...');
            }
        } else if (isCommandLine(trimmedLine)) {
            if (!!(currentCheat && currentChapter)) {
                currentCheat.command = trimmedLine.substr(2);

                // command line is the last line of one cheat!
                currentChapter.cheats.push(currentCheat);
                currentCheat = {};
            } else {
                throw new Error('no cheat, cannot save command line...');
            }

        } else {
            if (!currentCheat) {
                currentCheat = {};
            }
            if (currentCheat.description) {
                currentCheat.description = currentCheat.description + ' ' + trimmedLine;
            } else {
                currentCheat.description = trimmedLine;
            }
        }
    }

    // push last chapter
    cheatSheet.chapters.push(currentChapter);

    return JSON.stringify(cheatSheet, null, 4);
}


module.exports.parse = parse;