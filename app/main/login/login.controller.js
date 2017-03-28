(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(api, $http, $scope, $state, $location)
    {

        if($state.current.name == 'app.logout'){
            sessionStorage.api_token = '';
            window.location.href= 'login';
        }
    	$scope.user_error = 'true';
    	var vm = this;
    	var SendData = new FormData();
    	$scope.userLogin = function(){

    		SendData.append('email',vm.form.email);
    		SendData.append('password',vm.form.password);
    		$http.defaults.headers.post['Content-Type'] = undefined;
	    	$http({

	    		url: api.localUrl+'auth',
	    		method: 'POST',
	    		data: SendData
	    	}).then(function(res){
	    		if(res.data.status == 'error'){
	    			vm.user_error = 'false';
	    			$scope.error_user_login = res.data.message;
	    		}else{
	    			sessionStorage.api_token = res.data.user_detail.api_token;
                    window.location.href='forgotpass';
	    			//$state.go('app.goal_list',{}, {reload: true});
	    		}
	    	});
    	}

        $scope.goHome = function(){
            $state.go('app.goal_list');
        }


    	//console.log(api_token);

		/*console.log('Test');
    	api.auth.login.get({email: 'test@gmail.com',pass: '123456'},function(res){

    		console.log(res);
    	});*/
    }

})();
