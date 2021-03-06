(function() {
    'use strict';

    angular
        .module('app.visualizations.view')
        .directive('bindHtmlCompile', ['$compile', function($compile) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    scope.$watch(function() {
                        return scope.$eval(attrs.bindHtmlCompile);
                    }, function(value) {
                        element.html(value && value.toString());
                        var compileScope = scope;
                        if (attrs.bindHtmlScope) {
                            compileScope = scope.$eval(attrs.bindHtmlScope);
                        }
                        $compile(element.contents())(compileScope);
                    });
                }
            };
        }])
        .controller('ViewVisualController', ViewVisualController);

    /** @ngInject */
    function ViewVisualController($scope, $timeout, $mdSidenav, $state, api, $compile, $mdDialog) {
        var vm = this;
        window.chartWrapper = {};
        window.newTempSettings = {};
        $scope.showFirst = true;
        var chartAnimation;
        $scope.slider = {};
        google.charts.load('current'); // Don't need to specify chart libraries!
        google.charts.setOnLoadCallback(drawVisualization);

        $scope.editName = function(event,datasetID, name) {

              $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,        
                preserveScope: true,           
                templateUrl: 'app/main/visualization/dialogs/edit-visual.html',
                controller: function DialogController($scope, $mdDialog, api) {  
                  $scope.newName = name;                
                  $scope.rename = function(){
                    var formdata = new FormData();
                    formdata.append('id',datasetID);
                    formdata.append('dataset_name',$scope.newName);
                    api.postMethod.renameDataset(formdata).then( function(res){
                        $mdDialog.hide();
                        $scope.dataset_name = $scope.newName;
                    })
                    
                  }
                  $scope.closeDialog = function() {
                    $mdDialog.hide();
                  }
                }
              });
          };

        $scope.drawVisual = function(action){
            
            if(vm.visFilters == undefined && jQuery.isEmptyObject($scope.slider) == true && vm.visFiltersMulti == undefined){
                return false;
            }
            $scope.procReq = true;
            $scope.pr = true;

            var formData = new FormData();
            formData.append('id',$state.params.id);
            if(action == 'filter'){
                formData.append('type','filter');
            }else{
                $scope.vm.visFilters = '';
                $scope.vm.visFiltersMulti = '';
                vm.visFilters = '';
                formData.append('type','non-filter');
            }
            if(jQuery.isEmptyObject($scope.slider) != true){
                var rangesList = {};
                angular.forEach($scope.slider, function(val, key){
                    var sliderRange = {};
                    if(val.min != undefined){
                        sliderRange['min'] = val.min;
                        sliderRange['max'] = val.max;
                        rangesList[key] = sliderRange;
                    }
                });                
                formData.append('range_filters',JSON.stringify(rangesList));
            }
            formData.append('filter_array',JSON.stringify(vm.visFilters));
            formData.append('filter_array_multi',JSON.stringify(vm.visFiltersMulti));
            api.postMethod.getVisual(formData).then(function(res){
                res = res.data;
                // console.log(res);
                $scope.filters = res.filters;
                $("#data_wrapper").text(JSON.stringify(res));
                $scope.charts = [];
                $scope.charts = res;
                
                setTimeout(function(){
                    var index = 1;
                    angular.forEach(res.chart_data, function(ind,val){
                        var chartTypes = JSON.parse(res.chart_types);
                        var options = res.settings;
                        if(chartTypes[val] != 'CustomMap'){
                            chartWrapper['chart_'+index] = new google.visualization.ChartWrapper({
                                chartType: chartTypes[val],
                                dataTable: res.chart_data[val],
                                options: JSON.parse(options[val][0]),
                                containerId: 'chart_wrapper_'+index,
                            });
                            var chartSetoptions = JSON.parse(options[val][0]);
                            chartWrapper['chart_'+index].draw();
                        }else{
                            var chrtData = res.chart_data['chart_'+index];
                            var settings = res.settings['chart_'+index];
                            var chartHeaderArray = chrtData[0];
                            settings = JSON.parse(settings[0]);
                            try{
                                var haxColor = settings['chartColor']['colors']
                            }catch(e){
                                var haxColor = '#ED6F1D';
                            }
                            
                            var hex = haxColor.replace('#','');
                            var r = parseInt(hex.substring(0,2), 16);
                            var g = parseInt(hex.substring(2,4), 16);
                            var b = parseInt(hex.substring(4,6), 16);

                            if(res.map_display_val != null){
                                var stateCode = res.map_display_val;
                                var columnHeaderForSort = res.map_display_val[0];
                                var stateCode_Loop = res.map_display_val;
                            }
                            
                            if($.inArray(columnHeaderForSort, chartHeaderArray) !== -1){
                                var HeaderIndex = chartHeaderArray.indexOf(columnHeaderForSort);
                                var sortedArray = chrtData.sort(function(a, b){
                                    return a[HeaderIndex] - b[HeaderIndex]; 
                                });
                            }else{
                                angular.forEach(res.map_display_val, function(v,k){
                                    if($.isArray(chrtData[k])){
                                        chrtData[k].push(v);
                                    }else{
                                        var tempArray = [];
                                        tempArray.push(chrtData[k]);
                                        tempArray.push(v);
                                        chrtData[k] = tempArray;
                                    }
                                });
                                if(res.map_display_val == null){
                                    var arrayDataForSort = chrtData;
                                    delete arrayDataForSort[0];
                                    var sortedArray = arrayDataForSort.sort(function(a, b){
                                        return a[1] - b[1];
                                    });
                                    var putHeader = [];
                                    putHeader.push('String');
                                    putHeader.push('Frequecy');
                                    sortedArray.unshift(putHeader);
                                }else{
                                    var HeaderIndex = chartHeaderArray.indexOf(columnHeaderForSort);
                                    var sortedArray = chrtData.sort(function(a, b){
                                        return a[HeaderIndex] - b[HeaderIndex]; 
                                    });
                                }
                            }
                            
                            var highest_value = Math.max.apply(Math, stateCode);
                            
                            
                            $('#chart_wrapper_'+index).html($compile(res.maps[val])($scope));
                            var stateInd = 0;
                            var leagend = "<div class='map-leagend'>";
                            angular.forEach(sortedArray, function(val,ind){

                                if(ind != 0){
                                    var currentClass = $('#'+val[0]).attr('class');
                                    
                                    /*$('#'+val[0])
                                    .css({'fill': 'rgba('+r+','+g+','+b+','+(stateCode_Loop[stateInd]/highest_value) +')'}).attr('class','mapArea '+currentClass);*/
                                    var colorVal = stateInd/sortedArray.length;
                                    var leagendWidth = (1/(sortedArray.length-1))*100;
                                    var colorCode = getColor(colorVal);

                                    $('#chart_wrapper_'+index+' #'+val[0])
                                    .css({'fill': colorCode }).attr('class','mapArea '+currentClass);
                                    angular.forEach(val, function(v,i_nd){
                                        if(i_nd > 0){
                                            $('#chart_wrapper_'+index+' #'+val[0]).attr(chrtData[0][i_nd].replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, "_"),v);
                                        }
                                    });
                                    if(res.map_display_val == null){
                                        leagend += '<div data-value="'+val[1]+'" style="width:'+leagendWidth+'%; background-color:'+colorCode+'"></div>';
                                    }else{
                                        leagend += '<div data-value="'+val[HeaderIndex]+'" style="width:'+leagendWidth+'%; background-color:'+colorCode+'"></div>';
                                    }
                                    stateInd++;
                                }
                            });
                            leagend += "</div>";
							leagend += "<div class='smaart-watermark'>Created with <a href='http://smaartframework.com' target='_blank'>SMAART™ Framework</a></div>";
                            $('#cchart_wrapper_'+index).append(leagend);
                            //$(leagend).appendTo('body');
                            
                            $('#chart_wrapper_'+index+' .mapArea').mouseover(function (e) {
                                var elm = $(this);
                                var title=$(this).attr('title');
                                var html = '';
                                html += '<div class="inf">';
                                html += '<span class="title">'+title + '</span>';
                                angular.forEach(chrtData[0], function(v, k_in){
                                    if(k_in > 0){
                                        var atr_id = v.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, "_");
                                        html += '<span class="data">'+v+': '+ elm.attr(atr_id)+'</span>';
                                    }
                                });
                                html += '</div>';
                                $(html).appendTo('body');
                            })
                            .mouseleave(function () {
                                $('.inf').remove();
                            }).mousemove(function(e) {
                                var mouseX = e.pageX, //X coordinates of mouse
                                    mouseY = e.pageY; //Y coordinates of mouse

                                $('.inf').css({
                                    'top': mouseY-($('.inf').height()+30),
                                    'left': mouseX
                                });
                            });
                        }
                        index++;
                    });
                },1);
                setTimeout(function(){
                    var index = 1;
                    angular.forEach(res.chart_data, function(ind,val){
                        var settingButton = '<div layout="row" layout-align="end start" style="margin-top:-2%" class="seting"> <md-button class="md-fab md-mini md-primary" aria-label="settings" ng-click="showCustom($event,\'chart_'+index+'\','+index+')"> <md-tooltip md-direction="top" class="md-body-1"><span class="p-10"> Design setting for this chart</span></md-tooltip><md-icon md-font-icon="icon-cog"><md-tooltip md-direction="top" class="md-body-1"><span class="p-10"> Design setting for this chart</span></md-tooltip></md-icon> </md-button> </div>';
                        
                        $('#chart_wrapper_'+index).prepend($compile(settingButton)($scope));
                        
                        index++;
                    });
                },500);
            });
        }
        function getColor(value){
            //value from 0 to 1
            var hue=((1-value)*50).toString(10);
            return ["hsl(",hue,",100%,50%)"].join("");
        }
        $scope.showFirst = false;
            
        vm.chart_types = [{
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
            }
        ];

        $scope.edit = function(){
            $state.go('app.genvisuals_edit',{'id':$state.params.id});

        }
        $scope.editViz = function(){
            $state.go('app.genvisuals_edit',{'id':$state.params.id});
        }

        function drawVisualization(){

            var formData = new FormData();
            formData.append('id',$state.params.id);
            formData.append('type','non-filter');
            api.postMethod.getVisual(formData).then(function(res){
                window.res = res;
                window.redrawSetting = res;
                res = res.data;
                $scope.showFilter = true;
                $scope.showCharts = true;
                if(res.status == 'error'){
                    $scope.showFilter = false;
                    $scope.filterNotFound = true;
                    $scope.showCharts = false;
                    $scope.noCharts = true;
                    return false;
                }
                $scope.filters = res.filters;
                $("#data_wrapper").text(JSON.stringify(res));
                
                $scope.charts = res;
                // console.log(res);
                setTimeout(function(){
                    var index = 1;
                    angular.forEach(res.chart_data, function(ind,val){
                        var chartTypes = JSON.parse(res.chart_types);
                        var options = res.settings;
                        var titles = res.titles;
                        
                        if(chartTypes[val] != 'CustomMap'){
                            $scope.chart_cont = true;
                            $scope.map_cont = false;
                            chartWrapper['chart_'+index] = new google.visualization.ChartWrapper({
                                chartType: chartTypes[val],
                                dataTable: res.chart_data[val],
                                options: JSON.parse(options[val][0]),
                                containerId: 'chart_wrapper_'+index,
                            });
                            
                            //var chartSetoptions = JSON.parse(options[val][0]);
                            chartWrapper['chart_'+index].draw();
                        }else{
                            
                            var chrtData = res.chart_data['chart_'+index];
                            var settings = res.settings['chart_'+index];
                            var chartHeaderArray = chrtData[0];
                            settings = JSON.parse(settings[0]);
                            try{
                                var haxColor = settings['chartColor']['colors']
                            }catch(e){
                                var haxColor = '#ED6F1D';
                            }
                            
                            var hex = haxColor.replace('#','');
                            var r = parseInt(hex.substring(0,2), 16);
                            var g = parseInt(hex.substring(2,4), 16);
                            var b = parseInt(hex.substring(4,6), 16);

                            if(res.map_display_val != null){
                                var stateCode = res.map_display_val;
                                var columnHeaderForSort = res.map_display_val[0];
                                var stateCode_Loop = res.map_display_val;
                            }
                            


                            /*console.log(chartHeaderArray);
                            return false;*/
                            if($.inArray(columnHeaderForSort, chartHeaderArray) !== -1){
                                var HeaderIndex = chartHeaderArray.indexOf(columnHeaderForSort);
                                var sortedArray = chrtData.sort(function(a, b){
                                    return a[HeaderIndex] - b[HeaderIndex]; 
                                });
                            }else{
                                angular.forEach(res.map_display_val, function(v,k){
                                    if($.isArray(chrtData[k])){
                                        chrtData[k].push(v);
                                    }else{
                                        var tempArray = [];
                                        tempArray.push(chrtData[k]);
                                        tempArray.push(v);
                                        chrtData[k] = tempArray;
                                    }
                                });
                                if(res.map_display_val == null){
                                    var arrayDataForSort = chrtData;
                                    delete arrayDataForSort[0];
                                    var sortedArray = arrayDataForSort.sort(function(a, b){
                                        return a[1] - b[1]; 
                                    });
                                    var putHeader = [];
                                    putHeader.push('String');
                                    putHeader.push('Frequecy');
                                    sortedArray.unshift(putHeader);
                                }else{
                                    var HeaderIndex = chartHeaderArray.indexOf(columnHeaderForSort);
                                    var sortedArray = chrtData.sort(function(a, b){
                                        return a[HeaderIndex] - b[HeaderIndex]; 
                                    });
                                }
                                
                            }
                            var highest_value = Math.max.apply(Math, stateCode);
                            
                            $scope.chart_cont = false;
                            $scope.map_cont = true;
                           
                            $('#chart_wrapper_'+index).html($compile(res.maps[val])($scope));
                            var stateInd = 0;
							var leagend = "<div class='map-leagend'>";
                            angular.forEach(sortedArray, function(val,ind){

                                if(ind != 0){
                                    var currentClass = $('#'+val[0]).attr('class');
                                    
                                    /*$('#'+val[0])
                                    .css({'fill': 'rgba('+r+','+g+','+b+','+(stateCode_Loop[stateInd]/highest_value) +')'}).attr('class','mapArea '+currentClass);*/
                                    var colorVal = stateInd/sortedArray.length;
									var leagendWidth = (1/(sortedArray.length-1))*100;
									var colorCode = getColor(colorVal);

                                    $('#chart_wrapper_'+index+' #'+val[0])
                                    .css({'fill': colorCode }).attr('class','mapArea '+currentClass);
                                    angular.forEach(val, function(v,i_nd){
                                        if(i_nd > 0){
                                            $('#chart_wrapper__'+index+' #'+val[0]).attr(chrtData[0][i_nd].replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, "_"),v);
                                        }
                                    });
                                    if(res.map_display_val == null){
    									leagend += '<div data-value="'+val[1]+'" style="width:'+leagendWidth+'%; background-color:'+colorCode+'"></div>';
                                    }else{
                                        leagend += '<div data-value="'+val[HeaderIndex]+'" style="width:'+leagendWidth+'%; background-color:'+colorCode+'"></div>';
                                    }
                                    stateInd++;
                                }
                            });
							leagend += "</div>";
							leagend += "<div class='smaart-watermark'>Created with <a href='http://smaartframework.com' target='_blank'>SMAART™ Framework</a></div>";
                            $('#custom_map_wrapper_'+index).append(leagend);
							//$(leagend).appendTo('body');
							
                            $('#chart_wrapper_'+index+' .mapArea').mouseover(function (e) {
                                var elm = $(this);
                                var title=$(this).attr('title');
                                var html = '';
                                html += '<div class="inf">';
                                html += '<span class="title">'+title + '</span>';
                                angular.forEach(chrtData[0], function(v, k_in){
                                    if(k_in > 0){
                                        var atr_id = v.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, "_");
                                        html += '<span class="data">'+v+': '+ elm.attr(atr_id)+'</span>';
                                    }
                                });
                                html += '</div>';
                                $(html).appendTo('body');
                            })
                            .mouseleave(function () {
                                $('.inf').remove();
                            }).mousemove(function(e) {
                                var mouseX = e.pageX, //X coordinates of mouse
                                    mouseY = e.pageY; //Y coordinates of mouse

                                $('.inf').css({
                                    'top': mouseY-($('.inf').height()+30),
                                    'left': mouseX
                                });
                            });

                        }
                        index++;
                    });
                },5);
                setTimeout(function(){
                    var index = 1;
                    angular.forEach(res.chart_data, function(ind,val){
                        var settingButton = '<div layout="row" layout-align="end start" style="margin-top:-2%" class="seting"> <md-tooltip md-direction="top" class="md-body-1"><span class="p-10"> Design setting for this chart</span></md-tooltip><md-button class="md-fab md-mini md-primary" aria-label="settings" ng-click="showCustom($event,\'chart_'+index+'\','+index+')"> <md-icon md-font-icon="icon-cog"></md-icon> </md-button> </div>';
                        $('#chart_wrapper_'+index).prepend($compile(settingButton)($scope));
                        index++;
                    });
                },3000);
            });
            
        }

        $scope.showCustom = function(event, chart, ind) {
            $mdDialog.show({
              clickOutsideToClose: true,
              scope: $scope,        
              preserveScope: true,           
              templateUrl: 'app/main/visualizations/generated/edit/dialogs/visual-setting.html',
              controller: function DialogController($scope, $mdDialog, $state, api) {
                 $scope.closeDialog = function() {
                    $mdDialog.hide();
                 }
                 setTimeout(function(){
                    if(newTempSettings[chart] == '' || newTempSettings[chart] == undefined){
                        $scope.visualSettings.chart_settings = JSON.parse(window.res.data.settings[chart][0]);
                    }else{
                        $scope.visualSettings.chart_settings = newTempSettings[chart];
                    }
                 },1);
                 var chartSetting = JSON.parse(window.res.data.default_settings);
                 $scope.settings = chartSetting;
                 $scope.saveVisualSettings = function(){
                    if($scope.visualSettings.chart_settings.colors == undefined || $scope.visualSettings.chart_settings.colors == ''){
                        delete $scope.visualSettings.chart_settings.colors;
                    }else{
                        var clrs = ($scope.visualSettings.chart_settings.colors).split(',');
                        $scope.visualSettings.chart_settings.colors = clrs.trim();

                    }
                    newTempSettings[chart] = $scope.visualSettings.chart_settings;
                    var formData = new FormData();
                    formData.append('chart',chart);
                    formData.append('settings',JSON.stringify($scope.visualSettings.chart_settings));
                    formData.append('visual_id',$state.params.id);
                    api.postMethod.saveSettings(formData).then(function(res){
                        if(res.data.status == 'success'){
                            chartWrapper['chart_'+ind].setOptions($scope.visualSettings.chart_settings);
                            chartWrapper['chart_'+ind].draw();
                            $mdDialog.hide();
                        }
                    });
                 }
              }
           });
        };

        $scope.setVisualizationType = function() {
            var chart_type = $scope.visualization.charttype;
            chartWrapper.setChartType(chart_type);
            chartWrapper.draw();
        }

    }


    function checkAuth($state) {

        if (sessionStorage.api_token == undefined || sessionStorage.api_token == '') {

            $state.go('app.new-login');
            return false;
        }
    }
        /*function transpose(a) {
            var w = a.length ? a.length : 0,
            h = a[0] instanceof Array ? a[0].length : 0;
            if(h === 0 || w === 0) { return []; }
            var i, j, t = [];
            for(i=0; i<h; i++) {
                t[i] = [];
                for(j=0; j<w; j++) {
                    t[i][j] = a[j][i];
                }
            }
            return t;
        }*/
})();