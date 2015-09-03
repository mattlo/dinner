var app = angular.module('dinner', [
    'firebase'
]);

app.controller('scheduler', function ($scope, $firebaseObject) {
    var ref = new Firebase('https://mattlo.firebaseio.com');
    var DELIMITER = '|';

    $scope.days = [];
    $scope.name;
    $scope.nameKey;
    $scope.rawName;
    $scope.forceForm = false;
    $scope.data = $firebaseObject(ref);

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
     * @param {String} name
     * @param {Boolean} noCache
     */
    $scope.setName = function (name, noCache) {
        $scope.nameKey = name.toLowerCase();
        $scope.name = name;
        $scope.forceForm = false;

        if (noCache) {
            localStorage.setItem('name', name)
        }
    };

    /**
     * is user available?
     * @param {String} userData
     * @returns {Boolean}
     */
    $scope.isAvailable = function (userData) {
        return true;
    };

    /**
     * @param {moment} day
     * @return {String}
     */
    $scope.outputAvailableNames = function (day) {
        return ((function () {
            if ($scope.data.attendees) {
                return Object.keys($scope.data.attendees).reduce(function (arr, name) {
                    if ($scope.data.attendees[name].indexOf(day.format('L')) >= 0 && arr.indexOf(name) < 0) {
                        arr.push(name);
                    }

                    return arr;
                }, []);
            }
        }()) || []).join(', ');
    };

    // get cached name
    (function (n) {
        if (n) {
            $scope.setName(n, true);
            $scope.rawName = n;
        }
    }(localStorage.getItem('name')))
});