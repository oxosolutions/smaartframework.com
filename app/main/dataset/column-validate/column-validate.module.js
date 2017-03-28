(function ()
{
    'use strict';

    angular
        .module('app.dataset.column-validate', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.column_validate', {
            url    : '/column/validate/:id/:wizard',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/dataset/column-validate/column-validate.html',
                    controller : 'ColumnValidateController as vm'
                }
            },
        });


    }

})();
