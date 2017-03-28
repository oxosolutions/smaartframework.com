(function ()
{
    'use strict';

    angular
        .module('app.dataset.list-dataset', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.dataset_list', {
            url    : '/dataset/list',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/list-dataset/list-dataset.html',
                    controller : 'ListDatasetController as vm'
                }
            }
        });
    }

})();