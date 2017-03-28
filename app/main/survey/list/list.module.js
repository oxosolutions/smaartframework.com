(function ()
{
    'use strict';

    angular
        .module('app.survey.list', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider )
    {
        $stateProvider.state('app.survey_list', {
            url    : '/survey/list',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/survey/list/list.html',
                    controller : 'ListSurveyController as vm'
                }
            }
        });

     

     

    }

})();
