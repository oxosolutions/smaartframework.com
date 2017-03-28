(function ()
{
    'use strict';

    angular
        .module('app.survey.add')
        .controller('AddSurveyController', AddSurveyController);

    /** @ngInject */
    function AddSurveyController($scope,$http,api,$mdToast,$state)
    {
    	$scope.customMesg = {
       /* survey_status           : "You need to be logged in to access the survey.",*/
        survey_status           : "Survey is disabled.",
        survey_auth_required    : "Your user role do not have permissions access the survey.",
        survey_unauth_role      : "Your user role do not have permissions access the survey.", 
        survey_unauth_user      : "You do not have permissions to access the survey.", 
        invalid_survey_id       : "Invalid survey ID.", 
        empty_survey            : "Empty survey.", 
        survey_not_started      : "Survey not started yet.",
        survey_expired          : "Survey is expired.",
        responce_limit_exceeded : "Responce limit exceeded."
      };

    	$scope.enableDisable = true;
		  $scope.create_survey = function(){
    			var settingsArray = {};
    			// settingsArray['enableDisable'] = $scope.enableDisable;
        			settingsArray['authentication_required']           = ($scope.authReq == undefined)?null:$scope.authReq;
        			settingsArray['authentication_type']               = ($scope.authType == undefined)?null:$scope.authType;
        			settingsArray['authorized_users']                  = ($scope.users == undefined)?null:$scope.users;
        			settingsArray['authorized_roles']                  = ($scope.roles == undefined)?null:$scope.roles;
        			settingsArray['survey_scheduling_status']          = ($scope.scheduling == undefined)?null:$scope.scheduling;
              settingsArray['survey_start_date']                 = ($scope.startDate == undefined)?null:$scope.startDate;
              settingsArray['survey_expiry_date']                = ($scope.expiryDate == undefined)?null:$scope.expiryDate;
              settingsArray['survey_timer_status']               = ($scope.surveyTimer == undefined)?null:$scope.surveyTimer;
        			settingsArray['survey_timer_type']                 = ($scope.timerType == undefined)?null:$scope.timerType;
        			settingsArray['survey_duration']                   = ($scope.duration == undefined)?null:$scope.duration;
        			settingsArray['survey_respone_limit_status']       = ($scope.responeLimit == undefined)?null:$scope.responeLimit;
        			settingsArray['survey_response_limit_value']       = ($scope.responseLimitValue == undefined)?null:$scope.responseLimitValue;
        			settingsArray['survey_response_limit_type']        = ($scope.responseLimitType == undefined)?null:$scope.responseLimitType;
        			settingsArray['survey_custom_error_message_status']= ($scope.displayCustomMessage == undefined)?null:$scope.displayCustomMessage;
        			settingsArray['survey_custom_error_messages_list'] = ($scope.customMesg == undefined)?null:$scope.customMesg;

	        var name = $scope.survey.title;		
          var description = $scope.survey.des;
	        var enableDisable = $scope.enableDisable;
	          
	        $scope.isLoading = true;
	        $http.defaults.headers.post['Content-Type'] = undefined;
	        var SendData = new FormData();
	        SendData.append('name',name);
          SendData.append('description',description);
	        SendData.append('enableDisable',enableDisable);

	        SendData.append('settings',JSON.stringify(settingsArray));
	        api.postMethod.saveNewSurvey(SendData).then(function(res){
            $scope.surv_id = res.data.survey_id;
            $state.go('app.survey_edit',{ 'id' : res.data.survey_id });
            

	          	$mdToast.show(
	               $mdToast.simple()
                  .textContent('Survey Saved Successfully!')
	                .position('top right')
	                .hideDelay(5000)
	            );

	            $scope.isLoading = false;
	        });
	    }
	    api.roles.list.get({},function(res){
	    	$scope.rolesList = res.roles;
	    });
	    api.listuser.list.get({}, function(res){
	    	$scope.usersList = res.user_list;
	    });

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
    }
})();
