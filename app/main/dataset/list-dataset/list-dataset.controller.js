(function ()
{
		'use strict';

		angular
				.module('app.dataset.list-dataset')
				.controller('ListDatasetController', ListDatasetController);

		/** @ngInject */
		function ListDatasetController($scope, $mdDialog, api, $state, $mdToast)
		{
				
				if(checkAuth($state) == false){
						return false;
				}

				var vm = this;

				api.listdataset.list.get({},function(res){
						// Data
						
						vm.datasets = res.data;
				});
				vm.HotTableData = [
								['A','B','C','D','E','F'],
								['G','H','I','J','K','L'],
								['M','N','O','P','Q','R'],
				];
		vm.dtOptions = {
						dom       : '<"top"<"left"<"length"l>><"right"<"search"f>>>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>',
						pagingType: 'full_numbers',
						order: [[ 0, "desc" ]],
						autoWidth : false,
						responsive: true
				};
				$scope.downloadCSV = function(id){
						window.location.href = api.downloadFile.downloadDatasetFile(id,'csv');
				}

				$scope.downloadExcel = function(id){
						window.location.href = api.downloadFile.downloadDatasetFile(id,'xls');
				}
				$scope.deleteDataset = function(datasetID,ev){

						var confirm = $mdDialog.confirm({
							
										onComplete: function afterShowAnimation() {
												var $dialog = angular.element(document.querySelector('md-dialog'));
												var $actionsSection = $dialog.find('md-dialog-actions');
												var $cancelButton = $actionsSection.children()[0];
												var $confirmButton = $actionsSection.children()[1];
												angular.element($confirmButton).addClass('md-raised red-bg ph-20');
												angular.element($cancelButton).addClass('md-raised ph-20');
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
			$scope.createVisual = function(datasetID){
				sessionStorage.visualDataset = datasetID;
				$state.go('app.visualizations_add');
			}

			$scope.showCustom = function(event,datasetID) {
	            $mdDialog.show({
	              clickOutsideToClose: true,
	              scope: $scope,        
	              preserveScope: true,           
	              templateUrl: '/app/main/dataset/include/_view_visuals.html',
	              controller: function DialogController($scope, $mdDialog, api) {
	                api.visual.visualByDatset.get({'id':datasetID},function(res){
	                    $scope.dataset_id = datasetID;
	                    $scope.listVisual = res.list_visuals;
	                });
	                $scope.closeDialog = function() {
	                  $mdDialog.hide();
	                }
	              }
	            });
	        };
	        

				
		}
		function checkAuth($state){
				if(sessionStorage.api_token == undefined || sessionStorage.api_token == ''){
						$state.go('app.new-login');
						return false;
				} else{
					return true;
				}

		}

})();
