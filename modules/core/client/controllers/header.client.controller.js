/**
 * Created by Kyle on 6/14/2016.
 */
(function () {
    'use strict';
    angular
        .module('core')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

    function HeaderController($scope, $state, Authenticatoin, menuService) {
        var vm = this;
        vm.isCollapsed = false;
        vm.authentication = Authenticatoin;
        vm.accountMenu = menuService.getMenu('account').items[0];

        $scope.$on('$stateChangeSuccess', stateChangeSuccess);

        function stateChangeSuccess() {
            // Collapsing the menu after navigation
            vm.isCollapsed = false;
        }
    }

}());
 
