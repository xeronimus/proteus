describe('CheatSheetStore', function () {


  var $httpBackend, CheatSheetStore;

  beforeEach(angular.mock.module('cheatSheets'));


  beforeEach(inject(function (_$httpBackend_, _CheatSheetStore_) {
    $httpBackend = _$httpBackend_;
    CheatSheetStore = _CheatSheetStore_;
  }));


  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('must be defined', function () {
    expect(CheatSheetStore).not.to.be(undefined);
  });

  it('must load return cheat sheet index', function (done) {

    var dummyIndexContent = '["one","two"]';

    $httpBackend.expectGET('storage/index.json').respond(200, dummyIndexContent);

    var promise = CheatSheetStore.getCheatSheetIndex();

    promise.then(function (data) {
      expect(data).to.be.a('array');
      expect(data[0]).to.be('one');
      expect(data[1]).to.be('two');
      done();
    });
    $httpBackend.flush();
  });

  it('must load and return cheat sheet by fileName', function (done) {

    var dummyCheatSheet = {
      'id': 'superCheatCheet',
      'title': 'The Best',
      'chapters': [
        {
          'cheats': [
            {
              'description': 'Clone an existing repository',
              'command': 'git clone ssh://user@domain.com/repo.git'
            },
            {
              'description': 'Create a new local repository',
              'command': 'git init'
            }
          ],
          'title': 'someChapterTitle'
        }
      ]
    };

    $httpBackend.expectGET('storage/one.json').respond(200, angular.toJson(dummyCheatSheet));

    var promise = CheatSheetStore.getCheatSheetContent('one.json');

    promise.then(function (data) {
      expect(data).to.be.a('object');
      expect(data).to.eql(dummyCheatSheet);
      done();
    });
    $httpBackend.flush();
  });


});
