(function ()
{
    'use strict';

    angular
        .module('app.dataset.validate-dataset', ['datatables'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.validate', {
            url    : '/dataset/validate/:id',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/validate-dataset/validate-dataset.html',
                    controller : 'ValidateDatasetController as vm'
                }
            }
        });

    }

})();
