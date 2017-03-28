(function() {
    'use strict';

    angular.module('app.dashboard').filter('pagination', function() {
        return function(input, start) {
            start = +start;
            return input.slice(start);
        };
    });
    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /** @ngInject **/
    function DashboardController($scope, $mdBottomSheet, api, $mdDialog, $state, $mdToast) {
        
        var vm = this;
        api.listuser.list.get({}, function(res) {
           
            $scope.userlist = res.user_list;
           
        });

        $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        $scope.openBottomSheet = function() {
            $mdBottomSheet.show({
                template: '<md-bottom-sheet>Hello!</md-bottom-sheet>'
            });
        };
		vm.dtOptions = {
				dom       : '<"top"<"left"<"length"l>><"right"<"search"f>>>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>',
				pagingType: 'full_numbers',
				order: [[ 0, "desc" ]],
				autoWidth : false,
				responsive: true
		};
        $scope.isDisabled = false;

        $scope.selected = [1];

        $scope.toggle = function(column, list) {
            var idx = list.indexOf(column);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(column);
            }
        };
        $scope.exists = function(column, list) {
            return list.indexOf(column) > -1;
        };



        $scope.toggleAll = function() {
            if ($scope.selected.length === $scope.columns.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.columns.slice(0);
            }
        };
        $scope.deleteUser = function(userId, ev) {

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
                .title('Would you like to delete this user?')
                .textContent('That user will be deleted permanently and no longer available.')
                .ariaLabel('Delete User')
                .targetEvent(ev)
                .ok('Yes, delete it!')
                .cancel('No, don\'t delete');


            $mdDialog.show(confirm).then(function() {
                api.userAction.deleteUser.get({
                    'id': userId
                }, function(res) {
                    if (res.status == 'success') {
                        $state.go($state.current, {}, {
                            reload: true
                        });
                    }
                });
            }, function() {

            });
        }

        $scope.unapprove = function(id,ind){
        	$('.loader_'+ind).show();
        	api.userAction.unapprove.get({
        		'id': id
        	},function(res){
        		if(res.status == 'success'){
        			$mdToast.show(
	                   $mdToast.simple()
                      	.textContent('User disapproved successfully!')
                      	.position('top right')
                      	.hideDelay(5000)
	                );
        			$state.go($state.current, {}, {
                        reload: true
                    });
        		}
        	});
        }

        $scope.approve = function(id,ind){
        	$('.loader_'+ind).show();
        	api.userAction.approve.get({
        		'id': id
        	},function(res){
        		if(res.status == 'success'){
        			$mdToast.show(
	                   $mdToast.simple()
                      	.textContent('User approved successfully!')
                      	.position('top right')
                      	.hideDelay(5000)
	                );
        			$state.go($state.current, {}, {
                        reload: true
                    });
        		}
        	});
        }

        $scope.editUser = function(event,userId) {
        	
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                templateUrl: '/app/main/dashboard/dialogs/edit-dialog.html',
                controller: function DialogController($scope, $mdDialog, api) {
                	var vm = this;
                	api.userAction.editUser.get({
                		'id': userId
                	},function(res){
                		
                		$scope.email = res.user_data.email;
                		$scope.username = res.user_data.name;
                        
                		$scope.phone = res.user_data.phone;
                		
                		$scope.userid = res.user_data.id;
                		var path = api.baseUrl;
                		path = path.split('api');
                		$scope.imagePath = path[0];
                		$scope.imageName = res.user_data.profile_pic;
                	});
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }

                    $scope.saveEdituser = function(id){

        				var formdata = new FormData();
        				var minisID = [];
        				var departID = [];
        				
        				formdata.append('name',$scope.username);
        				formdata.append('phone',$scope.phone);
        				formdata.append('email',$scope.email);
        				
        				formdata.append('id',id);
                        if($scope.files[0] !== undefined){
                            formdata.append('profile_pic',$scope.files[0].lfFile);
                        }
        				api.postMethod.saveEditUser(formdata).then(function(res){
        					
                             $mdDialog.hide();
                             $state.go($state.current, {}, {reload: true});
        				});
        			}
                }
            });
        };

        $scope.updateUser = function(){
              
        };
    }

})();