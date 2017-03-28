(function ()
{
    'use strict';

    angular
        .module('app.dataset.add-dataset')
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
        .controller('AddDatasetController', AddDatasetController);

    /** @ngInject */
    function AddDatasetController(AddDataset)
    {
        if(checkAuth($state) == false){
            return false;
        }
            var vm = this;

            // Data
            vm.datasets = ImportDataset.data;
            //console.log(ImportDataset);

         /* vm.dtOptions = {
                dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'full_numbers',
                autoWidth : false,
                responsive: true
            };
*/
        // Methods

        //////////
    }

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

})();
