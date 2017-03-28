(function ()
{
    'use strict';

    angular
        .module('app.visualizations.list', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.visualizations_list', {
            url    : '/visualizations/list',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/visualizations/list/list.html',
                    controller : 'ListVisualizationsController as vm'
                }
            }
        });

    }

})();