(function ()
{
    'use strict';

    angular
        .module('app.page', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
    {
        $stateProvider.state('app.page', {
            url    : '/page/:slug',
            views  : {
              
                'content@app': {
                    templateUrl: 'app/main/page/page.html',
                    controller : 'PageController as vm'
                }
            }
        });
    }

})();
