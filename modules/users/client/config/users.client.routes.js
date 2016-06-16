/**
 * Created by Kyle on 6/14/2016.
 */
(function () {
    'use strict';
    
    angular.module('users.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {

        $stateProvider
            .state('authentication', {
                abstract: true,
                url: '/authentication',
                templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm'
            })
            .state('authentication.signin', {
                url: '/signin?err',
                templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Signin'
                }
            })
            .state('authentication.signup', {
                url: '/signup',
                templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Signup'
                }
            })
    }

}());
 
