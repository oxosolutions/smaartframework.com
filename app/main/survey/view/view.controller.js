(function ()
{
    'use strict';

    angular
        .module('app.survey.view')
        .controller('ViewSurveyController', ViewSurveyController);

    /** @ngInject */
    function ViewSurveyController($scope,api, $mdDialog,$state)
    {
    	$scope.settings = {

          	stretchH: 'all',
          	contextMenu: false,
          	colHeaders: true,
          	formulas: true,
          	readOnly: true
      	}
        api.survey.getSurveyDataById.get({id: $state.params.id},function(res){
        	$scope.items = res.data;
        });
    }
        
})();
