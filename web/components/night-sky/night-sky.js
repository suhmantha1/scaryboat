/* global angular */
angular.module('ua5App')
    .directive('nightSky', [function() {
        return {
            restrict: 'A',
            templateUrl: 'components/night-sky/night-sky.html',
            link: function($scope, element, attrs) {}
        };
    }])
;
