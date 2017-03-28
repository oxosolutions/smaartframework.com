(function ()
{
    'use strict';

    angular
        .module('app.login.change-password')
        .controller('ChangePassController', ChangePassController);

    /** @ngInject */
    function ChangePassController($scope, $state, api, $mdToast){
        if(checkAuth($state) == false){
            return false;
        }
        var vm = this;
        $scope.isLoading = false;
        $scope.server_message = ' ';
        $scope.updateNewPass = function(){
            $('.changePass').prop('disabled',true);
            $scope.isLoading = true;
            var formData = new FormData();
            formData.append('old_pass',vm.changePass.oldpass);
            formData.append('new_pass',vm.changePass.newpassword);
            formData.append('conf_pass',vm.changePass.passwordConfirm);
            api.postMethod.changePassword(formData).then(function(res){

                if(res.data.status == 'error'){
                    $scope.isLoading = false;
                    $scope.server_message = res.data.message;
                    $('.changePass').prop('disabled',false);
                }else{
                    $scope.isLoading = false;
                    $mdToast.show(
                     $mdToast.simple()
                        .textContent('Password Chnaged Successfully!')
                        .position('top right')
                        .hideDelay(5000)
                    );
                    $('.changePass').prop('disabled',false);
                    $state.go('app.profile');
                }
            });
        }
    }

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

})();
