(function ()
{
    'use strict';

    angular
        .module('app.dashboardfront')
        .controller('DashboardfrontController', DashboardfrontController);

    /** @ngInject */
    function DashboardfrontController($scope, $state, api,$mdToast)
    {
        if(sessionStorage.api_token != undefined && sessionStorage.api_token != ''){
            $scope.dashboard = true;
            $scope.loginLinks = false;
        	api.dashboard.getDetails.get({}, function(res){
        		
                api.getUserSettings.settings.get({}, function(resDet){
                    $scope.DatasetsCount = res.dataset_count;
                    $scope.DatasetsList = res.dataset_list;
                   /* console.log(res.dataset_list);*/
                    $scope.VizCount = res.visual_count;
                    $scope.VizList = res.visual_list;
                     // console.log(res);
                    $scope.surveyCount = res.survey_count;
                    $scope.surveyList = res.survey_list;

                    $scope.organization_detail = res.organization_detail;
                    // console.log(res);
                    $scope.profilePic = res.user_meta.profile_pic;
                    
                    $scope.userProfile = res.user_profile;
                    
                    $scope.userCount = res.user_count;
                     // console.log(res.user_list);
                    $scope.userList = res.user_list;

                    try{
                        //Show Hide Settings
                        angular.forEach(JSON.parse(resDet.response.value), function(v,k){
                            $scope[k] = v;
                        });
                    }catch(e){

                    }
                    
                    $scope.twt = true;
                });

        	});
        }else{
            $scope.dashboard = false;
            $scope.loginLinks = true;
        }

        $scope.allViz = function(){
            $state.go('app.genvisuals_list');
        }
        
         $scope.unapprove = function(id,ind){
            $('.loader_'+ind).show();
            api.userAction.unapprove.get({
                'id': id
            },function(res){
                if(res.status == 'success'){
                    $mdToast.show(
                       $mdToast.simple()
                        .textContent('User disapproved successfully!')
                        .position('top right')
                        .hideDelay(5000)
                    );
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }
            });
        }

        $scope.approve = function(id,ind){
            $('.loader_'+ind).show();
            api.userAction.approve.get({
                'id': id
            },function(res){
                if(res.status == 'success'){
                    $mdToast.show(
                       $mdToast.simple()
                        .textContent('User approved successfully!')
                        .position('top right')
                        .hideDelay(5000)
                    );
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }
            });
        }
        $scope.visitSettings = function(){
            $state.go('app.settings');
        }
    }
})();



