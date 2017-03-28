(function ()
{
    'use strict';

    angular
        .module('app.survey.list')
        .controller('ListSurveyController', ListSurveyController);

    /** @ngInject */
    function ListSurveyController($scope,api, $mdDialog,$state)
    {
    	api.survey.surveyList.get(function(res){
    		// console.log(res.response);
    		$scope.surveyList = res.response;
    	});

        //change status
        $scope.changeStatus = function(id) {
            api.survey.changeStatus.get({'id':id});
            $state.go($state.current , {} , {reload : true});

        }
        $scope.surveyEditList = function(id) {
            
            $scope.data = api.survey.surveyEditList.get();
            console.log($scope.data);
        }

        $scope.generateEmbed = function(surveyId){
            var formData = new FormData();
            formData.append('survey_id',surveyId);
            api.postMethod.generateSurveyEmbed(formData).then(function(res){
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,        
                    preserveScope: true,           
                    templateUrl: 'app/main/survey/list/include/embed-dialog.html',
                    controller: function DialogController($scope, $mdDialog, api) {
                      $scope.embedSrc = api.surveyEmbed+'s/'+res.data.token;
                      $scope.closeMe = function() {
                        $mdDialog.hide();
                      }
                    }
                });
            });
        }
        //delete survey
       $scope.deleteSurvey = function(id,ev){

          var confirm = $mdDialog.confirm({
            onComplete: function afterShowAnimation() {
                var $dialog = angular.element(document.querySelector('md-dialog'));
                var $actionsSection = $dialog.find('md-dialog-actions');
                var $cancelButton = $actionsSection.children()[0];
                var $confirmButton = $actionsSection.children()[1];
                angular.element($confirmButton).addClass('md-raised md-warn ph-15');
                angular.element($cancelButton).addClass('md-raised ph-15');
            }
                
            })
                .title('Would you like to delete this survey?')
                .textContent('The survey will be deleted permanently and no longer accesible by any user.')
                .ariaLabel('Delete survey')
                .targetEvent(ev)
                .ok('Delete it')
                .cancel('Don\'t delete');

            $mdDialog.show(confirm).then(function() {
                api.survey.delSurveyById.get({'id':id}, function(res){
                    $state.go($state.current , {} , {reload : true});
                });

              // $scope.status = 'You decided to get rid of your debt.';
            }, function() {
              $scope.status = 'You decided to keep your debt.';
            });
      }
        
    }
})();
