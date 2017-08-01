(function() {
    'use strict';
    angular.module('myApp', [
            'appconfig',
            'ngStorage',
            'ui.router',
        ])
        .constant('CommonParms', { // 声明一个常量，用于统一分页设置
            pageSizes: ['1', '10', '16', '20', '50'],
            pageSize: '16',
            i18n: 'zh-cn',
        })
        .constant('validRegex', { // 声明一个常量，用于统一验证配置，正则
            Regex_Name: /^[a-zA-Z][a-zA-Z0-9_@]{0,30}$/, // 用户名
            Regex_NickName: /^[\u4E00-\u9FA5A-Za-z0-9_\-]+$/, // 中文/英文/数字， (昵称、组名、朋友备注名、内容名称、书名、页名) 
            Regex_Phone: /^0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/, // 手机号
            Regex_Card: /\\d{14}[[0-9],0-9xX]/, // 身份证号 
            Regex_Email: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/, // 邮箱

            Regex_RealName: /^[a-zA-Z\u4e00-\u9fa5]{0,}$/, // 真实姓名、朋友昵称、朋友全称、组名称、组标签
            Regex_text: /^[\u4e00-\u9fa5]{0,}$/, // 地区 、省份、城市
            Regex_num: /^\-?\d*$/
        })
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$sceDelegateProvider',
            function($stateProvider, $urlRouterProvider, $httpProvider,$sceDelegateProvider) {
                $urlRouterProvider.when("", "/index"); // 配置默认路由
                // 配置一些路由
                $stateProvider
                    .state('index', { // 简单多级路由写法
                        url: '/index',
                        views: {
                            '': {
                                templateUrl: 'app/home/home.html'
                            },
                            'main@index': {
                                templateUrl: 'app/index/index.html'
                                //templateUrl: 'app/home/main.html'
                            },
                            'header@index': {
                                templateUrl: 'app/header/header.html'
                            },
                            'footer@index': {
                                templateUrl: 'app/header/footer.html'
                            }
                        }
                    });


                $stateProvider
                    .state('index.about', { // 另外一个多级路由，分级写法
                        url: '/about',
                        templateUrl: 'app/about/about.html'
                    })
                    .state('index.developers', {
                        url: '/developers',
                        views:{
                            '':{
                                templateUrl: 'app/developers/developers.html'
                            },
                            'footer@index.developers': {
                                templateUrl: 'app/header/footer.html'
                            }
                        }
                    })
                    .state('test', { // 新建一个主路由
                        url: '/test',
                        templateUrl: 'app/other/test.html'
                    })
                    ;


                // 截取所有http请求，并做一些事情
                $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
                    return {
                        'request': function(config) { 
                            // 给所有request请求增加请求头
                            //console.log($localStorage.token);
                            config.headers = config.headers || {};
                            if ($localStorage.token) {
                                config.headers.Authorization = 'Bearer ' + $localStorage.token;
                            }
                            return config;  
                        },
                        'responseError': function(response) {
                            // 捕获失败响应
                            //console.log(response); 
                            if(response.status === 401 ){ 
                                //alert('身份验证失败');
                                delete $localStorage.token;
                                delete $localStorage.currentuser;

                                console.log('delete $localStorage.token');
                                //$location.path('/index/login');
                            }
                            if ( response.status === 403 || response.status === 0) {
                                delete $localStorage.token;
                                delete $localStorage.currentuser;

                                console.log('delete $localStorage.token');
                                $location.path('/index/login');
                            }
                            return $q.reject(response);
                        }
                    };
                }]);

            }
        ])
        .run(function($rootScope, $state, $stateParams, $location, $localStorage, validRegex) {
            // angularjs入口函数，这里可声明一些全局变量
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            //console.log(validRegex);
            $rootScope.validRegex = validRegex; // 初始化全局变量组
            $rootScope.loading_text = '加载中...';
            //$rootScope.options.minLength = [Number, 3];

            $rootScope.$on("$routeChangeStart", function(event, next) {
                if ($localStorage.token == null) {
                    if (next.templateUrl === "partials/restricted.html") {
                        console.log('next.templateUrl');
                        window.location = '/';
                    }
                }
            });
        })
        .filter('trustHtml', function($sce) { // sce处理，用于安全绑定html
            return function(input) {
                return $sce.trustAsHtml(input);
            }
        })
    ;
})();
