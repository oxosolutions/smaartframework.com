(function ()
{
    'use strict';

    angular
        .module('app.survey.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider )
    {
        $stateProvider.state('app.survey_edit', {
            url    : '/survey/edit/:id',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/survey/edit/edit.html',
                    controller : 'EditSurveyController as vm'
                }
            }
        });

     

     

    }

})();
