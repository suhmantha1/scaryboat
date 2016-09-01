/* global angular, $ */
// Create templates module for ngTemplates to attach to
angular.module('ua5Templates', []);
// start module declaration
angular.module('ua5App.home', []);
// end module declaration
// Create parent module for application
angular.module('ua5App', [
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ua5Templates',
    'ui.router',
    'angulartics',
    'angulartics.google.analytics',
    // start add states as app dependency
    'ua5App.home'
    // end add states as app dependency
])
    .constant('BREAKPOINTS', {
        MOBILE: 375,
        PHABLET: 767,
        TABLET: 991,
        LAPTOP: 1199,
        DESKTOP: 1430
    })
    .config(['$analyticsProvider', '$locationProvider', function($analyticsProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        // Prevents bounce rate of 0.01
        $analyticsProvider.firstPageview(false);
    }])
    .directive('app', ['$rootScope', function($rootScope) {
        return {
            link: function($scope, $element, $attrs) {
                var $$window;
                $$window = $(window);
                $$window.on('resize', function() {
                    $rootScope.$broadcast('app:resized');
                });
                $$window.on('click', function(e) {
                    $rootScope.$broadcast('app:clicked', e.target);
                });
                $$window.on('scroll', function(e) {
                    $rootScope.$broadcast('app:scrolled');
                });
                $$window.on('keydown', function(e) {
                    var ESCAPE = 27;
                    var keyCode;
                    keyCode = e.keyCode;
                    // Escape key
                    if (keyCode === ESCAPE) {
                        $rootScope.$broadcast('app:escape:pressed');
                    }
                });
                $rootScope.$on('$stateChangeSuccess', function(e, toState, toStateParams, fromState) {
                    var regex = /^([^.]*).*/;
                    var toStateName = toState.name;
                    var fromStateName = fromState.name;
                    var toStateParent = toStateName.match(regex)[1];
                    var fromStateParent = fromStateName.match(regex)[1];
                    $rootScope.pageClass = 'page-' + toState.name.replace('.', '-');
                    // Allow page transitions after initial site load.
                    setTimeout(function() {
                        $rootScope.transitionsReady = true;
                    }, 0);
                    // Only scroll to top of page if navigating away from a
                    // parent / child relationship. For example, do not scroll
                    // to top if going from the state "contact" to the state
                    // "contact.overlay".
                    if (toStateParent !== fromStateParent) {
                        $$window.scrollTop(0);
                    }
                });
            }
        };
    }])
;
