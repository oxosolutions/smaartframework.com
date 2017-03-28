(function() {
    'use strict';

    angular
        .module('app.dataset.data-filtration')
        .controller('DataFiltrationController', DataFiltrationController);

    /** @ngInject */
    function DataFiltrationController($state, api, $scope, $mdDialog, $mdToast, $timeout) {

        if (checkAuth($state) == false) {
            return false;
        }
        $scope.st = $state.current.name;
        var vm = this;
        var recordsArray = '';
        vm.dataset_id = $state.params.id;
        $scope.showHot = false;
        $scope.isDisabled = false;
        api.dataset.getcolumnsById.get({
                'id': $state.params.id
            },
            // Success
            function(response) {
                window.responseData = response;
                $scope.dataset_name = response.records.dataset_name;
                $scope.id = $state.params.id;
                //$scope.columns = Object.keys(response.records.records[0]);
                $scope.columns = response.records.records[0];

                console.log(response);
                recordsArray = response.records.records;

                if ($scope.showDataset == true) {
                    vm.items = response.records.records;

                }
            },
            // Error
            function(response) {
                console.error(response);
            }
        );

        $scope.selectColumn = function(colKey){
            var records = responseData.records.records;
            $scope.colData = $.unique(arrayColumn(records,colKey));
        }

        $scope.clear = function(){
            $scope.column_key = '';
            $scope.column_val = '';
        }

        function filter(search) {
            var row, r_len;
            var data = myData;
            var array = [];
            for (row = 0, r_len = data.length; row < r_len; row++) {
                for (col = 0, c_len = data[row].length; col < c_len; col++) {
                    if (('' + data[row][col]).toLowerCase().indexOf(search) > -1) {
                        array.push(data[row]);
                        break;
                    }
                }
            }
        }

        $scope.settings = {

            stretchH: 'all',
            contextMenu: [
                
                'undo','redo'
            ],
            formulas: false
        }
          $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.columns, function (column) {
            column.selected = $scope.selectedAll;
        });

    };
    
        $scope.checkNow = function(index){
           
            $scope['check_'+index] = true;
        }
        $scope.displayColumns = function(key) {
            
            var colArray = [];
            angular.forEach(vm.datasetColumns, function(val,key){
                if(val == true){
                    colArray.push(key);
                }
            });
            //console.log(colArray);
            if ($scope.showDataset == true) {
                var filteredColumns = [];
                angular.forEach(recordsArray, function(value, key) {
                    var oneRow = {};
                    angular.forEach(value, function(iVal, iKey) {
                        angular.forEach(colArray, function(colVal) {
                            oneRow[colVal] = value[colVal];
                        });
                    });
                    filteredColumns.push(oneRow);
                });
                vm.items = filteredColumns;
                //console.log(filteredColumns);
            }
        }

        $scope.previewData = function() {
            if ($scope.showDataset == true) {
                $scope.showHot = true;
                $scope.displayColumns();
            } else {
                $scope.showHot = false;
            }
        }
        var uploadedSubsetId = '';
        $scope.saveSubset = function(ev) {
            var confirm = $mdDialog.prompt()
                .title('By what name you want to save your subset?')
                .textContent('Enter your new subset name.')
                .placeholder('Subset Name')
                .ariaLabel('Subset Name')
                .initialValue('')
                .targetEvent(ev)
                .ok('Save Sub-Set')
                .cancel('Don\'t want to save');

            $mdDialog.show(confirm).then(function(result) {
                
                $scope.isDisabled = true;
                $scope.isLoading = true;
                if (vm.datasetColumns === undefined) {
                    var columnsArray = {};
                    angular.forEach(responseData.records.records[0], function(v,k){
                        if(k != 'id'){
                            columnsArray[k] = 'true';
                        }
                    });
                    vm.datasetColumns = columnsArray;
                }
                var formData = new FormData();
                formData.append('dataset_id', $state.params.id);
                formData.append('subset_columns', JSON.stringify(vm.datasetColumns));
                formData.append('subset_name', result);
                formData.append('column_key',$scope.column_key);
                formData.append('column_val',$scope.column_val);
                api.postMethod.saveSubset(formData).then(function(res) {
                    $scope.isLoading = false;
                    $scope.isDisabled = false;
                    if(res.data.status == 'error') {
                        $scope.error_message = res.data.message;
                    }else{
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('Sub-set Created Successfully!')
                            .position('top right')
                            .hideDelay(5000)
                        );
                        if($state.params.wizard == ''){
                            $state.go('app.dataset_view', {
                                'id': res.data.dataset_id
                            });
                        }else{
                            $scope.next = false;
                            $scope.disabelSkip = true;
                            uploadedSubsetId = res.data.dataset_id;
                        }
                        
                    }
                });
                
            }, function() {

            });
        }

         $scope.rowSubset = function(event) {
               $mdDialog.show({
                  clickOutsideToClose: true,
                  scope: $scope,        
                  preserveScope: true,           
                   templateUrl: '/app/main/dataset/include/_subset.html',
                  controller: function DialogController($scope, $mdDialog) {
                     $scope.closeDialog = function() {
                        $mdDialog.hide();
                     }
                  }
               });
            };

        $scope.wizardSteps = false;
        $scope.wizardCheck = true;
        if($state.params.wizard != '' && $state.params.wizard == 'wizard'){
            $scope.wizardSteps = true;
            $scope.next = true;
            $scope.wizardCheck = false;
            var completedStatus = JSON.parse(sessionStorage.completedStatus);
            if(completedStatus.step1 == 1){
                $('.wiz_step1').html('&#9679;');
                $('.wiz_step1').addClass('completed');
            }
            //console.log(sessionStorage.completedStatus);
        }
        $scope.nextStep = function(){
            var completedStatus = JSON.parse(sessionStorage.completedStatus);
            completedStatus['step2'] = 1;
            sessionStorage.completedStatus = JSON.stringify(completedStatus);
            $state.go('app.column_validate',{'id':uploadedSubsetId, 'wizard':'wizard'});
        }
        $scope.skipStep = function(){
            var completedStatus = JSON.parse(sessionStorage.completedStatus);
            completedStatus['step2'] = 0;
            sessionStorage.completedStatus = JSON.stringify(completedStatus);
            $state.go('app.column_validate',{'id':$state.params.id, 'wizard':'wizard'});
        }
        $scope.deleteDataset = function(datasetID,ev){

            var confirm = $mdDialog.confirm({
              
                    onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).addClass('md-raised md-warn ph-15');
                        angular.element($cancelButton).addClass('md-raised ph-15');
                    }
                
            })
                  .title('Would you like to delete this dataset?')
                  .textContent('The Dataset will be deleted permanently and no longer accesible by any user.')
                  .ariaLabel('Delete Dataset')
                  .targetEvent(ev)
                  .ok('Yes, delete it!')
                  .cancel('No, don\'t delete');


            $mdDialog.show(confirm).then(function() {
              api.dataset.deleteDataset.get({'id':datasetID}, function(res){
                  if(res.status == 'success'){
                      $mdToast.show(
                       $mdToast.simple()
                          .textContent('Dataset deleted successfully!')
                          .position('top right')
                          .hideDelay(5000)
                      );
                      $state.go($state.current, {}, {reload: true});
                  }
              });
            }, function() {

            });
        }

    }

    function checkAuth($state) {

        if (sessionStorage.api_token == undefined || sessionStorage.api_token == '') {

            $state.go('app.new-login');
            return false;
        }
    }

    function arrayColumn(inputArray, columnKey, indexKey)
    {
            function isArray(inputValue)
            {
                return Object.prototype.toString.call(inputValue) === '[object Array]';
            }

            // If input array is an object instead of an array,
            // convert it to an array.
            if(!isArray(inputArray))
            {
                var newArray = [];
                for(var key in inputArray)
                {
                    if(!inputArray.hasOwnProperty(key))
                    {
                        continue;
                    }
                    newArray.push(inputArray[key]);
                }
                inputArray = newArray;
            }

            // Process the input array.
            var isReturnArray = (typeof indexKey === 'undefined' || indexKey === null);
            var outputArray = [];
            var outputObject = {};
            for(var inputIndex = 0; inputIndex < inputArray.length; inputIndex++)
            {
                var inputElement = inputArray[inputIndex];

                var outputElement;
                if(columnKey === null)
                {
                    outputElement = inputElement;
                }
                else
                {
                    if(isArray(inputElement))
                    {
                        if(columnKey < 0 || columnKey >= inputElement.length)
                        {
                            continue;
                        }
                    }
                    else
                    {
                        if(!inputElement.hasOwnProperty(columnKey))
                        {
                            continue;
                        }
                    }

                    outputElement = inputElement[columnKey];
                }

                if(isReturnArray)
                {
                    outputArray.push(outputElement);
                }
                else
                {
                    outputObject[inputElement[indexKey]] = outputElement;
                }
            }

            return (isReturnArray ? outputArray : outputObject);
        }

})();