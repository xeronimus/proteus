function CheatSheetStore($http, $q) {


    var csIndex;

    return {
        getCheatSheetContent: getCheatSheetContent,
        getCheatSheetById: getCheatSheetById,
        getCheatSheetIndex: getCheatSheetIndex
    };


    function getCheatSheetById(cheatSheetId) {
        if (angular.isUndefined(csIndex)) {
            throw new Error('Please load Cheat Sheet Index first');
        }
        if (angular.isDefined(csIndex[cheatSheetId])) {
            return csIndex[cheatSheetId];
        } else {
            return getFirstCheatSheetOrUndefined();
        }
    }

    function getFirstCheatSheetOrUndefined() {
        var keys = Object.keys(csIndex);
        if (keys.length > 0) {
            return csIndex[keys[0]];
        }
        return undefined;
    }

    function getCheatSheetContent(csFileName) {
        var deferred = $q.defer();
        $http.get('/storage/' + csFileName).success(function (data) {
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
            csIndex = angular.fromJson(data);
            deferred.resolve(csIndex);
        }).error(function () {
            deferred.reject();
        });
        return deferred.promise;
    }

}

angular.module('cheatSheets').factory('CheatSheetStore', CheatSheetStore);


