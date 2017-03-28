(function ()
{
    'use strict';

    angular
        .module('app.survey', ['app.survey.list','app.survey.add','app.survey.addQuestion','app.survey.edit','app.survey.view','ui.bootstrap.contextMenu','app.survey.preview'])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider )
    {
        // $stateProvider.state('app.survey', {
        //     url    : '/survey',
        //     views  : {

        //         'content@app': {
        //             templateUrl: 'app/main/survey/survey.html',
        //             controller : 'SurveyController as vm'
        //         }
        //     }
        // });
        
          if(sessionStorage.api_token != undefined && sessionStorage.api_token != ''){
                  msNavigationServiceProvider.saveItem('survey', {
                            title : 'Survey',
                            group : true,
                            // state : 'app.dashboardfront',
                            cache: false,
                            weight: 2
                        });
                  msNavigationServiceProvider.saveItem('survey.list', {
                            title : 'All Survey',
                            icon  : 'icon-content-paste',
                            state : 'app.survey_list',
                            cache: false,
                           
                        });
                  msNavigationServiceProvider.saveItem('survey.add', {
                            title : 'Add Survey',
                            icon  : 'icon-plus',
                            state : 'app.survey_add',
                            cache: false,
                           
                        });
        }
        

     

    }

})();
