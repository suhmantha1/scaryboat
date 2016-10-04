/* global angular, $ */
angular.module('ua5App')
    .directive('boat', [function() {
        return {
            restrict: 'A',
            templateUrl: 'components/boat/boat.html',
            link: function($scope, element, attrs) {
                setTimeout(function() {
                    $('.wrapper').addClass('zoom');
                }, 5000);
            }
        };
    }])
;
