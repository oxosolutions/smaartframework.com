(function ()
{
    'use strict';

    angular
        .module('app.dataset.validate-dataset')
        .controller('ValidateDatasetController', ValidateDatasetController);

    /** @ngInject */
    function ValidateDatasetController($state, api, $scope, $mdToast, hotRegisterer, $mdDialog)
    {
      	if(checkAuth($state) == false){
          	return false;
      	}
        $scope.st = $state.current.name;
      	var vm = this;
      	var changedRows = [];
      	vm.dataset_id = $state.params.id;
      	api.dataset.columnValidate.get({'id': $state.params.id},
      
        	function (response){
              
              if(response.defined == 'false'){
                  $scope.showNotdefined = true;
                  return false;
              }
              if(response.wrong_rows.length == 0){
                $scope.showTable = false;
                $scope.noWrongData = true;
              }else{
                $scope.noWrongData = false;
                $scope.showTable = true;
                $scope.dataset_name = response.dataset_name;
                $scope.items = response.wrong_rows; 
                $scope.dataset_id = $state.params.id;
              }
        	}
      	);
        
     
     	$scope.settings = {

          	stretchH: 'all',
          	contextMenu: false,
          	formulas: true,
          	afterChange: afterChange,
          	renderer: function(instance, td, row, col, prop, value, cellProperties){
          		
          		if(isHTML(value)){
          			td.style.backgroundColor = 'red';
					var div = document.createElement("div");
					div.innerHTML = value;
					var text = div.textContent || div.innerText || "";
          			td.innerHTML = text;
          		}else{
          			td.innerHTML = value;
          		}
          	}
      	}
      	function isHTML(str) {
		    var a = document.createElement('div');
		    a.innerHTML = str;
		    for (var c = a.childNodes, i = c.length; i--; ) {
		        if (c[i].nodeType == 1) return true; 
		    }
		    return false;
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
          
          	var changedData = $.grep($scope.items, function(value, index){
              	return ($.inArray(index,changedRows) !== -1);
          	});
          
          	$scope.isDisabled = true;
          	$scope.isLoading = true;
          	var formData = new FormData();
          	formData.append('dataset_id',$state.params.id);
          	formData.append('records',JSON.stringify(changedData));
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
