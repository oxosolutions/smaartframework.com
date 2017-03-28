(function ()
{
    'use strict';

    angular
        .module('app.dashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider,msNavigationServiceProvider)
    {
        $stateProvider.state('app.dashboard', {
            url    : '/users',
            views  : {
              
                'content@app': {
                    templateUrl: 'app/main/dashboard/dashboard.html',
                    controller : 'DashboardController as vm'
                }
            }
        });

         if(sessionStorage.api_token != undefined && sessionStorage.api_token != ''){

             msNavigationServiceProvider.saveItem('manageUser', {
                title : 'Manage Users',
                group : true,
                // state : 'app.genvisuals_list',
                cache: false,
                weight: 29
            });

            msNavigationServiceProvider.saveItem('manageUser.manageUser', {
                title : 'User List',
                icon  : 'icon-account-multiple',
                state : 'app.dashboard',
                cache: false,
            });
        }
    }

})();
