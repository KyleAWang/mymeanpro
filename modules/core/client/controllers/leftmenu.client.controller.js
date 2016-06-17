/**
 * Created by Kyle on 6/17/2016.
 */
(function () {
    'use strict';
    angular.module('core')
        .controller('LeftmenuController', LeftmenuController);


    function LeftmenuController() {
        var vm = this;
        vm.isClosed = true;
        vm.currentClass = 'is-closed';
        vm.toggled = '';
        vm.toggleClass = function () {
            vm.isClosed = !vm.isClosed;
            if (vm.isClosed){
                vm.currentClass = 'is-closed';
                vm.toggled = '';
            }else{
                vm.currentClass = 'is-open';
                vm.toggled = 'toggled';
            }
        };
        
    }

}());
 
