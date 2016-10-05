/* global angular */
angular.module('ua5App')
    .directive('daySky', [function() {
        return {
            restrict: 'A',
            templateUrl: 'components/day-sky/day-sky.html',
            link: function($scope, element, attrs) {}
        };
    }])
;
