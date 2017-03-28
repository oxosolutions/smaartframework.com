(function ()
{
    'use strict';

    angular
        .module('app.settings', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.settings', {
            url    : '/settings',
            views  : {

                'content@app': {
                    templateUrl: 'app/main/settings/settings.html',
                    controller : 'SettingsController as vm'
                }
            }
        });

      

     

    }

})();
