function CheatSheetController($location, CheatSheetStore) {
    var vm = this;
    var LOADING = {id: 1, message: 'Loading...'};
    var OK = {id: 2, message: 'Ready'};
    var ERROR = {id: 3, message: 'Something went wrong!'};

    vm.currentCheatSheet = undefined;
    vm.status = LOADING;
    vm.selectCheetSheet = selectCheetSheet;


    function selectCheetSheet(cs) {
        CheatSheetStore.getCheatSheetContent(cs + '.json').then(function (data) {
            vm.currentCheatSheet = data;
            vm.status = OK;
        }, function () {
            vm.status = ERROR;
            vm.status.message = 'Could not load cheat sheet "' + details.file;
        });
    }

    function loadIndex() {
        CheatSheetStore.getCheatSheetIndex().then(function (data) {
            vm.index = data;
            var cheatSheetToDisplay = CheatSheetStore.getCheatSheetById($location.path().substr(1));
            if (angular.isDefined(cheatSheetToDisplay)) {
                selectCheetSheet(cheatSheetToDisplay);
            } else {
                vm.status = ERROR;
                vm.status.message = 'No Cheat Sheets to display...';
            }
        }, function () {
            vm.status = ERROR;
            vm.status.message = 'Could not load cheat sheet index!';
        });
    }


    loadIndex();
}

angular.module('cheatSheets').controller('CheatSheetController', CheatSheetController);


