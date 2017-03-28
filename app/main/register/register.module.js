(function ()
{
    'use strict';

    angular
        .module('app.register', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
    {
        $stateProvider.state('app.register', {
            url    : '/register',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/register/register.html',
                    controller : 'RegisterController as vm'
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/register');

    }

})();
