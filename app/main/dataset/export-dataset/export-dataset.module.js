(function ()
{
    'use strict';

    angular
        .module('app.dataset.export-dataset', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.dataset_export', {
            url    : '/dataset/export',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/export-dataset/export-dataset.html',
                    controller : 'ExportDatasetController as vm'
                }
            },
        });
    }

})();
