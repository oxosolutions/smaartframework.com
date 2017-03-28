(function ()
{
    'use strict';

    angular
        .module('app.login.new-login')
        .controller('NewLoginController', NewLoginController);

    /** @ngInject */
    function NewLoginController(api, $http, $scope, $state, $location){
        /*if(checkLogined($state) == false){
            return false;
        }*/
        $scope.isLoading = false;
    	 if($state.current.name == 'app.logout'){
            sessionStorage.api_token = '';
            window.location.href= 'login';
          }
    	$scope.user_error = 'true';
    	var vm = this;
    	var SendData = new FormData();
    	$scope.userLogin = function(){
            $scope.isLoading = true;
            $scope.loginForm.$invalid = true;
    		SendData.append('email',vm.form.email);
    		SendData.append('password',vm.form.password);
	    	api.postMethod.userLogin(SendData).then(function(res){
                $scope.isLoading = false;
                $scope.loginForm.$invalid = false;
	    		if(res.data.status == 'error'){
	    			vm.user_error = 'false';
	    			$scope.error_user_login = res.data.message;
	    		}else{
                    sessionStorage.userName = res.data.user_detail.name;
                    sessionStorage.profile_pic = res.data.profile_pic;
	    			sessionStorage.api_token = res.data.user_detail.api_token;
                    window.location.href='dashboard';
	    			//$state.go('app.goal_list',{}, {reload: true});
	    		}
	    	});
    	}
    	 $scope.goHome = function(){
            $state.go('app.page',{'slug':'dashboard'});
        }

    }

    function checkLogined($state){
        if(sessionStorage.api_token != ''){

            $state.go('app.profile');
            return false;
        }
    }

})();
