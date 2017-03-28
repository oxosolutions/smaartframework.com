(function ()
{
    'use strict';

    angular
        .module('app.survey.preview')
        .controller('PreviewSurveyController', PreviewSurveyController);

    /** @ngInject */
    function PreviewSurveyController($scope, api,$state)
    {
        var formData = new FormData();
        formData.append('survey_id',$state.params.id);
        api.postMethod.generateSurveyEmbed(formData).then(function(res){
        	//$scope.frame_url = api.surveyEmbed+'s/'+res.data.token;
        	$('.content').html('<iframe src="'+api.surveyEmbed+'s/'+res.data.token+'/1" width="100%" style="border:none;" height="1000px"></iframe>');
        	console.log(api.surveyEmbed+'s/'+res.data.token);
            /*$mdDialog.show({
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
            });*/
        });
    }
        
})();

