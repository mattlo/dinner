var app = angular.module('dinner', []);

app.controller('scheduler', function ($scope) {
    var dbns = 'mlo';

    $scope.days = [];
    $scope.name;
    $scope.nameKey;
    $scope.rawName;
    $scope.forceForm = false;

    /**
     * Scaffold out the next 3 months
     * @param calendarScope
     * @returns {Array}
     */
    $scope.scaffold = function (calendarScope) {
        return Array(parseInt(calendarScope, 10)).join(0).split(0).reduce(function (arr, item, i) {
            arr.push(moment(arr[i]).add(1, 'days'));
            return arr;
        }, [moment()]);
    };

    /**
     * Sets Name
     * @param name
     * @param noCache
     */
    $scope.setName = function (name, noCache) {
        $scope.nameKey = name.toLowerCase();
        $scope.name = name;
        $scope.forceForm = false;

        if (noCache) {
            localStorage.setItem('name', name)
        }
    };

    // get cached name
    (function (n) {
        if (n) {
            $scope.setName(n, true);
            $scope.rawName = n;
        }
    }(localStorage.getItem('name')))
});