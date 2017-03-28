(function ()
{
    'use strict';

    angular
        .module('app.dataset.add-dataset', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.dataset_add', {
            url    : '/dataset/add',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/add-dataset/add-dataset.html',
                    controller : 'AddDatasetController as vm'
                }
            }
        });

        
    }

})();