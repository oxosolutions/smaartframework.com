(function ()
{
    'use strict';

    angular
        .module('app.survey.addQuestion', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider )
    {
        $stateProvider.state('app.survey_addQuestion', {
            url    : '/survey/addQuestion/:id',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/survey/addQuestion/addQuestion.html',
                    controller : 'AddQuestionSurveyController as vm'
                }
            }
        });

     

     

    }

})();
