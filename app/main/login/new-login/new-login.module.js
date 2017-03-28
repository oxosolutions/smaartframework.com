(function ()
{
    'use strict';

    angular
        .module('app.login.new-login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.new-login', {
            url      : '/login',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/login/new-login/new-login.html',
                    controller : 'NewLoginController as vm'
                }
            },
           
        });

    }

})();
