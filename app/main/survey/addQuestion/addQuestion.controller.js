(function ()
{
    'use strict';

    angular
        .module('app.survey.addQuestion')
        .controller('AddQuestionSurveyController', AddQuestionSurveyController);

    /** @ngInject */
    function AddQuestionSurveyController($scope, $templateCache, $compile, $state, api, $mdToast,$mdDialog)
    {	 
        $('body').on('click','.add_media',function(){
            var elm = $(this).parents('.questDiv');
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        
                preserveScope: true,           
                templateUrl: 'app/main/survey/addQuestion/dialog/filesDialog.html',
                controller: function DialogController($scope, $mdDialog, api) {
                    api.getallFiles.filesList.get({}, function(res){
                        $scope.listFiles = res.response;
                        console.log(res);
                    });
                    $scope.insertSlug = function(slug){
                        var text = elm.find('.questDescription').val();
                        elm.find('.questDescription').val(text+' ['+slug+']');
                        $mdDialog.hide();
                    }
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                }
            });
        });
        $scope.getIcon = function(type){
            var icon_class = {};
            if(type == 'jpg' || type == 'jpeg'){
               
                return 'icon-file-image';
            }
            if(type == 'mp3'){
                
                return 'icon-file-music';
            }
            if(type == 'wav'){
               
                return 'icon-music-note-eighth';
            }
            if(type == 'png'){
                
                return 'icon-image-area';
            }
           
            return 'icon-image-broken';
        }

        $scope.getClass = function(type){
            var icon_class = {};
            if(type == 'jpg' || type == 'jpeg'){
                
                return 'red-fg';
            }
            if(type == 'mp3'){
               
                return 'green-fg';
            }
            if(type == 'wav'){
               
                return '';
            }
            if(type == 'png'){
                
                return 'cyan-fg';
            }
            return 'red-fg';
        }

        /*$scope.menuOptions = [
            ['<md-icon md-font-icon="icon-pencil"></md-icon><label>Select</label>', function ($itemScope, $event, modelValue, text, $li) {
                console.log($itemScope)
                //$scope.selected = $itemScope.item.name;
            }],
            null, // Dividier
            ['Remove', function ($itemScope, $event, modelValue, text, $li) {
                $scope.items.splice($itemScope.$index, 1);
            }]
        ];*/
        $scope.uploadFile = function(fileData){
            var formData = new FormData();
           
            formData.append('file',fileData.target.files[0]);
            api.postMethod.uploadFile(formData, $scope).then(function(res){
                api.getallFiles.filesList.get({}, function(res){
                    $scope.listFiles = res.response;
                })
                $scope.completeUpload = true;
                setTimeout(function(){
                    $scope.completeUpload = false;
                },5000)
            });
        }
        $scope.insertSlug = function(slug){

        }
        window.compile = $compile;
        window.scope = $scope;
        $scope.surveyID = $state.params.id;
    	window.groupHTML = '';
        window.$state = $state;
    	$.get('app/main/survey/addQuestion/html/group.html', function(data) {
		    groupHTML = data;
	    });
        window.questHTML = '';
        $.get('app/main/survey/addQuestion/html/question.html', function(data){
            questHTML = data;
        });
        window.keyValHTML = '';
        $.get('app/main/survey/addQuestion/html/key_value.html', function(data){
            keyValHTML = data;
        });
        $('.question-div').sortable();
        api.editQuestions.questions.get({'id':$state.params.id}, function(res){
            // console.log(res);
            // console.log($state.params.id);
            $scope.id = res.response;
            $scope.responceData = res.response;
            // console.log(res);

            window.quesid = 1;
            $.each(res.response.group, function(key, val){
                if(key == 0){
                    var elm = $('.groupFrameDiv');
                    elm.find('.groupName').val(val.group_name).change();
                    elm.find('.group_title').text(val.group_name);
                    elm.find('.groupDescription').val(val.group_description);
                    elm.find('.countNumber').html(key+1);
                    $.each(val.group_questions, function(ikey, ival){
                        var stringArray = (ival.question_id).split('_');
                        var questNumber = stringArray[2].replace ( /[^\d.]/g, '' );
                        questNumber = parseInt(questNumber, 10);
                        if(questNumber > quesid){
                            quesid = questNumber;
                        }
                        if(ikey == 0){
                            var questElm = $('.questDiv');
                            questElm.find('.questID').html(ival.question_id);
                            questElm.find('.questType').val(ival.question_type);
                            questElm.find('.questTitle').val(ival.question);
                            questElm.find('.questDescription').val(ival.question_desc);
                            questElm.find('.required').val(ival.required);
                            questElm.find('.nextQuest').val(ival.next_question);
                            questElm.find('.pattern').val(ival.pattern);
                            questElm.find('.questKey').val(ival.question_key);
                            questElm.find('.quest-count').html(ikey+1);
                            if(ival.pattern == 'others'){
                                questElm.find('.patternChange').show();
                                questElm.find('.othetPattern').val(ival.otherPattern);
                            }
                            if(ival.question_type == 'checkbox' || ival.question_type == 'radio' || ival.question_type == 'dropdown'){
                                questElm.find('.addQuestion_right_section').find('#div-one').show();
                                var keyIndex = 0;
                                $.each(ival.extraOptions, function(optionKeys, optionVal){
                                    if(keyIndex == 0){
                                        $('.keyValue').find('.optionKey').val(optionKeys);
                                        $('.keyValue').find('.optionValue').val(optionVal);
                                    }else{
                                        $('.keyValue').append($compile(keyValHTML)($scope));
                                        $('.keyValue').find('.optionKey:last').val(optionKeys);
                                        $('.keyValue').find('.optionValue:last').val(optionVal);
                                    }
                                    keyIndex++;
                                });
                            }
                        }else{
                            $('.questDiv').parent('.question-div').append($compile(questHTML)($scope));
                            $('.questDiv:last').find('.questID').html(ival.question_id);
                            $('.questDiv:last').find('.questType').val(ival.question_type);
                            $('.questDiv:last').find('.questTitle').val(ival.question);
                            $('.questDiv:last').find('.questDescription').val(ival.question_desc);
                            $('.questDiv:last').find('.required').val(ival.required);
                            $('.questDiv:last').find('.nextQuest').val(ival.next_question);
                            $('.questDiv:last').find('.pattern').val(ival.pattern);
                            $('.questDiv:last').find('.questKey').val(ival.question_key);
                            $('.questDiv:last').find('.quest-count').html(ikey+1);
                            if(ival.pattern == 'others'){
                                $('.questDiv:last').find('.patternChange').show();
                                $('.questDiv:last').find('.othetPattern').val(ival.otherPattern);
                            }
                            if(ival.question_type == 'checkbox' || ival.question_type == 'radio' || ival.question_type == 'dropdown'){
                                $('.questDiv:last').find('.addQuestion_right_section').find('#div-one').show();
                                var keyIndex = 0;
                                $.each(ival.extraOptions, function(optionKeys, optionVal){
                                    if(keyIndex == 0){
                                        $('.keyValue:last').find('.optionKey').val(optionKeys);
                                        $('.keyValue:last').find('.optionValue').val(optionVal);
                                    }else{
                                        $('.keyValue:last').append($compile(keyValHTML)($scope));
                                        $('.keyValue:last').find('.optionKey:last').val(optionKeys);
                                        $('.keyValue:last').find('.optionValue:last').val(optionVal);
                                    }
                                    keyIndex++;
                                });
                            }
                        }
                    });
                }else{

                    $('.group-div').append($compile(groupHTML)($scope));
                    var elm = $('.groupFrameDiv:last');
                    var groupLength = $('.groupFrameDiv').length;
                    $('.groupFrameDiv:last').attr('data-number',groupLength);
                    elm.find('.groupName:last').val(val.group_name).change();
                    elm.find('.group_title:last').text(val.group_name);
                    elm.find('.groupDescription:last').val(val.group_description);
                    elm.find('.countNumber').html(key+1);
                    $.each(val.group_questions, function(ikey, ival){
                        // console.log(ival.question_id);
                        var stringArray = (ival.question_id).split('_');
                        var questNumber = stringArray[2].replace ( /[^\d.]/g, '' );
                        questNumber = parseInt(questNumber, 10);
                        if(questNumber > quesid){
                            quesid = questNumber;
                        }
                        if(ikey == 0){
                            var questElm = elm.find('.questDiv');
                            questElm.find('.questID').html(ival.question_id);
                            questElm.find('.questType').val(ival.question_type);
                            questElm.find('.questTitle').val(ival.question);
                            questElm.find('.questDescription').val(ival.question_desc);
                            questElm.find('.required').val(ival.required);
                            questElm.find('.nextQuest').val(ival.next_question);
                            questElm.find('.pattern').val(ival.pattern);
                            questElm.find('.questKey').val(ival.question_key);
                            questElm.find('.quest-count').html(ikey+1);
                            if(ival.pattern == 'others'){
                                questElm.find('.patternChange').show();
                                questElm.find('.othetPattern').val(ival.otherPattern);
                            }
                            if(ival.question_type == 'checkbox' || ival.question_type == 'radio' || ival.question_type == 'dropdown'){
                                questElm.find('.addQuestion_right_section').find('#div-one').show();
                                var keyIndex = 0;
                                $.each(ival.extraOptions, function(optionKeys, optionVal){
                                    if(keyIndex == 0){
                                        questElm.find('.keyValue').find('.optionKey').val(optionKeys);
                                        questElm.find('.keyValue').find('.optionValue').val(optionVal);
                                    }else{
                                        questElm.find('.keyValue').append($compile(keyValHTML)($scope));
                                        questElm.find('.keyValue').find('.optionKey:last').val(optionKeys);
                                        questElm.find('.keyValue').find('.optionValue:last').val(optionVal);
                                    }
                                    keyIndex++;
                                });
                            }
                        }else{
                            elm.find('.questDiv').parent('.question-div').append($compile(questHTML)($scope));
                            $('.questDiv:last').find('.questID').html(ival.question_id);
                            $('.questDiv:last').find('.questType').val(ival.question_type);
                            $('.questDiv:last').find('.questTitle').val(ival.question);
                            $('.questDiv:last').find('.questDescription').val(ival.question_desc);
                            $('.questDiv:last').find('.required').val(ival.required);
                            $('.questDiv:last').find('.nextQuest').val(ival.next_question);
                            $('.questDiv:last').find('.pattern').val(ival.pattern);
                            $('.questDiv:last').find('.questKey').val(ival.question_key);
                            $('.questDiv:last').find('.quest-count').html(ikey+1);
                            if(ival.pattern == 'others'){
                                $('.questDiv:last').find('.patternChange').show();
                                $('.questDiv:last').find('.othetPattern').val(ival.otherPattern);
                            }
                            if(ival.question_type == 'checkbox' || ival.question_type == 'radio' || ival.question_type == 'dropdown'){
                                $('.questDiv:last').find('.addQuestion_right_section').find('#div-one').show();
                                var keyIndex = 0;
                                $.each(ival.extraOptions, function(optionKeys, optionVal){
                                    if(keyIndex == 0){
                                        $('.keyValue:last').find('.optionKey').val(optionKeys);
                                        $('.keyValue:last').find('.optionValue').val(optionVal);
                                    }else{
                                        $('.keyValue:last').append($compile(keyValHTML)($scope));
                                        $('.keyValue:last').find('.optionKey:last').val(optionKeys);
                                        $('.keyValue:last').find('.optionValue:last').val(optionVal);
                                    }
                                    keyIndex++;
                                });
                            }
                        }
                    });
                }
                $('.question-div').sortable();
            });
        });
        $scope.rand = Math.random();
        $scope.saveSurvey = function(survey){
            var index = 1;
            var groupsData = {};
            $('.groupFrameDiv').each(function(){
                var groupName = $(this).find('.groupName').val();
                var groupDesc = $(this).find('.groupDescription').val();
                var questData = {};
                var questId = '';
                $(this).find('.questDiv').each(function(){
                    var questType = $(this).find('.questType').val();
                    questId = $(this).find('.questID').html();
                    var tempQuestData = {};
                    var pattern = $(this).find('.pattern').val();
                    var otherPattern = '';

                    if(pattern == 'others'){
                        otherPattern = $(this).find('.othetPattern').val();
                    }
                    var extraOptions = {};

                    if(questType == 'checkbox' || questType == 'radio' || questType == 'dropdown'){
                        $(this).find('.extraOptions').each(function(){
                            extraOptions[$(this).find('.optionKey').val()] = $(this).find('.optionValue').val();
                        });
                    }
                    tempQuestData['question_id']        = questId;
                    tempQuestData['question_type']      = questType;
                    tempQuestData['question']           = $(this).find('.questTitle').val(); 
                    tempQuestData['question_desc']      = $(this).find('.questDescription').val();
                    tempQuestData['question_key']       = $(this).find('.questKey').val();
                    tempQuestData['next_question']      = $(this).find('.nextQuest').val();
                    tempQuestData['pattern']            = pattern;
                    tempQuestData['otherPattern']       = otherPattern;  
                    tempQuestData['extraOptions']       = extraOptions;
                    tempQuestData['required']           = $(this).find('.required').val();
                    questData[questId] = tempQuestData;
                });
                var dataTemp = {}
                dataTemp['group_name'] = groupName;
                dataTemp['group_description'] = groupDesc;
                dataTemp['group_questions'] = questData;
                groupsData['group_'+index] = dataTemp;
                index++;
            });
            var formData = new FormData();
            formData.append('survey_data',JSON.stringify(groupsData));
            formData.append('survey_id',$state.params.id);
            $scope.isLoading = true;
            api.postMethod.saveSurveyQuest(formData).then(function(result){
                $scope.isLoading = false;
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Survey saved Successfully!')
                    .position('top right')
                    .hideDelay(5000)
                );
                $state.go('app.survey_list');
            });
        }

        $('body').on('click','.delKeyVal', function(){
            $(this).parents('.keyValMinus').remove(); 
        });
            $('.group-div').sortable();
            // $('.move-div').sortable();
        

        $('body').on('click','.delete-group', function(){
            var groupFrame = $(this).parents('.group-frame');
            groupFrame.animate({
                'margin-left':'40%',
                'opacity':'0.5'
            },200, function(){
                groupFrame.remove();
                $('.countNumber').each(function(i){
                    $(this).html(i+1); 
                });
            });
        });

        $('body').on('click', '.delete-question', function(){
            var reorder = $(this).parent('div').parent('div').parent('.group-frame').parent('.question-div');
            var elem = $(this).parent('div').parent('div').parent('.group-frame'); 
            elem.animate({
                'margin-left':'40%',
                'opacity':'0.5'
            },200, function(){
                elem.remove();
                reorder.find('.quest-count').each(function(i){
                    $(this).html(i+1); 
                });
            });
        });

        //hide show


        $('body').on('change','.questType', function(){
            if($(this).val() == "text"){
                $('.addQuestion_right_section > div > div , .div-two').hide();
            }
           if($(this).val() == "checkbox" || $(this).val() == "radio" || $(this).val() == "dropdown"){
                $(this).parent().parent().parent().find('.addQuestion_right_section').find('#div-one').show();
                $('.div-two').hide();
           }
           
           if($(this).val() == "text_only"){
                $('.addQuestion_right_section > div > div , .div-two').hide();
           }
           if($(this).val() == "text_with_image"){
            $('.addQuestion_right_section > div > div').hide();
                $('.div-two').show();
           }

        });

        // $scope.other_pattern = false;
        $(document).on('change','.pattern',function(){
            // console.log($(this).val());
            if($(this).val() == 'others'){
                $(this).parents('.main-row').find('.patternChange').fadeIn();
            }else{
                $(this).parents('.main-row').find('.patternChange').fadeOut();
            }
        });
    }
})();

$('body').on('click','.add-question', function(){
    var elem = $(this).parent('div').parent('.group-frame').find('.quest-count');
    var total = elem.length;
    $(this).parent('div').parent('.group-frame').find('.question-div').append(compile(questHTML)(scope));
    $(this).parent('div').parent('.group-frame').find('.quest-count:last').html(parseInt(total+1));
    // var questLength = $('.questID').length;
    quesid++;
    var questLength = quesid;
    // var questLength = $(this).parent('div').parent('.group-frame').find('.questID').length;
    var groupNumber = $(this).parent('div').parents('.group-frame').attr('data-number');
    $(this).parent('div').parent('.group-frame').find('.questID:last').html('SID'+$state.params.id+'_GID'+groupNumber+'_QID'+parseInt(questLength));
    $('.question-div').sortable();
    $(this).off('click');
});
$('body').on('click','.addKeys', function(){
    $(this).parents('.keyValue').append(window.compile(keyValHTML)(window.scope));
});
$('body').on('click','.add-group', function(){
    var total = $('.countNumber').length;
    groupHTML.replace(/replaceIndexToModel(?=<|\s)/gi,3);
    $('.group-div').append(compile(groupHTML)(scope));
    $('.countNumber:last').html(parseInt(total+1));
    scope.rand = Math.random();
    var groupLength = $('.groupFrameDiv').length;
    quesid++;
    var questLength = quesid;
    $('.groupFrameDiv:last').attr('data-number',groupLength);
    $('.questID:last').html('SID'+$state.params.id+'_GID'+groupLength+'_QID'+questLength);
    // $('.questID:last').html('SID'+$state.params.id+'_GID'+groupLength+'_QID1');
    $('.question-div').sortable();
});
$('body').on('click','.accrodian', function(){
    var elem = $(this);
    var groupFrame = $(this).parent('div').parent('div').parent('.group-frame');
    if(groupFrame.hasClass('expanded')){
        groupFrame.animate({
            'height': '50px'
        },300);
        groupFrame.removeClass('expanded');
        elem.css('transform','rotate(0deg)');
    }else{
        groupFrame.addClass('expanded');
        groupFrame.animate({
            'height': $(this).get(0).scrollHeight + 17
        },200, function(){
            $(this).height('auto');
            elem.css('transform','rotate(180deg)');
        });
    }
    
});
$('body').on('click','.upload-button',function(){
   $('.upload-file').click(); 
});

/*$(document).bind("contextmenu", function (event) {
    
    // Avoid the real one
    event.preventDefault();
    
    // Show contextmenu
    $(".custom-menu").finish().toggle(100).
    
    // In the right position (the mouse)
    css({
        top: (event.pageY-60) + "px",
        left: (event.pageX-200) + "px",
        position: 'absolute',
        'overflow-y': 'hidden'
    });
});


// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {
    
    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {
        
        // Hide it
        $(".custom-menu").hide(100);
    }
});


// If the menu element is clicked
$(".custom-menu li").click(function(){
    
    // This is the triggered action name
    switch($(this).attr("data-action")) {
        
        // A case for each action. Your actions here
        case "first": alert("first"); break;
        case "second": alert("second"); break;
        case "third": alert("third"); break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});*/