(function ()
{
    'use strict';

    angular
        .module('app.genvisuals.edit')
        .controller('EditVisualController', EditVisualController)
        .filter('propsFilter', propsFilter);

    function propsFilter(){

        return function(items, props){
            var out = [1,2,3,4];
            return out;
        }
    }

    /** @ngInject */
    function EditVisualController($scope, $state, api, $mdToast, $compile , $mdDialog){
        var vm = this;
        $scope.disableColumns = true;
        $scope.disableButton = false;
        $scope.disableDataset = true;
        $scope.message = false;
        $scope.filter_columns = {};       
        $scope.filter_type = {};
        var visualSettings = {"animation":{"startup":true,"duration":250,"easing":"inAndOut"},"legend":"top","curveType":"function","pointSize":"8","width":"80%","height":"480","chartArea":{"left":"10%","top":"10%","bottom":"25%","height":"100%","width":"80%"},"bar":{"groupWidth":"80%"},"tooltip":{"isHtml":true}};
        $scope.chart_types = [{
                "value": "ColumnChart",
                "label": "Column Chart"
            },
            {
                "value": "BarChart",
                "label": "Bar Chart"
            },
            {
                "value": "AreaChart",
                "label": "Area Chart"
            },
            {
                "value": "PieChart",
                "label": "Pie Chart"
            },
            {
                "value": "LineChart",
                "label": "line Chart"
            },
            {
                "value": "BubbleChart",
                "label": "Bubble Chart"
            },
            {
                "value": "CustomMap",
                "label": "Custom Map"
            }
        ];

        $scope.editName = function(){

            if($scope.visualName == undefined || $scope.visualName == false){
                $scope.visualName = true;
            }else{
                $scope.visualName = false;
            }
        }
        
        
        $scope.showCustom = function(event, chart, chartType) {
           $mdDialog.show({
              clickOutsideToClose: true,
              scope: $scope,        
              preserveScope: true,           
              templateUrl: 'app/main/visualizations/generated/edit/dialogs/visual-setting.html',
              controller: function DialogController($scope, $mdDialog) {
                 $scope.closeDialog = function() {
                    $mdDialog.hide();
                 }
                 $scope.chart = chart;
                 $scope.selectedChart = chartType
                 setTimeout(function(){
                    $scope.visualSettings.chart_settings = JSON.parse($scope.chartsData.visual_settings[chart][0]);
                 },3);
                 var chartSetting = JSON.parse(window.response.data.visual_set.meta_value);

                 $scope.settings = chartSetting;
                 $scope.saveVisualSettings = function(){
                    if($scope.visualSettings.chart_settings.colors == undefined || $scope.visualSettings.chart_settings.colors == ''){
                        delete $scope.visualSettings.chart_settings.colors;
                    }else{
                        var clrs = ($scope.visualSettings.chart_settings.colors).split(',');
                        $scope.visualSettings.chart_settings.colors = clrs.trim();
                    }
                    $scope.chartsData.visual_settings[chart][0] = JSON.stringify($scope.visualSettings.chart_settings);
                    $mdDialog.hide();
                 }
              }
           });
        };

        $scope.AddEmbed = function(event) {
           $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        
                preserveScope: true,           
                templateUrl: 'app/main/visualizations/generated/edit/dialogs/add-embed.html',
                controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                    
                    $scope.saveEmbedSettings = function(){
                        $mdDialog.hide();
                    }
                
                }
            });
        };

        $scope.getNumber = function(num) {
            return new Array(num);   
        }
        $scope.viewDataset = function(datasetId){
            $state.go('app.dataset_view',{'id':datasetId});
        }

    	api.listdataset.list.get({},function(res){
            var datasetData = res.data;
    		api.visual.visualDetails.get({id:$state.params.id},function(res){
                $scope.mapList = res.map_list;
                window.response = res;
    			var settings = res;
                var dataset_name = $.grep(datasetData, function(v,k){
                    if(v.dataset_id == res.data.dataset_id){
                        return v
                    }
                })
                $scope.datasets = dataset_name;
                // console.log(dataset_name);
                var columnsData = JSON.parse(res.data.columns);
                
                if(columnsData != null){
                    var filterData = JSON.parse(res.data.filter_columns);
                    $scope.extraFilters = filterData;
                    angular.forEach(filterData, function(val, key){
                        $scope.filter_columns[key] = val.column;
                        $scope.filter_type[key] = val.type;
                    });
                    if(columnsData.column_one != undefined){
                        $scope.charts = Array.apply(null, {length: Object.keys(columnsData.column_one).length}).map(Number.call, Number);
                    }
                }else{
                    $scope.filter_columns['filter_1'] = '';
                    $scope.filter_type['filter_1'] = '';
                    $scope.charts = [];
                }
                $scope.formula = {};
                $scope.chartType = {};
                $scope.chartsData = columnsData;
    			$scope.dataset_id = res.data.dataset_id;
    			$scope.visual_name = res.data.visual_name;
    			api.visual.getCols.get({id:res.data.dataset_id}, function(res){
                    
	    			$scope.disableButton = false;
	    			$scope.isLoading = false;
	    			$scope.columns = res.columns;
	    			$scope.disableColumns = false;
	    			$scope.visual_columns = JSON.parse(settings.data.columns);
	    			//$scope.filter_columns = JSON.parse(settings.data.filter_columns);
                    var chartTy = JSON.parse(settings.data.chart_types);
	    			$scope.visual_settings = settings.data.visual_settings;
                    if(columnsData != null){
                        angular.forEach($scope.chartsData.column_one, function(elem,key){
                            
                            $scope.chartType[key] = chartTy[key];
                            $scope.chartsData.visual_settings[key][0] = window.response.data.visual_settings[key][0];
                        });
                    }else{
                        $scope.chartsData = {};
                        $scope.chartsData.visual_settings = {};
                        $scope.chartsData.formula = {};
                        $scope.chartsData.mapArea = {};
                        $scope.chartsData.visual_settings['chart_1'] = {};
                        try{
                            $scope.chartsData.visual_settings['chart_1'][0] = window.response.data.visual_settings['chart_1'][0];
                        }catch(err){
                            $scope.chartsData.visual_settings['chart_1'][0] = window.response.data.default_setting;
                        }
                        $scope.chartsData.formula['chart_1'] = 'no';
                    }
                    if($scope.chartsData.title == undefined){
                        $scope.chartTyp = false;
                        $scope.chartXAxis = false;
                        $scope.chartYAxis = false;
                        $scope.formulaHS = false;
                    }else{
                        $scope.chartTyp = true;
                        $scope.chartXAxis = true;
                        $scope.chartYAxis = true;
                        $scope.formulaHS = true;
                    }
                    $scope.showChartType = function(text){
                        if(text.length > 0){
                            $scope.chartTyp = true;
                        }
                    }
                    $scope.showAxisesFields = function(){
                        $scope.chartXAxis = true;
                        $scope.chartYAxis = true;
                    }
                    $scope.showFormula = function(){
                        $scope.formulaHS = true;
                    }
                    
	    		});
    		});
    	});

        $scope.getMapdata = function(searchText){
            // console.log($scope.mapList);
            var finded = $.grep($scope.mapList, function(v,k){
                if(v.title.toLowerCase().indexOf(searchText) >= 0 ){
                    return v;
                }
            });
           
            return finded;
            //console.log(searchText);
        }

    	$scope.getColumns = function(){
    		if($scope.dataset_id == undefined){
    			$scope.error_message = 'Please select dataset first!';
    			$scope.message = true;
    			return false;
    		}
    		$scope.disableButton = true;
    		$scope.isLoading = true;
    		api.visual.getCols.get({id:$scope.dataset_id}, function(res){
    			$scope.disableButton = false;
    			$scope.isLoading = false;
    			$scope.columns = res.columns;
    			$scope.disableColumns = false;
    			$scope.message = true;
    			$scope.error_message = 'Columns retrived successfully!';
    		});
    	}

    	$scope.update_visual = function(view){

            var filtersList = {};
            angular.forEach($scope.filter_columns, function(val, key){
                var tempObject = {};
                tempObject['column'] = val;
                tempObject['type'] = $scope.filter_type[key];
                filtersList[key] = tempObject;
            });
            $scope.isLoading = true;
    		$scope.error_message = '';
    		$scope.message = false;
    		var formData = new FormData();
    		formData.append('dataset_id',$scope.dataset_id);
    		formData.append('visual_name',$scope.visual_name);
            formData.append('columns',JSON.stringify($scope.chartsData));
    		formData.append('formula',JSON.stringify($scope.formula));
            formData.append('filter_cols',JSON.stringify(filtersList));
    		formData.append('chartTypes',JSON.stringify($scope.chartType));
    		formData.append('visual_id',$state.params.id);

    		api.postMethod.saveVisual(formData).then(function(res){
    			if(res.data.status == 'success'){
    				 $mdToast.show(
			             $mdToast.simple()
			                .textContent('Visual Update Successfully!')
			                .position('top right')
			                .hideDelay(5000)
			            );
			            $scope.isLoading = false;
                        if(view == 'no'){
                            $state.go('app.genvisuals_list');
                        }else{
                            $state.go('app.genvisual_view',{'id':$state.params.id});
                        }
    			}else{
    				$scope.error_message = res.data.message;
    				$scope.message = true;
    			}
    		});
    	}

        $scope.addFilter = function(){
            var totalFilters = parseInt($('.filterCount').length + 1);
            var appendData = '<div> <md-divider></md-divider><div layout="row" class="pl-5"> <span class="md-grey-bg md-headline mt-20 mh-10 mb-15 filterCount md-body-2 white-fg" style="border-radius:50%;height:28px;line-height:28px;width:28px;text-align:center;"> '+totalFilters+' </span> <div flex="40" layout="row"> <md-input-container class="md-block" flex="95" style="margin-left: 2%;" > <label class="font-size-18 font-weight-300">Filter Variable</label> <md-select ng-model="filter_columns[\'filter_'+totalFilters+'\']"> <md-option ng-repeat="(key, column) in columns" ng-value="key"> {{column}} </md-option> </md-select> </md-input-container> </div> <div flex="40" layout="row"> <md-input-container class="md-block" flex="95" style="margin-left: 2%;"> <label class="font-size-18 font-weight-300">Filter Type</label> <md-select ng-model="filter_type[\'filter_'+totalFilters+'\']"> <md-option value="range"> Range </md-option> <md-option value="dropdown"> Single Select </md-option> <md-option value="mdropdown"> Multi Select </md-option> </md-select> </md-input-container> </div> <div flex class="mr-30 mt-24"> <a href="" style="float:right;margin-right:1%;margin-top:1%;" class="deleteFilter" filter-ind="'+totalFilters+'"><md-tooltip md-direction="top" class="md-body-1"> Remove Filter </md-tooltip><md-icon flex="20" md-font-icon="icon-trash" class="s20 red-fg"> </md-icon></a> </div> </div> </div>'
            $('.filtersList').append($compile(appendData)($scope));
            if($scope.extraFilters == null){
                $scope.nofilterAvail = true;
            }
        }
        $(document).on('click','.deleteFilter',function(){
            delete $scope.filter_columns['filter_'+$(this).attr('filter-ind')];
            delete $scope.filter_columns[0];
            delete $scope.filter_columns[1];
            $(this).parent('div').parent('div').remove();
            if($('.filterCount').length == 0){
                $scope.nofilterAvail = false;
            }
        });

        $scope.addMoreChart = function(){
            var cnt = parseInt($('.chartCount').length+1);

            $('.repeat').append($compile('<div class="frame" style="margin-top:2%; height:50px; overflow:hidden;"> <md-divider></md-divider> <md-button class="deleteFrame md-icon-button mt-5" aria-label="delete_chart" style="float: right;"> <md-icon flex="20" md-font-icon="icon-trash" class="s24 red-fg"></md-icon> </md-button> <div layout="row"> <div class="md-accent-bg ph-10 pv-5 md-headline chartCount mt-5">{{$index+1}}</div> <div flex="90" layout="row" layout-align="center center" class="md-title">{{chartsData.title[\'chart_'+cnt+'\']}}</div> <div style="float: right; margin-top: 2%; margin-right: 4%; font-size: 23px; cursor: pointer;" class="exp_col"> <md-tooltip md-direction="top" class="md-body-1 col-exp">Minimize / Maximize</md-tooltip> <img src="assets/images/arrow-down.png" style="width:16px;margin-top:5px;transform: rotate(179deg)"> </div> </div> <md-input-container class="md-block mt-30" flex="95" style="margin-left: 2%;"> <label class="font-size-16 font-weight-300">Chart Title</label> <input type="text" name="chart_title" ng-model="chartsData.title[\'chart_'+cnt+'\']" value="" required /></md-input-container> <md-input-container class="md-block mv-35" flex="95" style="margin-left: 2%; padding-bottom: 2%;"> <label class="font-size-18 font-weight-300">Chart Type</label> <md-select ng-model="chartType[\'chart_'+cnt+'\']"> <md-option ng-repeat="value in chart_types" ng-value="value.value">{{value.label}}</md-option> </md-select> </md-input-container> <md-input-container class="md-block mv-35" flex="95" style="margin-left:2%;padding-bottom:2%" ng-show="chartType[\'chart_'+cnt+'\'] == \'CustomMap\'"> <label class="font-size-18 font-weight-300">Map Area</label><md-select <md-select ng-model="chartsData.mapArea[\'chart_'+cnt+'\']"> > <md-option value="{{maps.id}}" ng-repeat="maps in mapList" >{{maps.title}}</md-option> </md-select> </md-input-container> <md-input-container class="md-block mt-10 mb-35" flex="95" style="margin-left: 2%;"> <label class="font-size-18 font-weight-300" ng-if="chartType[\'chart_'+cnt+'\'] != \'CustomMap\'">Select Variable For X-Axis</label> <label class="font-size-18 font-weight-300" ng-if="chartType[\'chart_'+cnt+'\'] == \'CustomMap\'">Select Area Code of MAP</label> <md-select ng-model="chartsData.column_one[\'chart_'+cnt+'\']" ng-disabled="disableColumns"><md-option ng-value="0">Select</md-option> <md-option ng-repeat="(key, column) in columns" ng-value="key">{{column}} </md-option> </md-select> </md-input-container><md-input-container class="md-block mv-35" flex="95" style="margin-left: 2%;" ng-if="chartType[\'chart_'+cnt+'\'] == \'CustomMap\'"> <label class="font-size-18 font-weight-300">Select Data To Display on MAP</label> <md-select ng-model="chartsData.viewData[\'chart_'+cnt+'\']" ng-disabled="disableColumns"> <md-option ng-repeat="(key, column) in columns" ng-value="key"> <!-- ng-if="dataset.validated == 1" --> {{column}} </md-option> </md-input-container> <md-input-container class="md-block mv-35" flex="95" style="margin-left: 2%;"> <label class="font-size-18 font-weight-300" ng-if="chartType[\'chart_'+cnt+'\'] != \'CustomMap\'">Select Variables For Y-Axis</label><label class="font-size-18 font-weight-300" ng-if="chartType[\'chart_'+cnt+'\'] == \'CustomMap\'">Values For Display on Tooltip</label> <md-select ng-model="chartsData.columns_two[\'chart_'+cnt+'\']" ng-disabled="disableColumns" multiple> <md-option ng-repeat="(key, column) in columns" ng-value="key">{{column}} </md-option> </md-select> </md-input-container> <md-input-container class="md-block mv-35" flex="95" style="margin-left: 2%;"> <label class="font-size-18 font-weight-300">Select Formula</label> <md-select ng-model="chartsData.formula[\'chart_'+cnt+'\']"> <md-option ng-repeat="(key, value) in {\'no\':\'No Formula\', \'count\':\'Count\',\'addition\':\'Addition\'}" value="{{key}}" ng-selected="key == \'no\'">{{value}}</md-option> </md-select> </md-input-container> <md-input-container class="md-block mv-35" flex="95" style="margin-left: 2%;margin-top: 2.5%; padding-bottom:2%; display:none;"> <label >Visual Setting</label> <textarea name="address" required ng-model="chartsData.visual_settings[\'chart_'+cnt+'\'][0]"></textarea></md-input-container> <md-button class="md-raised md-primary ph-15" ng-click="showCustom($event,\'chart_'+cnt+'\',chartType)"> <md-tooltip md-direction="top" class="md-body-1">Add chart design settings to the dataset</md-tooltip> Chart Design Settings </md-button></div>')($scope));

            $('.chartCount:last').html(parseInt($('.chartCount').length));
            if($scope.chartsData == null){
                $scope.chartsData = {};
                $scope.chartsData.visual_settings = {};
                $scope.chartsData.visual_settings['chart_'+cnt] = {};
            }
            $scope.chartsData.visual_settings['chart_'+cnt] = {};
            $scope.chartsData.visual_settings['chart_'+cnt][0] = window.response.data.default_setting;
        }

        $(document).on('click','.deleteFrame', function(){
            var chart = parseInt($(this).closest('div').find('.chartCount').html());
            if($scope.chartsData != null){
                delete $scope.chartsData.title['chart_'+chart];
                delete $scope.chartsData.formula['chart_'+chart];
                delete $scope.chartsData.column_one['chart_'+chart];
                delete $scope.chartsData.columns_two['chart_'+chart];
                delete $scope.chartsData.visual_settings['chart_'+chart];
            }
            $(this).parent('div').remove(); 
        });
    	
    	$scope.changeDatset = function(){

    		$scope.message = false;
    		$scope.error_message = '';
    	}
        $scope.view_visualization = function(){
            $state.go('app.genvisual_view',{'id':$state.params.id});
        }

        window.$compile = $compile;
        window.$scope = $scope;
    }

    $(document).on('click','.exp_col', function(){
        $(this).parent('div').parent('.frame').css('overflow','hidden');
        if($(this).parent('div').parent('.frame').hasClass('expanded')){
            var elm = $(this);
            $(this).parent('div').parent('.frame').animate({
                'height':'50px'
            },200, function(){
                elm.html($compile('<img src="assets/images/arrow-down.png" style="width:16px;margin-top:5px;transform: rotate(179deg)">')($scope));
            });
            $(this).parent('div').parent('.frame').removeClass('expanded');
        }else{
            var elm = $(this);
            $(this).parent('div').parent('.frame').addClass('expanded');
            $(this).parent('div').parent('.frame').animate({
                'height': $(this).get(0).scrollHeight + 17
            },200, function(){
                $(this).height('auto');
                elm.html('<img src="assets/images/arrow-down.png" style="width:16px;margin-top:5px;">');
            }); 
        }
    });

})();
