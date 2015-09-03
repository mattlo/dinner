var app = angular.module('dinner', [
    'firebase'
]);

app.controller('scheduler', function ($scope, $firebaseObject) {
    var ref = new Firebase('https://mattlo.firebaseio.com');
    var syncObject = $firebaseObject(ref);
    var DELIMITER = '|';

    $scope.days = [];
    $scope.name;
    $scope.rawName;
    $scope.forceForm = false;

    // 3-way binding init
    syncObject.$bindTo($scope, 'data');

    /**
     * Scaffold out the next N of days
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
        $scope.name = name;
        $scope.forceForm = false;

        if (noCache) {
            localStorage.setItem('name', name)
        }
    };

    /**
     * is user available?
     * @param {moment} day
     * @param {String} userData
     * @returns {Boolean}
     */
    $scope.isAvailable = function (day, userData) {
        if (!userData) {
            return true;
        }

        return userData.indexOf(day.format('L')) < 0;
    };

    /**
     * append
     * @param {string} name
     * @param {moment} day
     * @return {undefined}
     */
    $scope.book = function (name, day) {
        if (!$scope.data.attendees) {
            $scope.data.attendees = {};
        }

        $scope.data.attendees[name] += DELIMITER + day.format('L');
    };

    /**
     * remove
     * @param {string} name
     * @param {moment} day
     * @return {undefined}
     */
    $scope.unbook = function (name, day) {
        $scope.data.attendees[name] = $scope.data.attendees[name].replace(DELIMITER + day.format('L'), '');
    };

    /**
     * @param {moment} day
     * @return {String}
     */
    $scope.outputAvailableNames = function (day) {
        if ($scope.data && $scope.data.attendees) {
            return ((function () {
                return Object.keys($scope.data.attendees).reduce(function (arr, name) {
                    // verify item exists
                    if (
                        $scope.data.attendees[name].indexOf(day.format('L')) >= 0 &&
                        arr.indexOf(name) < 0
                    ) {
                        arr.push(name);
                    }

                    return arr;
                }, []);
            }()) || []).join(', ');
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