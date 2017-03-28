(function ()
{
    'use strict';

    angular
        .module('app.survey.addQuestion')
        .controller('EditSurveyController', EditSurveyController);

    /** @ngInject */
    function EditSurveyController($scope,api,$state,$mdToast)
    {		

    		api.roles.list.get({},function(res){
		    	$scope.rolesList = res.roles;
		    });
		    api.listuser.list.get({}, function(res){
		    	$scope.usersList = res.user_list;
		    });
		    $scope.update_survey = function(){
		    	var SendData = new FormData();
		    	var settingsArray = {};
    			// settingsArray['enableDisable'] = $scope.enableDisable;
    			settingsArray['authentication_required']    		= ($scope.authReq == undefined)?null:$scope.authReq;
    			settingsArray['authentication_type']    			= ($scope.authType == undefined)?null:$scope.authType;
    			settingsArray['authorized_users']    				= ($scope.users == undefined)?null:$scope.users;
    			settingsArray['authorized_roles']    				= ($scope.roles == undefined)?null:$scope.roles;
    			settingsArray['survey_scheduling_status']    		= ($scope.scheduling == undefined)?null:$scope.scheduling;
				settingsArray['survey_start_date']    				= ($scope.startDate == undefined)?null:$scope.startDate;
				settingsArray['survey_expiry_date']    				= ($scope.expiryDate == undefined)?null:$scope.expiryDate;
    			settingsArray['survey_timer_status']    			= ($scope.surveyTimer == undefined)?null:$scope.surveyTimer;
    			settingsArray['survey_timer_type']    				= ($scope.timerType == undefined)?null:$scope.timerType;
    			settingsArray['survey_duration']    				= ($scope.duration == undefined)?null:$scope.duration;
    			settingsArray['survey_respone_limit_status']    	= ($scope.responeLimit == undefined)?null:$scope.responeLimit;
    			settingsArray['survey_response_limit_value']    	= ($scope.responseLimitValue == undefined)?null:$scope.responseLimitValue;
    			settingsArray['survey_response_limit_type']    		= ($scope.responseLimitType == undefined)?null:$scope.responseLimitType;
    			settingsArray['survey_custom_error_message_status'] = ($scope.displayCustomMessage == undefined)?null:$scope.displayCustomMessage;
    			settingsArray['survey_custom_error_messages_list']  = ($scope.customMesg == undefined)?null:$scope.customMesg;

	        	var name = $scope.surveyDataForEdit.response.name;		
          		var description = $scope.surveyDataForEdit.response.description;
	        	var enableDisable = $scope.enableDisable;
	          	SendData.append('name',name);
          		SendData.append('description',description);
	        	SendData.append('enableDisable',enableDisable);
	        	SendData.append('settings',JSON.stringify(settingsArray));
	        	SendData.append('id',$state.params.id);
		    	api.postMethod.updateSurvey(SendData).then(function(res){
		    		$mdToast.show(
		               $mdToast.simple()
						.textContent('Survey Updated Successfully!')
		                .position('top right')
		                .hideDelay(3000)
		            );
		            $scope.isLoading = false;

		    		
		    	});
		    }
            api.survey.surveyEditList.get({'id':$state.params.id},function(res){
            	try{
            		$scope.surveyDataForEdit = res;
	                $scope.id = res.response;
	          		$scope.enableDisable 			= (res.response.status == "1")?true:false;
	      			$scope.authReq 					= (res.response.authentication_required == "1")?true:false;
	      			$scope.authType 				= res.response.authentication_type;
	      			$scope.users 					= JSON.parse(res.response.authorized_users);
	      			$scope.roles 					= JSON.parse(res.response.authorized_roles);
	      			$scope.scheduling 				= (res.response.survey_scheduling_status == "1")?true:false;
	      			$scope.startDate 				= res.response.survey_start_date;
	      			$scope.expiryDate 				= res.response.survey_expiry_date;
	      			$scope.surveyTimer 				= (res.response.survey_timer_status == "1")?true:false;
	      			$scope.timerType 				= res.response.survey_timer_type;
	      			$scope.duration 				= res.response.survey_duration;
	      			$scope.responeLimit 			= (res.response.survey_respone_limit_status == "1")?true:false;
	      			$scope.responseLimitValue 		= res.response.survey_response_limit_value;
	      			$scope.responseLimitType 		= res.response.survey_response_limit_type;
	      			$scope.displayCustomMessage 	= (res.response.survey_custom_error_message_status == "1")?true:false;
	      			$scope.customMesg = (res.response.survey_custom_error_messages_list == undefined)?null:JSON.parse(res.response.survey_custom_error_messages_list);
	      			
				 	if($scope.authReq == true){
		      			$scope.authtype = true;
		            if($scope.authType == "role"){
		                $scope.role_list = true;
		                $scope.users_list = false;
		            }else{
		                $scope.role_list = false;
		                $scope.users_list = true;
		            }
		      		}else{
		      			$scope.authtype = false;
		            $scope.users_list = false;
		            $scope.role_list = false;
		      		}
		      		if($scope.surveyTimer == true){
		      			$scope.surveyTimerShow = true;
		            $scope.surveyDuration = true;
		      		}else{
		      			$scope.surveyTimerShow = false;
		            $scope.surveyDuration = false;
		      		}
		      		if($scope.displayCustomMessage == true){
		      			$scope.customMess = true;
		      		}else{
		      			$scope.customMess = false;
		      		}
		      		if($scope.responeLimit == true){
		      			$scope.surevyResponseLimit = true;
		      		}else{
		      			$scope.surevyResponseLimit = false;
		      		}
		      		if($scope.timerType == 'duration'){
		      			$scope.surveyDuration = true;
		      		}else{
		      			$scope.surveyDuration = false;
		      		}
		      		if($scope.scheduling == true){
		                $scope.surveyDates = true;
		            }else{
		                $scope.surveyDates = false;
		            }
		            if($scope.authType == 'role'){
			            if($scope.authReq == true){
			        			$scope.role_list = true;
			            }else{
			              $scope.role_list = false;
			            }
		      			$scope.users_list = false;
			      	}else{
			            if($scope.authReq == true){
			              $scope.users_list = true;
			            }else{
			              $scope.users_list = false;
			            }
			            $scope.role_list = false;
		      		}
            	}catch(e){

            	}
            	$scope.checkAuthEnable = function(){

		      		if($scope.authReq == true){
		      			$scope.authtype = true;
		            if($scope.authType == "role"){
		                $scope.role_list = true;
		                $scope.users_list = false;
		            }else{
		                $scope.role_list = false;
		                $scope.users_list = true;
		            }
		      		}else{
		      			$scope.authtype = false;
		            $scope.users_list = false;
		            $scope.role_list = false;
		      		}
		      	}
		      	$scope.checkSurveyTimer = function(){
		      		if($scope.surveyTimer == true){
		      			$scope.surveyTimerShow = true;
		            $scope.surveyDuration = true;
		      		}else{
		      			$scope.surveyTimerShow = false;
		            $scope.surveyDuration = false;
		      		}
		      	}

		      	$scope.displayCustomMess = function(){
		      		if($scope.displayCustomMessage == true){
		      			$scope.customMess = true;
		      		}else{
		      			$scope.customMess = false;
		      		}
		      	}

		      	$scope.enableResponseLimit = function(){
		      		if($scope.responeLimit == true){
		      			$scope.surevyResponseLimit = true;
		      		}else{
		      			$scope.surevyResponseLimit = false;
		      		}
		      	}

		      	$scope.checkTimerType = function(){
		      		if($scope.timerType == 'duration'){
		      			$scope.surveyDuration = true;
		      		}else{
		      			$scope.surveyDuration = false;
		      		}
		      	}

		        $scope.surveyScheduling = function(){

		            if($scope.scheduling == true){
		                $scope.surveyDates = true;
		            }else{
		                $scope.surveyDates = false;
		            }
		        }

		      	$scope.chechAuthType = function(){

		      		if($scope.authType == 'role'){
			            if($scope.authReq == true){
			        			$scope.role_list = true;
			            }else{
			              $scope.role_list = false;
			            }
		      			$scope.users_list = false;
			      	}else{
			            if($scope.authReq == true){
			              $scope.users_list = true;
			            }else{
			              $scope.users_list = false;
			            }
			            $scope.role_list = false;
		      		}
		      	}
            });
    }
    //acordion 
    $('body').on('click','.accrodian', function(){
         var elm = $(this).parents('.expanded').find('.survey_set');
         if(elm.hasClass('expanded')){
          $('.accrodian').css('transform','rotate(0deg)');
            elm.slideUp();
            elm.removeClass('expanded');
         }else{
            elm.slideDown();
            elm.addClass('expanded');
          $('.accrodian').css('transform','rotate(180deg)');
          
         }
     });
})();
