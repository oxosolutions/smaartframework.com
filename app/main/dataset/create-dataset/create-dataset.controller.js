(function ()
{
    'use strict';

    angular
        .module('app.dataset.create-dataset')
       
        .controller('CreateDatasetController', CreateDatasetController);

    /** @ngInject */
    function CreateDatasetController($scope,api,$mdToast,$state){
        
      	$scope.listColumns = {}

      	$scope.drawColumn = function(){
      		var numColumns = [];
      		for(var i = 0; i < $scope.someModel; i++){
      			numColumns.push(i);
      		}
      		$scope.columns = numColumns;
      		console.log(numColumns);
      	}
        var vars = [];
        for(var i = 1; i<=100;i++){
          vars.push(i);
        }
        $scope.numberOfColumns = vars;
      	$scope.saveDatset = function(){
          
      		var formData = new FormData();
      		formData.append('dataset_name',$scope.datasetname);
          formData.append('number_of_columns',$scope.someModel);
      		formData.append('dataset_columns',JSON.stringify($scope.listColumns));
      		api.postMethod.saveNewDataset(formData).then(function(res){
            if(res.data.status == 'success'){
              $mdToast.show(
                 $mdToast.simple()
                    .textContent('Dataset Created Successfully!')
                    .position('top right')
                    .hideDelay(5000)
                );

              $state.go('app.dataset_list');
            }
      			console.log(res);
      		});
      	}
    }
    
   

})();
