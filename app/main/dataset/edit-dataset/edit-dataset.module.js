(function ()
{
    'use strict';

    angular
        .module('app.dataset.edit-dataset', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.dataset_edit', {
            url    : '/dataset/edit/:id',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/edit-dataset/edit-dataset.html',
                    controller : 'EditDatasetController as vm'
                }
            }
        });

    }

})();
