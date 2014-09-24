function CheatSheetController($location, CheatSheetProvider) {
    var vm = this;
    var LOADING = {id: 1, message: 'Loading...'};
    var OK = {id: 2, message: 'Ready'};
    var ERROR = {id: 3, message: 'Something went wrong!'};

    vm.currentCheatSheet = undefined;
    vm.status = LOADING;
    vm.selectCheetSheet = selectCheetSheet;


    function selectCheetSheet(details) {
        CheatSheetProvider.getCheatSheet(details).then(function (data) {
            vm.currentCheatSheet = data;
            vm.status = OK;
        }, function () {
            vm.status = ERROR;
            vm.status.message = 'Could not load cheat sheet "' + details.file;
        });
    }

    function loadIndex() {
        CheatSheetProvider.getCheatSheetIndex().then(function (data) {
            vm.index = data;
            loadPreselection();
        }, function () {
            vm.status = ERROR;
            vm.status.message = 'Could not load cheat sheet index!';
        });
    }

    function loadPreselection() {
        var preselectedCheatSheet = $location.path().substr(1);
        if (angular.isDefined(vm.index[preselectedCheatSheet])) {
            selectCheetSheet(vm.index[preselectedCheatSheet]);
        } else {
            loadFirstCheatSheet();
        }
    }

    function loadFirstCheatSheet() {
        var firstCheatSheet = getFirstPropertyOrUndefined(vm.index);
        if (angular.isDefined(firstCheatSheet)) {
            selectCheetSheet(firstCheatSheet);
            return;
        }
        vm.status = ERROR;
        vm.status.message = 'No Cheat Sheets to display...';
    }

    function getFirstPropertyOrUndefined(obj) {
        var keys = Object.keys(obj);
        if (keys.length > 0) {
            return obj[keys[0]];
        }
        return undefined;
    }

    loadIndex();
}

angular.module('cheatSheets').controller('CheatSheetController', CheatSheetController);


