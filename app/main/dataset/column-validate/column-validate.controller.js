(function ()
{
    'use strict';

    angular
        .module('app.dataset.column-validate')
        .controller('ColumnValidateController', ColumnValidateController);

    /** @ngInject */
    function ColumnValidateController($state, $scope, api, $mdToast, $mdDialog){

        if(checkAuth($state) == false){
            return false;
        }
        $scope.st = $state.current.name;
        var vm = this;
        $scope.dataset_id = $state.params.id;
        api.dataset.getLastColumns.get({'id':$state.params.id},function(res){
            if(res.status != 'error'){

                $scope.dataset_name = res.dataset_name;
                $scope.rawColumns = res.data.dataset_columns;
                $scope.columns = res.data.columns;
            }
            

        });

        $scope.goBack = function(){
            
            $state.go('app.dataset_list');
        }

        vm.dataset_id = $state.params.id;
        $scope.createColumn = function(ev){

            $mdDialog.show({
              controller: DialogController,
              locals:{dataColumns: $scope.columns},
              templateUrl: 'app/main/dataset/column-validate/create-column.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: true,
              fullscreen: false // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {

            }, function() {
              
            });
        }

        $scope.SavevalidateColumns = function(){

            var columns = [];
            var types = []
            $(function(){

                $('input[name=column_name]').each(function(k){
                    columns.push($(this).val());
                });
                $('select[name=type]').each(function(k){
                    types.push($(this).val());
                });

            });
            var columnsAndTypes = {};
            for(var i = 0; i < columns.length; i++){

                columnsAndTypes[columns[i]] = types[i];
            }
            var sendData = new FormData();
            sendData.append('id',$state.params.id);
            sendData.append('columns',JSON.stringify(columnsAndTypes));
            sendData.append('create_columns',$('#colData').val());
            api.postMethod.saveDatasetColumns(sendData).then(function(res){
                $mdToast.show(
                 $mdToast.simple()
                    .textContent('Data Definition Saved Successfully!')
                    .position('top right')
                    .hideDelay(5000)
                );
                
                if($state.params.wizard == ''){
                    //$state.go('app.dataset_list');
                }else{
                    $scope.next = false;
                    $scope.skipThisStep = true;
                }
            });
        }

        $scope.wizardSteps = false;
        $scope.wizardCheck = true;
        if($state.params.wizard != '' && $state.params.wizard == 'wizard'){
            $scope.wizardSteps = true;
            $scope.next = true;
            $scope.skipThisStep = false;
            $scope.wizardCheck = false;
            var completedStatus = JSON.parse(sessionStorage.completedStatus);
            if(completedStatus.step1 == 1){
                $('.wiz_step1').html('&#9679;');
                $('.wiz_step1').addClass('completed');
            }else{
                $('.wiz_step1').html('&#x25CB;');
            }
            if(completedStatus.step2 == 1){
                $('.wiz_step2').html('&#9679;');
                $('.wiz_step2').addClass('completed');
            }else{
                $('.wiz_step2').html('&#9678;');
                $('.wiz_step2').addClass('skipped');
            }
        }
        $scope.nextStep = function(ev){
            
            var confirm = $mdDialog.prompt()
                .title('By what name you want to create your visualizations?')
                .textContent('This step going to create your visualizations with current created dataset for future use.')
                .placeholder('Visualization Name')
                .ariaLabel('Visualization Name')
                .initialValue('')
                .targetEvent(ev)
                .ok('Save Visualization')
                .cancel('Don\'t want to save');
            $mdDialog.show(confirm).then(function(result) {
                var SendData = new FormData();
                SendData.append('dataset',$state.params.id);
                SendData.append('visual_name',result);
                api.postMethod.saveNewVisual(SendData).then(function(res){
                    $mdToast.show(
                     $mdToast.simple()
                        .textContent('Visualization Saved Successfully!')
                        .position('top right')
                        .hideDelay(5000)
                    );
                    $scope.isLoading = false;
                    var completedStatus = JSON.parse(sessionStorage.completedStatus);
                    completedStatus['step3'] = 1;
                    sessionStorage.completedStatus = JSON.stringify(completedStatus);
                    $state.go('app.visualizations_view',{'id':res.data.visual_id,'dataset':$state.params.id});
                });
            });
        }

        $scope.skipStep = function(ev){
            var confirm = $mdDialog.confirm()
                .title('Are you sure to skip this step?')
                .textContent('If you will skip this step, may some errors can occur during visualizations creation.')
                .ariaLabel('Skip Step')
                .targetEvent(ev)
                .ok('Yes, skip it!')
                .cancel('No, don\'t skip');

            $mdDialog.show(confirm).then(function() {
                var confirm = $mdDialog.prompt()
                    .title('By what name you want to create your visualizations?')
                    .textContent('This step going to create your visualizations with current created dataset for future use.')
                    .placeholder('Visualization Name')
                    .ariaLabel('Visualization Name')
                    .initialValue('')
                    .targetEvent(ev)
                    .ok('Save Visualization')
                    .cancel('Don\'t want to save');
                $mdDialog.show(confirm).then(function(result) {
                    var SendData = new FormData();
                    SendData.append('dataset',$state.params.id);
                    SendData.append('visual_name',result);
                    api.postMethod.saveNewVisual(SendData).then(function(res){
                        $mdToast.show(
                         $mdToast.simple()
                            .textContent('Visualization Saved Successfully!')
                            .position('top right')
                            .hideDelay(5000)
                        );
                        $scope.isLoading = false;
                        var completedStatus = JSON.parse(sessionStorage.completedStatus);
                        completedStatus['step3'] = 0;
                        sessionStorage.completedStatus = JSON.stringify(completedStatus);
                        window.wizard_error = 'You did not filtered your current visualization dataset, may some errors can occur while creating visualization.';
                        $state.go('app.visualizations_view',{'id':res.data.visual_id,'dataset':$state.params.id});
                    });
                });
            });
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
    function DialogController($scope, $mdDialog, dataColumns, $compile) {
        $scope.formulaDiv = true;
        $scope.setFormulacheck = function(){
            if($scope.setFormula == true){
                $scope.formulaDiv = true;
            }else{
                $scope.formulaDiv = false;
            }
        }
        $scope.columns = dataColumns;
        $scope.createCol = function(){
            var cloneDiv = $('#cloneDiv').clone();
            cloneDiv.find('.colName').html($scope.colNm);
            cloneDiv.find('.colmType').val($scope.columnType);
            cloneDiv.attr('style','');
            $(cloneDiv).insertAfter('#'+$scope.columnAfter);
            var dataArray = [];
            if($('#colData').val() == ''){
                var newColumnsData = {};
                newColumnsData['col_name'] = $scope.colNm;
                newColumnsData['col_after'] = $scope.columnAfter;
                newColumnsData['col_type'] = $scope.columnType;
                newColumnsData['formula'] = $scope.formulaDiv;
                if($scope.formulaDiv == true){
                    newColumnsData['col_one'] = $scope.colOne;
                    newColumnsData['col_two'] = $scope.colTwo;
                    newColumnsData['operation'] = $scope.operation;
                }
                dataArray.push(newColumnsData);
                $('#colData').val(JSON.stringify(dataArray));
            }else{
                var newColumnsData = {};
                var oldArray = JSON.parse($('#colData').val());
                newColumnsData['col_name'] = $scope.colNm;
                newColumnsData['col_after'] = $scope.columnAfter;
                newColumnsData['col_type'] = $scope.columnType;
                newColumnsData['formula'] = $scope.formulaDiv;
                if($scope.formulaDiv == true){
                    newColumnsData['col_one'] = $scope.colOne;
                    newColumnsData['col_two'] = $scope.colTwo;
                    newColumnsData['operation'] = $scope.operation;
                }
                oldArray.push(newColumnsData);
                $('#colData').val(JSON.stringify(oldArray));
            }
            $mdDialog.hide();
            /*console.log(JSON.parse($('#colData').val()));*/
        }
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
    }
    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

})();
