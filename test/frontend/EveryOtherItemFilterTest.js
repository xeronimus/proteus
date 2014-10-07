describe('EveryOtherItemFilter', function () {

  var testItems = [
    'one',
    'two',
    'three',
    'four'
  ];

  var $filter;

  beforeEach(angular.mock.module('cheatSheets'));


  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_;
  }));


  it('must be a defined filter function', function () {
    expect($filter('everyOtherItem')).not.to.be(undefined);
    expect($filter('everyOtherItem')).to.be.a('function');
  });

  it('should return all odd items', function () {
    var filtered = $filter('everyOtherItem')(testItems);
    expect(filtered.length).to.be(2);
    expect(filtered[0]).to.be(testItems[0]);
    expect(filtered[1]).to.be(testItems[2]);
  });

  it('should return all even items', function () {
    var filtered = $filter('everyOtherItem')(testItems, true);
    expect(filtered.length).to.be(2);
    expect(filtered[0]).to.be(testItems[1]);
    expect(filtered[1]).to.be(testItems[3]);
  });

});
