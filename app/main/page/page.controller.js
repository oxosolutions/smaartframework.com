(function ()
{
    'use strict';

    angular
        .module('app.page')
        .directive('bindHtmlCompile', ['$compile', function ($compile) {
          return {
            restrict: 'A',
            link: function (scope, element, attrs) {
              scope.$watch(function () {
                return scope.$eval(attrs.bindHtmlCompile);
              }, function (value) {
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
        .controller('PageController', PageController);

    /** @ngInject */
    function PageController($scope, $state, api, $sce){

        var vm = this;
        $scope.isLoading = true;
        api.pages.getBySlug.get({'slug': $state.params.slug}, function(res){
            // console.log(res);
            if(res.records.pages.page_status == 2){
                if(sessionStorage.api_token == '' || sessionStorage.api_token == undefined){
                    $state.go('app.new-login');
                }else{
                    $scope.isLoading = false;
                    $scope.title      = res.records.pages.page_title;
                    $scope.sub_title  = res.records.pages.page_subtitle;
                    $scope.content    = res.records.pages.page_content;
                }
            }else if(res.status == 'success'){
                $scope.isLoading = false;
                $scope.title      = res.records.pages.page_title;
                $scope.sub_title  = res.records.pages.page_subtitle;
                $scope.content    = res.records.pages.page_content;
            }else{
                $state.go('app.page',{'slug':'404'});
            }
        });
    }

})();
