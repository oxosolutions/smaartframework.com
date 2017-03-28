(function ()
{
    'use strict';

    angular
        .module('app.genvisuals.list')
        .controller('ListVisualController', ListVisualController);

    /** @ngInject */
    function ListVisualController($scope, api,$state, $http, $mdDialog, $mdToast)
    {
      if(checkAuth($state) == false){
          return false;
      }
      //console.log(sessionStorage.api_token);
      var vm = this;
      $scope.isLoading = true;
      api.visual.list.get({},function(response){
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

      /*	$scope.generateCode = function(visual_id,ev){

      		var formdata = new FormData();
      		formdata.append('visual_id',visual_id);

      		api.postMethod.generateEmbed(formdata).then(function(res){
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Embed Code')
                    .templateUrl('/app/main/dashboard/dialogs/edit-dialog.html')
                    .textContent('<iframe src="'+api.siteUrl+'embed/'+res.data.token+'" width="100%"></iframe><br><p>Copy the above code and paste where you want to embed the visualization</p>')
                    .ariaLabel('Embed Code')
                    .ok('Done')
                    .targetEvent(ev)
                );
      		});
      	}*/

          $scope.generateCode = function(visual_id,ev) {
              var formdata = new FormData();
              formdata.append('visual_id',visual_id);
              api.postMethod.generateEmbed(formdata).then(function(res){
                 $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,        
                    preserveScope: true,           
                    templateUrl: 'app/main/visualizations/include/embed-dialog.html',
                    controller: function DialogController($scope, $mdDialog, api) {
                      $scope.embedSrc = api.siteUrl+'v/'+res.data.token;
                      $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    }
                 });
              });
            };

        

         $scope.closeMe = function() {
      $mdDialog.hide();
    };

      $scope.deleteVisual = function(visualId, ev){

          var confirm = $mdDialog.confirm({
              
                    onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).addClass('md-raised red-bg ph-20 ');
                        angular.element($cancelButton).addClass('md-raised ph-20 ');
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
                } else{

                  $mdToast.show(
                     $mdToast.simple()
                        .textContent(res.message)
                        .position('top right')
                        .hideDelay(5000)
                    );
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
