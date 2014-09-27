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
