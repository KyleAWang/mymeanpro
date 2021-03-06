/**
 * Created by Kyle on 6/14/2016.
 */
(function () {
    'use strict';
    angular.module('users.services')
        .factory('PasswordValidator', PasswordValidator);
    PasswordValidator.$inject = ['$window'];
    
    function PasswordValidator($window) {
        var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;
        
        var service = {
            getResult: getResult,
            getPopoverMsg: getPopoverMsg
        }
        return service;
        
        function getResult(password) {
            var result = owaspPasswordStrengthTest.test(password);
            return result;
        }
        function getPopoverMsg() {
            var popoverMsg = 'Please enter a passphrase or password with 10 or more characters, numbers, lowercase, uppercase, and special characters.';
            return popoverMsg;
        }
    }
}());
 
