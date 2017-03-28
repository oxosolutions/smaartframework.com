(function ()
{
    'use strict';

    angular
        .module('app.login.edit-profile')
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
        .controller('EditProfileController', EditProfileController);

    /** @ngInject */
    function EditProfileController($scope, api, $state, $mdToast){
        if(checkAuth($state) == false){
            return false;
        }
        var vm = this;
        api.profile.details.get({},function(res){
            $scope.userProfile = res.details;
            // console.log(res.details);
            $scope.org = res.details.organization;
            // console.log(res.details.organization.id);
            var userDet = res.details;
        });
         api.organization.list.get({},function(res){
            
             // console.log(res.records);
             $scope.orgs = res.records;
             
         });



                $scope.single = function(image) {
                    
                    // var formData = new FormData();
                    // formData.append('image', image, image.name);
                    // $http.post('upload', formData, {
                    //     headers: { 'Content-Type': false },
                    //     transformRequest: angular.identity
                    // }).success(function(result) {
                    //     $scope.uploadedImgSrc = result.src;
                    //     $scope.sizeInBytes = result.size;
                    // });
                };
            

        $scope.updateProfile = function(){
           
            var formData = new FormData();
            formData.append('name',$scope.vm.name);
            formData.append('phone',$scope.userProfile.phone);
            formData.append('app_pass',$scope.userProfile.app_pass);
            try{
                formData.append('new_img',$scope.$$childTail.files[0].lfFile);
            }catch(e){

            }
            formData.append('address',$scope.userProfile.address);
            formData.append('organization',$scope.vm.Organization);
            api.postMethod.saveProfile(formData).then(function(res){
                if(res.data.status == 'success'){
                    $mdToast.show(
                     $mdToast.simple()
                        .textContent('Profile Update Successfully!')
                        .position('top right')
                        .hideDelay(5000)
                    );
                    // $state.go('app.profile');
                    $state.go($state.current, {}, {reload: true});
                }
            });
        }

        $scope.goBack = function(){
            
            $state.go('app.profile');
        }
        $scope.triggerUpload=function()
        { 
            var fileuploader = angular.element("#fileInput");
             fileuploader.on('click',function(){
             console.log("File upload triggered programatically");
             })
                fileuploader.trigger('click')
        }


    }

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

  

})();
