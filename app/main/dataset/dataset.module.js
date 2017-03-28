(function ()
{
    'use strict';

    angular
        .module('app.dataset', [
			'app.dataset.list-dataset',
            'app.dataset.create-dataset',
			//'app.dataset.add-dataset',
			'app.dataset.edit-dataset',
			'app.dataset.view-dataset',
			'app.dataset.import-dataset',
			'app.dataset.export-dataset',
			'app.dataset.column-validate',
            'app.dataset.validate-dataset',
            'ngHandsontable',
            'app.dataset.data-filtration',
            'lfNgMdFileInput'
        ])
        .config(config);

    
    /** @ngInject */
    function config(msNavigationServiceProvider)
    {  
        
        if(sessionStorage.api_token != undefined && sessionStorage.api_token != ''){
                // Navigation
                msNavigationServiceProvider.saveItem('dataset', {
                    title : 'Datasets',
                    group : true,
                    // state : 'app.dataset_list',
                    weight: 10
                });

                msNavigationServiceProvider.saveItem('dataset.list-dataset', {
                    title : 'All Datasets',
                    icon  : 'icon-format-list-bulleted',
                    state : 'app.dataset_list',
                });
                msNavigationServiceProvider.saveItem('dataset.create-dataset', {
                    title : 'Create Dataset',
                    icon  : 'icon-grid',
                    state : 'app.dataset_create',
                });

                /*

                msNavigationServiceProvider.saveItem('dataset.add-dataset', {
                    title : 'Add New Dataset',
                    icon  : 'icon-plus',
                    state : 'app.dataset_add',
                });


                msNavigationServiceProvider.saveItem('dataset.view-dataset', {
                    title : 'View Dataset',
                    icon  : 'icon-monitor',
                    state : 'app.dataset_view',
                    stateParams: {
                        id: '3'
                    }
                });

                msNavigationServiceProvider.saveItem('dataset.edit-dataset', {
                    title : 'Edit Dataset',
                    icon  : 'icon-pencil',
                    state : 'app.dataset_edit',
                });
                */


                msNavigationServiceProvider.saveItem('dataset.import-dataset', {
                    title : 'Import Dataset',
                    icon  : 'icon-arrow-left',
                    state : 'app.dataset_import',
                });

                
               /* msNavigationServiceProvider.saveItem('dataset.export-dataset', {
                    title : 'Export Dataset',
                    icon  : 'icon-arrow-right',
                    state : 'app.dataset_export',
                });*/
                
                

                msNavigationServiceProvider.saveItem('dataset.wizard', {
                    title : 'Start Wizard',
                    icon  : 'icon-auto-fix',
                    state : 'app.dataset_import_wizard',
                    stateParams: {
                        wizard: 'wizard'
                    }
                });

        }

    }


})();
