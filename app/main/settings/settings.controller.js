(function ()
{
    'use strict';

    angular
        .module('app.settings')
        .controller('SettingsController', SettingsController);

    /** @ngInject */
    function SettingsController($scope, api, $mdToast){
      	
      	var checkedArray = {};
      	api.getUserSettings.settings.get({},function(res){
          try{
              var checked = JSON.parse(res.response.value);
              angular.forEach(checked, function(v,k){
                checkedArray[k] = v;
              });
          }catch(e){

          }
      		
      	});
      	$scope.user = checkedArray;

      	$scope.saveSettings = function(user){

      		var formData = new FormData();
      		formData.append('user_settings',JSON.stringify(user));
      		api.postMethod.saveUserSettings(formData).then(function(res){
      			$mdToast.show(
			             $mdToast.simple()
			                .textContent('Settings Saved Successfully!')
			                .position('top right')
			                .hideDelay(4000)
			            );
      		})
      	}
    }
})();



