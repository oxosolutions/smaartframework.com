(function ()
{
    'use strict';

    angular
        .module('app.visualizations.list')
        .controller('ListVisualizationsController', ListVisualizationsController);

    /** @ngInject */
    function ListVisualizationsController($scope, api,$state, $http, $mdDialog, $mdToast)
    {
      if(checkAuth($state) == false){
          return false;
      }
      //console.log(sessionStorage.api_token);
      var vm = this;
      $scope.isLoading = true;
      api.visualizations.list.get({},function(response){
         //console.log(response);
          vm.visuals = response.records;
      });


      vm.dtOptions = {
          dom       : '<"top"<"left"<"length"l>><"right"<"search"f>>>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>',
          pagingType: 'full_numbers',
          order: [[ 0, "desc" ]],
          autoWidth : false,
          responsive: true
      };

      $scope.deleteVisual = function(visualId, ev){

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
                .title('Would you like to delete this visualization?')
                .textContent('The Visualization will be deleted permanently and no longer accesible by any user.')
                .ariaLabel('Delete Visualization')
                .targetEvent(ev)
                .ok('Yes, delete it!')
                .cancel('No, don\'t delete');

          $mdDialog.show(confirm).then(function() {
            api.visualizations.deleteVisualization.get({'id':visualId}, function(res){
                if(res.status == 'success'){
                    $mdToast.show(
                     $mdToast.simple()
                        .textContent('Visualization deleted successfully!')
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
    function checkAuth($state){
      //console.log(sessionStorage.api_token);
        if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){

            $state.go('app.new-login');
            return false;
        }
    }
})();
