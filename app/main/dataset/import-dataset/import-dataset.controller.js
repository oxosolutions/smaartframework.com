(function ()
{
    'use strict';

    angular
        .module('app.dataset.import-dataset')
        .directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };
            return {
                link: fn_link
            }
        } ])
        .controller('ImportDatasetController', ImportDatasetController);

    /** @ngInject */
    function ImportDatasetController($state, $scope, $http, api)
    {
        if(checkAuth($state) == false){
            return false;
        }
        $scope.disable_button = false;
        $scope.isLoading = false;
        api.listdataset.list.get({},function(res){
            $scope.datasetsList = res.data;
        });
        $scope.showIcon = false;
        var formdata = new FormData();


        //var uploadedDatasetId = '';
        $scope.uploadFiles = function (source) {
            $scope.dataset.$invalid = true;
            $scope.isLoading = true;
            if(source == 'file'){
                if($scope.files.length == 0){
                    $scope.error_message = 'Please select file to upload!'
                    $scope.dataset.$invalid = false;
                    $scope.isLoading = false;
                    return false;
                }else{
                    $scope.error_message = '';
                }

                var typeArray = [
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    'application/vnd.ms-excel',
                                    'text/csv',
                                    '',
                                    'application/sql'
                                ];
                if($.inArray($scope.files[0].lfFile.type, typeArray) !== -1){
                    $scope.message_text = '';
                    $scope.message_color = '';
                    
                    formdata.append('file',$scope.files[0].lfFile);
                    var formFields = $scope.data;
                    $scope.error_message = '';
                    formdata.append('format', formFields.state);
                    formdata.append('add_replace', formFields.action);
                    formdata.append('with_dataset', formFields.tableToreplace);
                    formdata.append('dataset_name', formFields.datasetname);
                    formdata.append('source',source);
                    postDataset(formdata, $scope, $state, api);
                }else{
                    $scope.dataset.$invalid = false;
                    $scope.isLoading = false;
                    $scope.message_text = 'Wrong file selected!';
                    $scope.message_color = 'red';
                }
            }else if(source == 'url'){
                
                if($scope.data.fileurl == undefined){
                    $scope.error_message = 'Please enter file url!'
                    $scope.dataset.$invalid = false;
                    $scope.isLoading = false;
                    return false;
                }else{
                    $scope.error_message = ''
                }
                $scope.message_text = '';
                $scope.message_color = '';
                var formFields = $scope.data;
                formdata.append('fileurl',formFields.fileurl);
                $scope.error_message = '';
                formdata.append('format', formFields.state);
                formdata.append('add_replace', formFields.action);
                formdata.append('with_dataset', formFields.tableToreplace);
                formdata.append('dataset_name', formFields.datasetname);
                formdata.append('source',source);
                postDataset(formdata, $scope, $state, api);

            }else if(source == 'file_server'){
                if($scope.data.filepath == undefined){
                    $scope.error_message = 'Please enter file path!'
                    $scope.dataset.$invalid = false;
                    $scope.isLoading = false;
                    return false;
                }else{
                    $scope.error_message = ''
                }
                $scope.message_text = '';
                $scope.message_color = '';
                var formFields = $scope.data;
                formdata.append('filepath',formFields.filepath);
                $scope.error_message = '';
                formdata.append('format', formFields.state);
                formdata.append('add_replace', formFields.action);
                formdata.append('with_dataset', formFields.tableToreplace);
                formdata.append('dataset_name', formFields.datasetname);
                formdata.append('source',source);
                postDataset(formdata, $scope, $state, api);
            }
        }

        $scope.data = {
            uploadby : 'file'
        }

        $scope.model = {
            isDisabled: true
        }
        $scope.upload = function () {
            angular.element(document.querySelector('#fileInput')).click();
        };
        $scope.addReplaceOrAppend = function(){
            var action = $scope.data.action;
            if(action == 'replace' || action == 'append'){
                $scope.model = {
                    isDisabled: false
                }
            }else{
                $scope.model = {
                    isDisabled: true
                };
            }
        }

        $scope.wizardSteps = false;
        $scope.allDataset = true
        if($state.params.wizard != '' && $state.params.wizard == 'wizard'){
            $scope.wizardSteps = true;
            $scope.next = true;
            $scope.allDataset = false;
        }
        
        $scope.nextStep = function(){
            var completedStatus = {};
            completedStatus['step1'] = 1;
            sessionStorage.completedStatus = JSON.stringify(completedStatus);
            $state.go('app.data_filtration',{'id':uploadedDatasetId,'wizard':'wizard'});
        }

        $scope.showFileUpload = true;
        $scope.uploadby = function(val){

            if(val == 'file'){
                $scope.showFileUpload = true;
                $scope.showFilePath = false;
                $scope.showFileUrl = false;
            }else if(val == 'file_server'){
                $scope.showFileUpload = false;
                $scope.showFilePath = true;
                $scope.showFileUrl = false;
            }else if(val == 'url'){
                $scope.showFileUrl = true;
                $scope.showFileUpload = false;
                $scope.showFilePath = false;
            }
        }
    }
    
    function postDataset(formData, $scope, $state, api){

        api.postMethod.importDataset(formData,$scope).then(function(res){
            // console.log(res);
            if(res.data.status == 'error'){
                $scope.disable_button = false;
                $scope.isLoading = false;
                $scope.error_message = res.data.message;
            }else{
                if($state.params.wizard == ''){
                    $state.go('app.column_validate',{'id':res.data.id});
                }else{
                    $scope.disable_button = false;
                    $scope.isLoading = false;
                    $scope.error_message = res.data.message;
                    $scope.next = false;
                    window.uploadedDatasetId = res.data.id;
                    $state.go('app.column_validate',{'id':res.data.id});
                }
            }
        },function(error){
            $scope.isLoading = false;
            $scope.error_message = 'Unable to upload your dataset';
        },function(evt){
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // console.log('progress: ' + progressPercentage + '% ');
        });
    }

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

})();
