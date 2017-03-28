(function ()
{
    'use strict';

    angular
        .module('app.visualizations.add', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.visualizations_add', {
            url    : '/visualizations/add',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/visualizations/add/add.html',
                    controller : 'AddVisualizationsController as vm'
                }
            }
        });

    }

})();