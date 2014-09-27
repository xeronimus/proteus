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
