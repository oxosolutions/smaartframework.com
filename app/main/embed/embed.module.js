(function ()
{
    'use strict';

    angular
        .module('app.embed', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.embed', {
            url    : '/embed/:id',
            views  : {

                'main@'  : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },

                'content@app.embed': {
                    templateUrl: 'app/main/embed/embed.html',
                    controller : 'EmbedController as vm'
                }
            }
        });

      

     

    }

})();
