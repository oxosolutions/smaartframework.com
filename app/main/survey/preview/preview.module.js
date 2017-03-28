(function ()
{
    'use strict';

    angular
        .module('app.survey.preview', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider )
    {
        $stateProvider.state('app.survey_preview', {
            url    : '/survey/preview/:id',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/survey/preview/preview.html',
                    controller : 'PreviewSurveyController as vm'
                }
            }
        });

     

     

    }

})();
