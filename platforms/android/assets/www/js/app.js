// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('yaYasser', ['ionic', 'yaYasser.controllers', 'yaYasser.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.signup', {
      url: "/signup",
      views: {
        'menuContent' :{
          templateUrl: "templates/signup.html",
          controller: 'SignupCtrl'
        }
      }
    })

    .state('app.main', {
      url: "/main",
      views: {
        'menuContent' :{
          templateUrl: "templates/main.html"
        }
      }
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.photos', {
      url: "/photos",
      views: {
        'menuContent' :{
          templateUrl: "templates/my-photos.html",
          controller: 'PhotosCtrl'
        }
      }
    })

    .state('app.singlePhoto', {
      url: "/photo/:photoId",
      views: {
        'menuContent' :{
          templateUrl: "templates/photo.html",
          controller: 'PhotoCtrl'
        }
      }
    })

    .state('app.upload', {
      url: "/upload",
      views: {
        'menuContent' :{
          templateUrl: "templates/upload.html",
          controller: 'UploadCtrl'
        }
      }
    })

    .state('app.capture', {
      url: "/capture",
      views: {
        'menuContent' :{
          templateUrl: "templates/capture.html",
          controller: 'CaptureCtrl'
        }
      }
    })


    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});