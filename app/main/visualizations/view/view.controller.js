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
        .controller('ViewVisualizationsController', ViewVisualizationsController);

    /** @ngInject */
    function ViewVisualizationsController($scope, $timeout, $mdSidenav, $state, api) {
        var vm = this;
        $scope.showFirst = true;
        google.charts.load('current'); // Don't need to specify chart libraries!
        google.charts.setOnLoadCallback(drawVisualization);

        $scope.drawVisual = function(){
            $scope.procReq = true;
            $scope.pr = true;
            var chartWrapper;

            chartWrapper = new google.visualization.ChartWrapper({
                chartType: 'ColumnChart',
                dataTable: '',
                options: {},
                containerId: 'chart_wrapper',
            });
            var chartAnimation = {
                startup: true, //true/false
                duration: 250, //  in milliseconds
                easing: 'inAndOut' // linear/in/out/inAndOut
            };


            chartWrapper.setOption('animation', chartAnimation);
            chartWrapper.setOption('width', "100%");
            chartWrapper.setOption('height', "400");

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Column');
            data.addColumn('number', 'Count Value');
            var interval = 0;
            var timer = setInterval(function(){
                interval = interval + 0.84;
                $scope.$apply(function () {
                    $scope.percent = interval;
                    $scope.viewpercent = Math.round(interval);
                });
                if(interval >= 100){
                    clearInterval(timer);
                }
            },1000);
            
            var formdata = new FormData();
            formdata.append('columns',$scope.visualization.columny);
            api.postMethod.postColumns(formdata).then(function(res){
                var dataArray = [];
                angular.forEach(res.data.columns[res.data.columns[0]], function(val, ind){
                    var tempArray = [];
                    tempArray.push(ind);
                    tempArray.push(val);
                    dataArray.push(tempArray);
                });
                //console.log(dataArray);
                
                data.addRows(dataArray);
                
                
                chartWrapper.setDataTable(data);
                chartWrapper.draw();
                $scope.percent = 100;
                $scope.viewpercent = 100;
                clearInterval(timer);
                $scope.procReq = false;
                $scope.pr = false;
            });
        }
        if($state.params.state != ''){
            $scope.showFirst = false;
            api.dataset.get420Columns.get({},function(res){
                vm.number_columns = res.columns;
                
            });
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
        }

        function drawVisualization(){
            
            //data.addColumn('string', columnx);
        }

    }

    function checkAuth($state) {

        if (sessionStorage.api_token == undefined || sessionStorage.api_token == '') {

            $state.go('app.new-login');
            return false;
        }
    }
})();