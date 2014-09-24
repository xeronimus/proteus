function CheatSheetProvider($http, $q) {

    return {
        getCheatSheet: getCheatSheet,
        getCheatSheetIndex: getCheatSheetIndex
    };

    function getCheatSheet(cs) {
        var deferred = $q.defer();
        $http.get('/storage/' + cs.file).success(function (data) {
            var csData = angular.fromJson(data);
            deferred.resolve(csData);
        }).error(function () {
            deferred.reject();
        });
        return deferred.promise;
    }

    function getCheatSheetIndex() {
        var deferred = $q.defer();
        $http.get('/storage/index.json').success(function (data) {
            var index = angular.fromJson(data);
            deferred.resolve(index);
        }).error(function () {
            deferred.reject();
        });
        return deferred.promise;
    }

}

angular.module('cheatSheets').factory('CheatSheetProvider', CheatSheetProvider);


