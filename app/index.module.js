(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Common 3rd Party Dependencies
            'uiGmapgoogle-maps',
            'textAngular',
            'xeditable',
            'angAccordion',

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            

            // Apps
            //'app.dashboards',
            

			// Dataset
            'app.dataset',


            //Login
            'app.login',
            'app.login.forgot-password',
            'app.login.new-login',
            'app.login.edit-profile',

            //Register
            'app.register',

            //initiatives
            //'app.initiatives',

            'app.visualizations',
            

            'app.page',

            'app.dashboard',
            'app.dashboardfront',
            'app.survey',
            'app.settings',
            'app.embed'
            

        ]);
})();
