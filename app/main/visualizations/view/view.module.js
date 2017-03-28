(function ()
{
    'use strict';

    angular
        .module('app.visualizations.view', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.visualizations_view', {
            url    : '/visualizations/view/:id/:dataset/:static',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/visualizations/view/view.html',
                    controller : 'ViewVisualizationsController as vm'
                }
            }

        });

    }

})();