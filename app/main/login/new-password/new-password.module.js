(function ()
{
    'use strict';

    angular
        .module('app.login.new-password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.new_password', {
            url      : '/newPassword/:token',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/login/new-password/new-password.html',
                    controller : 'NewPasswordController as vm'
                }
            },
           /* resolve  : {
                Timeline    : function (msApi)
                {
                    return msApi.resolve('profile.timeline@get');
                },
                About       : function (msApi)
                {
                    return msApi.resolve('profile.about@get');
                },
                PhotosVideos: function (msApi)
                {
                    return msApi.resolve('profile.photosVideos@get');
                }
            },
            bodyClass: 'profile'*/
        });

        // Translation
       /* $translatePartialLoaderProvider.addPart('app/main/pages/profile');

        // Api
        msApiProvider.register('profile.timeline', ['app/data/profile/timeline.json']);
        msApiProvider.register('profile.about', ['app/data/profile/about.json']);
        msApiProvider.register('profile.photosVideos', ['app/data/profile/photos-videos.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('pages.profile', {
            title : 'Profile',
            icon  : 'icon-account',
            state : 'app.pages_profile',
            weight: 6
        });*/
    }

})();