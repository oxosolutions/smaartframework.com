(function() {
    'use strict';

    angular
        .module('fuse')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource, $http) {

        var api = {};

        // Base Url
        // api.baseUrl     =   'http://smaartframework.com/admin/public/api/v1/';
        api.baseUrl = 'http://192.168.0.101/smaartframework.com/smaart-admin/public/api/v1/';
        api.surveyEmbed = 'http://192.168.0.101/smaartframework.com/smaart-admin/public/';
        // api.surveyEmbed = 'http://smaartframework.com/admin/public/';
        api.apiToken = sessionStorage.api_token;
        // api.siteUrl = 'http://smaartframework.com/admin/public/';
        api.siteUrl = 'http://192.168.0.101/smaartframework.com/smaart-admin/public/';
        //survey part
            api.survey = {
                delSurveyById: $resource(api.baseUrl + 'surrvey/del/:id?api_token=' + api.apiToken, {
                    id: '@id'
                }),
                
                changeStatus: $resource(api.baseUrl + 'surrvey/enableDisable/:id?api_token=' + api.apiToken, {
                    id: '@id'
                }),
                surveyList: $resource(api.baseUrl + 'surrvey/list?api_token='+api.apiToken),
                surveyEditList: $resource(api.baseUrl + 'surrvey/edit/:id?api_token='+api.apiToken, {
                    id: '@id'
                }),
                getSurveyDataById: $resource(api.baseUrl + 'view_survey_saved_data/:id?api_token='+api.apiToken,{
                    id: '@id'
                })
                // getSurveyById: $resource(api.baseUrl + 'surrvey/edit/:id?api_token'+api.apiToken,{
                //     id: '@id'
                // }),
            }

        api.dataset = {
            getById: $resource(api.baseUrl + 'dataset/view/:id/:skip?api_token=' + api.apiToken, {
                id: '@id',
                skip: '@skip'
            }),
            getcolumnsById: $resource(api.baseUrl + 'dataset/columns/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            getLastColumns: $resource(api.baseUrl + 'dataset/define/columns/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            deleteDataset: $resource(api.baseUrl + 'dataset/delete/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            exportDataset: $resource(api.baseUrl + 'dataset/export/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),

            /*******/
            get420Columns: $resource(api.baseUrl + 'dataset/static/dataset?api_token=' + api.apiToken),
            /*******/
            downloadDataset: $resource(api.baseUrl + 'export/dataset/:id', {
                id: '@id'
            }),
            columnValidate: $resource(api.baseUrl + 'dataset/validate/columns/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            getByDate: $resource('http://api.example.com/blog/:date', {
                id: '@date'
            }, {
                get: {
                    method: 'GET',
                    params: {
                        getByDate: true
                    }
                }
            })
        };

        api.listdataset = {
            list: $resource(api.baseUrl + 'dataset/list?api_token=' + api.apiToken),
            getById: $resource(api.baseUrl + 'dataset/view/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            getByDate: $resource('http://api.example.com/blog/:date', {
                id: '@date'
            }, {
                get: {
                    method: 'GET',
                    params: {
                        getByDate: true
                    }
                }
            })
        };

        // userRoles
        api.roles = {
            list: $resource(api.baseUrl + 'role/list?api_token=' + api.apiToken),
        };

       
        api.userAction = {
            deleteUser: $resource(api.baseUrl+'deleteUser/:id?api_token='+api.apiToken,{
                id: '@id'
            }),
            unapprove:  $resource(api.baseUrl+'user/unapprove/:id?api_token='+api.apiToken, {
                id: '@id'
            }),
            approve:    $resource(api.baseUrl+'user/approve/:id?api_token='+api.apiToken, {
                id: '@id'
            }),
            editUser:   $resource(api.baseUrl+'editUser/:id?api_token='+api.apiToken, {
                id: '@id'
            }),
        };

        api.dashboard = {
            getDetails: $resource(api.baseUrl+'dashboard?api_token='+api.apiToken)
        };

        api.organization = {
            list: $resource(api.baseUrl + 'organizationList')
           
        };

        


        api.listuser = {
            list: $resource(api.baseUrl + 'userlists?api_token=' + api.apiToken),
            getById: $resource(api.baseUrl + 'dataset/view/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            deleteUser: $resource(api.baseUrl + 'deleteUser/:id?api_token=' + api.apiTOken, {
                id: '@id'
            }),
            getByDate: $resource('http://api.example.com/blog/:date', {
                id: '@date'
            }, {
                get: {
                    method: 'GET',
                    params: {
                        getByDate: true
                    }
                }
            })
        };

        api.auth = {
            login: $resource(api.baseUrl + 'auth', {
                data: '@email',
                password: '@pass'
            }, {
                get: {
                    method: 'POST',
                    params: {
                        getByDate: true
                    }
                }
            })
        };

        api.goals = {
            
            list: $resource(api.baseUrl + 'goals/list', {
                id: '@id'
            }),
            get: {
                method: 'GET'
            }
        };

        api.goaldata = {

            list: $resource(api.baseUrl + 'goalData/:id', {
                id: '@id'
            }),
            get: {
                method: 'GET'
            }
        };

        api.goal = {
            list: $resource(api.baseUrl + 'goals/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            get: {
                method: 'GET'
            }
        };

        api.visualizations = {
            list: $resource(api.baseUrl + 'visual/list?api_token=' + api.apiToken),
            getById: $resource(api.baseUrl + 'visual/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            deleteVisualization: $resource(api.baseUrl + 'visual/delete/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            get: {
                method: 'GET'
            }
        };
        api.visualizationData = {
            list: $resource(api.baseUrl + 'visual/list?api_token=' + api.apiToken),
            getById: $resource(api.baseUrl + 'dataset/chartdata/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            get: {
                method: 'GET'
            }
        };

        api.visual = {
            list: $resource(api.baseUrl + 'generatedVisual/list?api_token=' + api.apiToken),
            getCols: $resource(api.baseUrl +'datsetColumns/:id?api_token=' + api.apiToken, {
                id: '@id'
            }),
            visualDetails: $resource(api.baseUrl +'getVisualdetails/:id?api_token=' + api.apiToken,{
                id: '@id'
            }),
            visualByDatset: $resource(api.baseUrl +'getVisualList/:id?api_token=' + api.apiToken,{
                id: '@id'
            }),
            mapsList: $resource(api.baseUrl+'maps?api_token='+api.apiToken),
            get: {
                method: 'GET'
            }  
        };

        api.pages = {
            pages: $resource(api.baseUrl + 'pages'),
            getBySlug: $resource(api.baseUrl + 'pages/:slug', {
                slug: '@slug'
            }),
            get: {
                method: 'GET'
            }
        };

        api.editQuestions = {
            questions: $resource(api.baseUrl+ 'survey/view/:id?api_token=' + api.apiToken, {
                id: '@id'
            })
        };

        api.profile = {
            details: $resource(api.baseUrl + 'profile?api_token=' + api.apiToken),
            get: {
                method: 'GET'
            }
        };

        api.resources = {
            list: $resource(api.baseUrl + 'resources/list?api_token=' + api.apiToken),
            get: {
                method: 'GET'
            }
        };

        api.getUserSettings = {

            settings: $resource(api.baseUrl+'usersettings/get?api_token='+api.apiToken)
        };

        api.getallFiles = {

            filesList: $resource(api.baseUrl+'sharedFile?api_token='+api.apiToken)
        }

        api.ministries = {
            list: $resource(api.baseUrl + 'profile/ministries'),
            get: {
                method: 'GET'
            }
        };

        api.designation = {
            list: $resource(api.baseUrl + 'designation/list'),
        };

        api.departments = {
            list: $resource(api.baseUrl + 'departments'),
        };

        api.downloadFile = {

            downloadDatasetFile: function(id,type) {
                return api.baseUrl + 'dataset/file/'+id+'/'+type+'?api_token='+api.apiToken;
            }
        };

        api.forgetPass = {
            validate: $resource(api.baseUrl + 'validateForgetToken/:token', {
                token: '@token'
            }),
        };

        api.postMethod = {
            registerUser: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'register',
                    data: formData
                });
            },

            renameDataset: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'datasetname/update?api_token=' + api.apiToken,
                    data: formData
                });
            },

            getVisual: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'singlevisual?api_token=' + api.apiToken,
                    data: formData
                });
            },

            getVisualEmbed: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'singlevisualEmbed?api_token=' + api.apiToken,
                    data: formData
                });
            },

            importDataset: function(formData, $scope) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'dataset/import?api_token=' + api.apiToken,
                    data: formData,
                    uploadEventHandlers: {
                        progress: function(e) {
                            $scope.percent = Math.round((e.loaded / e.total) * 100);
                            // console.log("Current : " + Math.round((e.loaded / e.total) * 100) + '%');

                        }
                    }
                });
            },

            uploadFile: function(formData, $scope){

                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'uplaodFile?api_token=' + api.apiToken,
                    data: formData,
                    uploadEventHandlers: {
                        progress: function(e) {
                            $scope.percent = Math.round((e.loaded / e.total) * 100);
                            // console.log("Current : " + Math.round((e.loaded / e.total) * 100) + '%');

                        }
                    }
                });
            },

            saveDatasetColumns: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'dataset/savevalidatecolumns?api_token=' + api.apiToken,
                    data: formData
                });
            },

            saveNewVisual: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'store/visual?api_token=' + api.apiToken,
                    data: formData
                });
            },

            changePassword: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'profile/changepass?api_token=' + api.apiToken,
                    data: formData
                });
            },

            userLogin: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'auth',
                    data: formData
                });
            },

            saveEditedDatset: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'dataset/saveEditedDatset?api_token=' + api.apiToken,
                    data: formData
                });
            },

            saveSubset: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'dataset/saveSubset?api_token=' + api.apiToken,
                    data: formData
                });
            },

            saveProfile: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'update/profile?api_token=' + api.apiToken,
                    data: formData
                });
            },

            profilePicUpdate: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'update/profilePic?api_token=' + api.apiToken,
                    data: formData
                });
            },

            forgetPass: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'forget',
                    data: formData
                });
            },

            resetPass: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'resetpass',
                    data: formData
                });
            },

            postColumns: function(formData) {
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'dataset/visual/gen?api_token=' + api.apiToken,
                    data: formData
                });
            },

            saveEditUser: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'user/update?api_token=' + api.apiToken,
                    data: formData
                });
            },

            saveVisual: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'updatevisual?api_token=' + api.apiToken,
                    data: formData
                });
            },

            saveNewDataset: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'create_dataset?api_token=' + api.apiToken,
                    data: formData 
                });
            },
            saveNewSurvey: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'surrvey/save?api_token=' + api.apiToken,
                    data: formData 
                });
            },
            updateSurvey: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'survey/update?api_token=' + api.apiToken,
                    data: formData 
                });
            },

            saveSettings: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'saveVisualSettings?api_token=' + api.apiToken,
                    data: formData 
                });
            },

            generateEmbed: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'generateEmbedToken?api_token=' + api.apiToken,
                    data: formData 
                });
            },

            saveSurveyQuest: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'survey/data?api_token=' + api.apiToken,
                    data: formData 
                });
            },

            saveUserSettings: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'usersettings/save?api_token=' + api.apiToken,
                    data: formData 
                });
            },

            generateSurveyEmbed: function(formData){
                $http.defaults.headers.post['Content-Type'] = undefined;
                return $http({
                    method: 'POST',
                    url: api.baseUrl + 'survey_embeds?api_token=' + api.apiToken,
                    data: formData 
                });
            },


        }

        return api;
    }

})();