var expect = require('expect.js');
var parser = require('../../tasks/cheatSheetInputParser');


describe('CheatSheetInputParser', function () {


  var lineCountWrongInput = '# git Fast Version Control\n## create\nClone an existing repository';
  var firstLineWrongInput = 'git Fast Version Control\n## create\nClone an existing repository\n$ some';
  var simpleValidInput = '# test Some Title\n## chap1\nDescription one\n$ some command';

  it('should throw on wrong linecount', function () {
    expect(function () {
      parser.parse(lineCountWrongInput);
    }).to.throwError(function (err) {
        expect(err.message).to.contain('Cheat Sheet input file must have at least');
      })
  });

  it('should throw on invalid first line', function () {
    expect(function () {
      parser.parse(firstLineWrongInput);
    }).to.throwError(function (err) {
        expect(err.message).to.contain('Please specify cheat Sheet header:  # id Then a Title');
      })
  });

  it('should correctly parse valid input', function () {
    var result = parser.parse(simpleValidInput);
    var resultObject = JSON.parse(result);
    expect(resultObject).to.eql({
      id: 'test',
      title: 'Some Title',
      chapters: [
        {
          cheats: [{
            command:'some command',
            description: 'Description one'
          }],
          title: 'chap1'
        }
      ]
    });
  });


});