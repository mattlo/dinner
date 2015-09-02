var app = angular.module('dinner', []);

app.controller('scheduler', function ($scope) {
    $scope.days = [];

    // scaffold out the next 3 months
    $scope.scaffold = function (calendarScope) {
        return Array(parseInt(calendarScope, 10)).join(0).split(0).reduce(function (arr, item, i) {
            arr.push(moment(arr[i]).add(1, 'days'));
            return arr;
        }, [moment()]);
    }
});