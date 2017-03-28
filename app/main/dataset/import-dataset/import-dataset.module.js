(function ()
{
    'use strict';

    angular
        .module('app.dataset.import-dataset', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.dataset_import', {
            url    : '/dataset/import',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/import-dataset/import-dataset.html',
                    controller : 'ImportDatasetController as vm'
                }
            }
        });
        $stateProvider.state('app.dataset_import_wizard', {
            url    : '/dataset/import/:wizard',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/import-dataset/import-dataset.html',
                    controller : 'ImportDatasetController as vm'
                }
            }
        });

    }

})();