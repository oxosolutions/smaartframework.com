(function ()
{
    'use strict';

    angular
        .module('app.login.forgot-password')
        .controller('ForgotPassController', ForgotPassController);

    /** @ngInject */
    function ForgotPassController($state, $scope, api){

        var vm = this;
        $scope.isLoading = false;
        $scope.isDisabled = false;
        $scope.getNewPass = function(){
            $scope.error_message = '';
            $scope.isLoading = true;
            $scope.resetPasswordForm.$invalid = true;
            var formData = new FormData();
            formData.append('email_id',vm.email);
            api.postMethod.forgetPass(formData).then(function(res){
                $scope.isLoading = false;
                $scope.resetPasswordForm.$invalid = false;
                if(res.data.status == 'success'){
                    $state.go('app.page',{slug:'forgot_email_sent'});
                }else{
                    $scope.error_message = res.data.message;
                }
            });
        }

        $scope.back = function(){
            window.history.back();
            console.log(window.history);
        }
    }


})();