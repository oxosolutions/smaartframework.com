(function ()
{
    'use strict';

    angular
        .module('app.visualizations', [
			'app.visualizations.list',
            'app.visualizations.view',
            'app.visualizations.add',
            'app.genvisuals.edit',
            'app.genvisuals.list',
            'app.genvisuals.view',
            'rzModule',
            'ui.select2'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        if(sessionStorage.api_token != undefined && sessionStorage.api_token != ''){
            // Navigation
            msNavigationServiceProvider.saveItem('visualizations', {
                title : 'Visualizations',
                group : true,
    			// state : 'app.genvisuals_list',
                cache: false,
                weight: 12
            });

            msNavigationServiceProvider.saveItem('visualizations.generated', {
                title : 'All Visualizations',
                icon  : 'icon-chart-bar',
                state : 'app.genvisuals_list',
                cache: false,
            });

            /*

            msNavigationServiceProvider.saveItem('visualizations.list', {
                title : 'All Visualizations',
                icon  : 'icon-grid',
                state : 'app.visualizations_list',
                cache: false,
            });
            */
    		
         /*   msNavigationServiceProvider.saveItem('visualizations.view', {
                title : 'View Visualization',
                icon  : 'icon-monitor',
                state : 'app.visualizations_view',
                cache: false,
                stateParams: {
                    id: '1',
                    dataset:'9'
                }
            });*/
            msNavigationServiceProvider.saveItem('visualizations.add', {
                title : 'Add Visualization',
                icon  : 'icon-plus',
    			state : 'app.visualizations_add',
                cache: false,
                stateParams: {
                    dataset:''
                }
            });
            /* msNavigationServiceProvider.saveItem('visualizations.edit', {
                title : 'Edit Visualization',
                icon  : 'icon-pencil',
                state : 'app.visualizations_edit',
                cache: false
            });*/

        }

		
		
		
    }
})();