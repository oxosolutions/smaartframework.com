(function ()
{
    'use strict';

    angular
        .module('app.login.new-password')
        .controller('NewPasswordController', NewPasswordController);

    /** @ngInject */
    function NewPasswordController($state, $scope, api){

        var vm = this;
        $scope.isDisables = false;
        api.forgetPass.validate.get({token:$state.params.token},function(res){
            if(res.status == 'error'){
                $state.go('app.page',{slug:'access-denied'});
            }
        });

        $scope.proceed = function(){

            $scope.isLoading = true;
            $scope.isDisables = true;
            var formdata = new FormData();
            formdata.append('reset_token', $state.params.token);
            formdata.append('newpassword', vm.newPasswordForm.password);
            formdata.append('confpassword', vm.newPasswordForm.confpassword);
            api.postMethod.resetPass(formdata).then(function(res){
                $scope.isLoading = false;
                $scope.isDisables = false;
                if(res.data.status == 'success'){
                    $state.go('app.page',{slug:'changepass-success'})
                }else{
                    $scope.error_message = res.data.message;
                }
            });
        }
    }


})();
