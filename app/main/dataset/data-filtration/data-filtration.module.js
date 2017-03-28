(function ()
{
    'use strict';

    angular
        .module('app.dataset.data-filtration', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.data_filtration', {
            url    : '/dataset/filter/:id/:wizard',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/data-filtration/data-filtration.html',
                    controller : 'DataFiltrationController as vm'
                }
            }
        });

    }

})();
