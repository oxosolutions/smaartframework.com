(function ()
{
    'use strict';

    angular
        .module('app.dataset.create-dataset', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.dataset_create', {
            url    : '/dataset/create',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/create-dataset/create-dataset.html',
                    controller : 'CreateDatasetController as vm'
                }
            }
        });

    }

})();