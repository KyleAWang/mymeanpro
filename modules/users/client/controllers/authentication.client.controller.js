/**
 * Created by Kyle on 6/14/2016.
 */
(function () {
    'use strict';

    angular
        .module('users')
        .controller('AuthenticationController', AuthenticationController);

    AuthenticationController.$inject = ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator'];

    function AuthenticationController($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
        var vm = this;
        vm.authentication = Authentication;
        vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
        vm.signin = signin;
        vm.signup = signup;

        vm.error = $location.search().err;
        
        function signup(isValid) {
            vm.error = null;
            
            if (!isValid){
                $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
                
                return false;
            }
            
            $http.post('/api/auth/signup', vm.credentials).success(function (response) {
                vm.authentication.user = response;

                $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function (response) {
                vm.error = response.message;
            });
        }

        function signin(isValid) {
            vm.error = null;
            if (!isValid){
                $scope.$broadcast('show-errors-check-validty', 'vm.userForm');
                return false;
            }
            
            $http.post('/api/auth/signin', vm.credentials).success(function (response) {
                vm.authentication.user = response;
                $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function (response) {
                vm.error = response.message;
            })
        }
    }
}());
 
