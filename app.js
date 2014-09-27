angular.module('cheatSheets',[]);

function CheatSheetController($location, CheatSheetStore) {
    var vm = this;
    var LOADING = {id: 1, message: 'Loading...'};
    var OK = {id: 2, message: 'Ready'};
    var ERROR = {id: 3, message: 'Something went wrong!'};
    var NO_CS_SELECTED = {id: 4 };

    vm.currentCheatSheet = undefined;
    vm.status = LOADING;
    vm.selectCheetSheet = selectCheetSheet;

    function selectCheetSheet(givenCheatSheetId) {

        if (!givenCheatSheetId || givenCheatSheetId.length < 1) {
            vm.status = NO_CS_SELECTED;
            return;
        }

        vm.status = LOADING;
        CheatSheetStore.getCheatSheetContent(givenCheatSheetId + '.json').then(function (data) {
            vm.currentCheatSheet = data;
            vm.status = OK;
        }, function () {
            vm.status = ERROR;
            vm.status.message = 'Could not load cheat sheet "' + givenCheatSheetId + '"';
        });
    }

    function loadIndex() {
        CheatSheetStore.getCheatSheetIndex().then(function (data) {
            vm.index = data;
            selectCheetSheet($location.path().substr(1));
        }, function () {
            vm.status = ERROR;
            vm.status.message = 'Could not load cheat sheet index!';
        });
    }


    loadIndex();
}

angular.module('cheatSheets').controller('CheatSheetController', CheatSheetController);

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

/**
 * Returns every other item within a given collection.
 */
function EveryOtherItemFilter() {

    return function (items, even) {
        if (angular.isUndefined(items) || !angular.isArray(items)) {
            return undefined;
        }

        var filteredItems = [];
        var match = even ? 1 : 0;
        items.forEach(function (element, index) {
            if (index % 2 === match) {
                filteredItems.push(element);
            }

        });

        return filteredItems;
    };

}

angular.module('cheatSheets').filter('everyOtherItem', EveryOtherItemFilter);
