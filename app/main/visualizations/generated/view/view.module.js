(function ()
{
    'use strict';

    angular
        .module('app.genvisuals.view', ['svgMaps'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        $stateProvider.state('app.genvisual_view', {
            url    : '/visual/view/:id',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/visualizations/generated/view/view.html',
                    controller : 'ViewVisualController as vm'
                }
            }

        });

    }

})();