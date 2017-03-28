(function ()
{
    'use strict';

    angular
        .module('app.login', ['app.login.profile','app.login.change-password','app.login.forgot-password','app.login.new-login','app.login.edit-profile','app.login.new-password'
           ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider.state('app.login', {
            url      : '/oldlogin',
            views    : {
                'main@'                          : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.login': {
                    templateUrl: 'app/main/login/login.html',
                    controller : 'LoginController as vm'
                }
            },

        });
        $stateProvider.state('app.logout', {
            url      : '/logout',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/login/new-login/new-login.html',
                    controller : 'LoginController as vm'
                }
            },

        });
        if(sessionStorage.api_token != undefined && sessionStorage.api_token != ''){

            // Navigation
         /*   msNavigationServiceProvider.saveItem('profile', {
                title : 'Profile',
                group: true,
                weight: 18,
                state: 'app.profile'
            });
            msNavigationServiceProvider.saveItem('profile.myprofile', {
                title : 'My Profile',
                state: 'app.profile'
            });
            msNavigationServiceProvider.saveItem('profile.changepass', {
                title : 'Change Password',
                state: 'app.change_password'
            });
            msNavigationServiceProvider.saveItem('profile.logout', {
                title : 'Logout',
                state: 'app.logout'
            });*/
        }else{

            // Navigation
            msNavigationServiceProvider.saveItem('login', {
                title : 'Login',
                icon  : 'icon-lock-unlocked',
                weight: 13,
                state: 'app.new-login'
            });
            // Navigation
            msNavigationServiceProvider.saveItem('register', {
                title : 'Register',
                icon  : 'icon-account',
                weight: 14,
                state: 'app.register'
            });
            msNavigationServiceProvider.saveItem('forgot-password', {
                title : 'Forgot Password',
                icon  : 'icon-key-variant',
                weight: 15,
                state: 'app.forgot_password'
            });
        }
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/login');

    }

})();
