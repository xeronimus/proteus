/**
 * Provides cheat sheet data by loading them from json files.
 *
 */
function CheatSheetStore($http, $q) {

    var csIndex;

    return {
        getCheatSheetContent: getCheatSheetContent,
        getCheatSheetIndex: getCheatSheetIndex
    };

    function getCheatSheetContent(csFileName) {
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

}

angular.module('cheatSheets').factory('CheatSheetStore', CheatSheetStore);
