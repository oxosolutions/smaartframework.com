(function ()
{
    'use strict';

    angular
        .module('app.login.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope, api, $state)
    {
        if(checkAuth($state) == false){
            return false;
        }
        var vm = this;
        api.profile.details.get({},function(res){
            
            console.log(res);
            $scope.userProfile = res.details;
          

        });
         api.organization.list.get({},function(res){
            
            
             $scope.orgs = res.records;
             
         });

        $scope.editProfile = function(){
            $state.go('app.edit-profile');
        }
    }

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

})();
