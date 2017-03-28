(function ()
{
    'use strict';

    angular
        .module('app.survey.view', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider )
    {
        $stateProvider.state('app.survey_view', {
            url    : '/survey/view/:id',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/survey/view/view.html',
                    controller : 'ViewSurveyController as vm'
                }
            }
        });

     

     

    }

})();
