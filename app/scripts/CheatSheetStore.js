/**
 * Provides cheat sheet data by loading them from json files.
 *
 */
function CheatSheetStore($http, $q) {

  var csIndex;
  var cheatSheetCache = {};

  return {
    getCheatSheetContent: getCheatSheetContent,
    getCheatSheetIndex: getCheatSheetIndex,
    clearCache: clearCache
  };


  function getCheatSheetContent(csFileName) {
    var deferred = $q.defer();
    if (cheatSheetCache[csFileName]) {
      deferred.resolve(cheatSheetCache[csFileName]);
    } else {
      loadCheatSheetContent(csFileName).then(function (data) {
        cheatSheetCache[csFileName] = data;
        deferred.resolve(data);
      }, deferred.reject);
    }
    return deferred.promise;
  }

  function loadCheatSheetContent(csFileName) {
    var deferred = $q.defer();
    $http.get('storage/' + csFileName).success(function (data) {
      var csData = angular.fromJson(data);
      deferred.resolve(csData);
    }).error(function () {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getCheatSheetIndex() {
    var deferred = $q.defer();
    $http.get('storage/index.json').success(function (data) {
      csIndex = angular.fromJson(data);
      deferred.resolve(csIndex);
    }).error(function () {
      deferred.reject();
    });
    return deferred.promise;
  }

  function clearCache() {

  }

}

angular.module('cheatSheets').factory('CheatSheetStore', CheatSheetStore);
