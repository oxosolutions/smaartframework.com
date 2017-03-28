(function ()
{
    'use strict';

    angular
        .module('app.survey.add', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider ,msApiProvider)
    {
        $stateProvider.state('app.survey_add', {
            url    : '/survey/add',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/survey/add/add.html',
                    controller : 'AddSurveyController as vm'
                }
            }
        });

     

     

    }

})();
