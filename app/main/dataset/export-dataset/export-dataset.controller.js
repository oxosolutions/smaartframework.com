(function ()
{
    'use strict';

    angular
        .module('app.dataset.export-dataset')
        .controller('ExportDatasetController', ExportDatasetController);

    /** @ngInject */
    function ExportDatasetController(api, $state, $scope, $mdDialog)
    {
        if(checkAuth($state) == false){
            return false;
        }
        var vm = this;
        api.listdataset.list.get({},function(res){
            // Data
            vm.datasets = res.data;
        });

        $scope.generateLink = function(id){

            window.location.href = api.downloadFile.downloadDatasetFile(id);
        }
		vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'full_numbers',
            autoWidth : false,
            responsive: true
        };
        vm.announceClick = function(index) {
            $mdDialog.show(
            $mdDialog.alert()
                .title('You clicked!')
                .textContent('You clicked the menu item at index ' + index)
                .ok('Nice')
            );
        };

        $scope.downloadSql = function(id){

            $mdDialog.show(
            $mdDialog.alert()
                .title('You clicked! on SQL')
                .textContent('Dataset id '+id)
                .ok('Nice')
            );
        }

        $scope.downloadCSV = function(id){
            window.location.href = api.downloadFile.downloadDatasetFile(id,'csv');
        }

        $scope.downloadExcel = function(id){
            window.location.href = api.downloadFile.downloadDatasetFile(id,'xls');
        }
    }

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

})();
