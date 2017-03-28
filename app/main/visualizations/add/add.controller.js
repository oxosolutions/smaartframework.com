(function ()
{
    'use strict';

    angular
        .module('app.visualizations.add')
        .controller('AddVisualizationsController', AddVisualizationsController);

    /** @ngInject */
    function AddVisualizationsController($scope, api,$state, $http, $mdToast)
    {
        if(checkAuth($state) == false){
            return false;
        }
      var vm = this;

      api.listdataset.list.get({},function(response){
          // console.log(response);
          vm.datasets = response.data;
          $scope.dataset_id = sessionStorage.visualDataset;
          sessionStorage.visualDataset = '';
      });

      $scope.create_visualization = function(){
        var visualization_title = $scope.visualization.visualization_title;
        var dataset_id = $scope.dataset_id;
        $scope.isLoading = true;
        $http.defaults.headers.post['Content-Type'] = undefined;
        var SendData = new FormData();
        SendData.append('dataset',dataset_id);
        SendData.append('visual_name',visualization_title);
        api.postMethod.saveNewVisual(SendData).then(function(res){
            $mdToast.show(
             $mdToast.simple()
                .textContent('Visualization Saved Successfully!')
                .position('top right')
                .hideDelay(5000)
            );
            $scope.isLoading = false;
            $state.go('app.genvisuals_edit',{'id':res.data.visual_id});
        });
      }

      vm.dtOptions = {
          dom       : '<"top"<"left"<"length"l>><"right"<"search"f>>>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>',
          pagingType: 'full_numbers',
          autoWidth : false,
          responsive: true
      };
    }

    function checkAuth($state){

        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }
})();
