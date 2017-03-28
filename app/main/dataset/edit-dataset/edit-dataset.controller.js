(function ()
{
    'use strict';

    angular
        .module('app.dataset.edit-dataset')
        .controller('EditDatasetController', EditDatasetController);

    /** @ngInject */
    function EditDatasetController($state, api, $scope, $mdToast, hotRegisterer, $mdDialog)
    {
      if(checkAuth($state) == false){
          return false;
      }
      $scope.st = $state.current.name;
      var vm = this;
      var changedRows = [];
      var deletedRows = [];
      $scope.isDisabled = false;
      $scope.isLoading = false;
      $scope.error_message = '';
      var limit = 500;
      var skip = 0;
      vm.dataset_id = $state.params.id;
      api.dataset.getById.get({'id': $state.params.id, 'skip': skip},
      
        function (response){
            
            $scope.dataset_name = response.records.dataset_name;
            if(response.skip == "0"){
                $scope.isDisabledPrev = true;
            }else{
                $scope.isDisabledPrev = false;
            }
            if(parseInt(skip + limit) >= parseInt(response.total)){
                /*console.log(skip+limit);
                console.log(response.total);*/
                $scope.isDisabledNext = true;
            }else{
                /*console.log(skip+limit);
                console.log(response.total);*/
                $scope.isDisabledNext = false;
            }
            $scope.total_records = response.total;
            vm.items = response.records.records;           
            
            $scope.nextPage = skip + limit;
            $scope.from = skip+1;
            $scope.to = skip + limit;
        }
      );
     $scope.next = function(skip){
        $scope.isDisabledNext = true;
        $scope.isLoadingNext = true;
        api.dataset.getById.get({'id': $state.params.id, 'skip': skip},
      
            function (response){
                if(response.skip == "0"){
                    $scope.isDisabledPrev = true;
                }else{
                    $scope.isDisabledPrev = false;
                }
                $scope.from = skip+1;
                if(parseInt(skip + limit) >= parseInt(response.total)){
                    $scope.to = response.total;
                }else{
                    $scope.to = skip + limit;
                }
                vm.items = response.records.records;           
                vm.dataset_id = response.records.dataset_id;
                $scope.nextPage = skip + limit;
                $scope.prevPage = response.skip - limit;
                $scope.isLoadingNext = false;
                if(parseInt(skip + limit) >= parseInt(response.total)){
                    $scope.isDisabledNext = true;
                }else{
                    $scope.isDisabledNext = false;
                }
            }
        );
     }
     $scope.prev = function(skip){
        $scope.isDisabledPrev = true;
        $scope.isLoadingPrev = true;
        api.dataset.getById.get({'id': $state.params.id, 'skip': skip},
      
            function (response){

              if(response.skip == "0"){
                  $scope.isDisabledPrev = true;

              }else{
                  $scope.isDisabledPrev = false;
              }
              $scope.from = skip+1;
              if(parseInt(skip + limit) >= parseInt(response.total)){
                    $scope.to = response.total;
              }else{
                    $scope.to = skip + limit;
              }
              
              vm.items = response.records.records;           
              vm.dataset_id = response.records.dataset_id;
              $scope.prevPage = skip - limit;
              $scope.nextPage = skip + limit;
              $scope.isLoadingPrev = false;
              if(parseInt(skip + limit) >= parseInt(response.total)){
                  $scope.isDisabledNext = true;
              }else{
                  $scope.isDisabledNext = false;
              }
            }
        );
     }
     $scope.settings = {

          stretchH: 'all',
          contextMenu: [
              'row_above', 
              'row_below', 
              'remove_row',
              '---------',
              'col_left',
              'col_right',
              'remove_col',
              '---------',
              'undo','redo',
              '---------',
              'make_read_only',
              'alignment'
          ],
          formulas: true,
          afterChange: afterChange,
          beforeRemoveRow: beforeRemoveRw

          /*
          columns : [
            {
              data: 'id',
              title: 'ID',
              readOnly: true
            }
          ]
          */
         /* colHeaders: ['stateid', 'district_id', 'taluka_id'],
          columns: [
            {data: 'stateid', type: 'text', renderer: function(instance, td, row, col, prop, value, cellProperties) {
                                                        td.style.backgroundColor = 'yellow';
                                                        td.innerHTML = value;
                                                      }},
            {data: 'district_id', type: 'text'},
            {data: 'taluka_id', type: 'numeric'},
          ]*/
      }
     
      function beforeRemoveRw(index, amount){
      		var rowId = this.getDataAtCell(index,0);
      		deletedRows.push(rowId);
      		$scope.isDisabled = false;
      }
      function afterChange(data, source){
          
          if(source != 'loadData'){
              $scope.isDisabled = false;
              changedRows.push(data[0][0]);
          }
      }
      $scope.saveEditedDataset = function(){
        
          changedRows = changedRows.filter(function(itm,i,a){
              return i==a.indexOf(itm);
          });
          var changedData = $.grep(vm.items, function(value, index){
              return ($.inArray(index,changedRows) !== -1);
          })
          $scope.isDisabled = true;
          $scope.isLoading = true;
          var formData = new FormData();
          formData.append('dataset_id',$state.params.id);
          formData.append('records',JSON.stringify(changedData));
          formData.append('deletedRows',JSON.stringify(deletedRows));
          api.postMethod.saveEditedDatset(formData).then(function(res){
              if(res.data.status == 'success'){
                  $scope.error_message = '';
                  $mdToast.show(
                   $mdToast.simple()
                      .textContent('Dataset Updated Successfully!')
                      .position('top right')
                      .hideDelay(5000)
                  );
                  $scope.isDisabled = false;
                  $scope.isLoading = false;
                  //$state.go('app.dataset_list');
              }else{
                  $scope.isDisabled = false;
                  $scope.isLoading = false;
                  $scope.error_message = res.data.message;
              }
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

    /*function pagination(records){

        var currentPage = 1;
        var limit = 10;
        
        var offset = (currentPage - 1) * limit;

        var records = records[0].slice(offset, offset + limit);

        return records
    }*/

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }

})();
