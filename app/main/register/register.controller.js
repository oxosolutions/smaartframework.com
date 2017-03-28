(function ()
{
    'use strict';

    angular
        .module('app.register')
        .directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };
            return {
                link: fn_link
            }
        } ])
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($scope,api,$state, $mdToast){
         /*if(checkLogined($state) == false){
             return false;
         }*/
         var vm = this;
         $scope.isVisible = false;
         $scope.serverError = false;
         $scope.isDisabled = false;
        
         api.organization.list.get({},function(res){
            
             // console.log(res.records);
             $scope.orgs = res.records;
             
         });
         var sendData = new FormData();
         $scope.other_org = false;
         $('.org').change(function(){
            if($(this).val() == 'others'){
                $scope.other_org = true;
            }else{
                $scope.other_org = false;
            }
         });
         $scope.userRegister = function(){
         	 
             
             
             $scope.serverErrorMessage = '';
             $scope.isLoading = true;
             $scope.isDisabled = true;
             
             if($scope.files.length == 0){
                sendData.append('profile_pic','');   
             }else{
                sendData.append('profile_pic',$scope.files[0].lfFile);
             }
             //console.log(sendData.get('profile_pic'));
             sendData.append('name',vm.loginForm.name);
             sendData.append('email',vm.loginForm.email);
             sendData.append('password',vm.loginForm.password);
             sendData.append('departments',vm.loginForm.departmentsList);
             sendData.append('designation',vm.loginForm.designationList);
             sendData.append('organization',vm.loginForm.ministryList);
             sendData.append('phone',vm.loginForm.phone);
             sendData.append('address',vm.loginForm.address);
             sendData.append('organization_name',vm.loginForm.other_org);
             api.postMethod.registerUser(sendData).then(function(res){
                 //console.log(res);
                 if(res.data.status == 'successful'){
                     $scope.isLoading = false;
                     $scope.isDisabled = false;
                     //sessionStorage.api_token = res.data.token;
                     $mdToast.show(
                      $mdToast.simple()
                         .textContent('Registered Successfully!')
                         .position('top right')
                         .hideDelay(5000)
                     );
                     $state.go('app.page',{'slug':'register_success'});
                 }else{
                     $scope.serverError = true;
                     $scope.isDisabled = false;
                     $scope.isLoading = false;
                     $scope.serverErrorMessage = res.data.message;
                 }
             });
         }

        /*$scope.goHome = function(){
            $state.go('app.goal_list');
        }*/
    }

    function checkLogined($state){
        if(sessionStorage.api_token != ''){

            $state.go('app.profile');
            return false;
        }
    }

})();
