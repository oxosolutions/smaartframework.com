(function ()
{
    'use strict';

    angular
        .module('app.dataset.view-dataset', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.dataset_view', {
            url    : '/dataset/view/:id',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/view-dataset/view-dataset.html',
                    controller : 'ViewDatasetController as vm'
                }
            }
        });

    }

})();
