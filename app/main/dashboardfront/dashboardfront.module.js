(function ()
{
    'use strict';

    angular
        .module('app.dashboardfront', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider,msNavigationServiceProvider )
    {
        $stateProvider.state('app.dashboardfront', {
            url    : '/dashboard',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/dashboardfront/dashboardfront.html',
                    controller : 'DashboardfrontController as vm'
                }
            }
        });

      msNavigationServiceProvider.saveItem('dashboardfront', {
                title : 'Dashboard',
                group : true,
                // state : 'app.dashboardfront',
                cache: false,
                weight: 1
            });
      msNavigationServiceProvider.saveItem('dashboardfront.dashboard', {
                title : 'Dashboard',
                icon  : 'icon-camera-timer',
                state : 'app.dashboardfront',
                cache: false,
               
            });

     

    }

})();
