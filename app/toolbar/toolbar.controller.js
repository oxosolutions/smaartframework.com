(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($scope,$rootScope, $q, $state, $timeout, $mdSidenav, $translate, $mdToast, msNavigationService,api)
    {
        
        var vm = this;
        vm.bodyEl = angular.element('body');
        $scope.isLogined = false;
        if(sessionStorage.api_token != '' && sessionStorage.api_token != undefined){
            
            $scope.isLogined = true;
            api.profile.details.get(function(res){
                $scope.details = res.details;
            });
        }
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleSidenav = toggleSidenav;

        // var vm = this;
        // vm.bodyEl = angular.element('body');
        // $scope.isLogined = false;
        // if(sessionStorage.api_token != '' && sessionStorage.api_token != undefined){
            
        //     $scope.isLogined = true;
        //     $scope.userName = sessionStorage.userName;
        //     $scope.profile_pic = sessionStorage.profile_pic;
        // }
        // vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        // vm.toggleSidenav = toggleSidenav;
        
        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
        function toggleSidenav(sidenavId){

            $mdSidenav(sidenavId).toggle();
        }



        
    }

})();