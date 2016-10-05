/* global angular */
angular.module('ua5App')
    .directive('sky', [function() {
        return {
            restrict: 'A',
            templateUrl: 'components/sky/sky.html',
            link: function($scope, element, attrs) {
                var time = new Date();
                time = time.getHours();

                if (time > 7 && time < 18) {
                    $scope.dayTime = true;
                } else {
                    $scope.dayTime = false;
                }
            }
        };
    }])
;
