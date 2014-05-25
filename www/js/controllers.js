angular.module('yaYasser.controllers', [])

.controller('AppCtrl', function($scope, $location) {

    $scope.pictureSource;   // picture source
    $scope.destinationType; // sets the format of returned value

		$scope.caption = '';
    $scope.currentLatLng = '';
    $scope.currentAddress = '';

    // Wait for device API libraries to load
    
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("offline", checkConnection, false);

    // device APIs are available
    //
    function onDeviceReady() {
        $scope.pictureSource = navigator.camera.PictureSourceType;
        $scope.destinationType = navigator.camera.DestinationType;

        // Check login first
        chkLoggedIn();

        // Get current location
        $scope.getCurrentPosition();

    //     Instagram.isInstalled(function (err, installed) {
				//     if (installed) {
				//         alert("Instagram is installed");
				//     } else {
				//         alert("Instagram is not installed");
				//     }
				// });
    }

    /* Check internet connection */
    function checkConnection(e) {
    	if (navigator.connection.type == Connection.NONE) {
    		navigator.notification.alert('No Internet Connection.');
    		return;
    		// navigator.app.exitApp();
    	}
    }

    /* Authentication */
    $scope.isLoggedIn = function() {

    	if (window.localStorage["loggedIn"] != undefined && window.localStorage["hash"] != undefined 
    		&& window.localStorage["loggedIn"] == 'yes') {
    		return true;
			} else {
    		return false;
			}
		};

    /* Authentication */
    function chkLoggedIn() {
    	if ($scope.isLoggedIn()) {
				$location.path('/app/main');
			} else {
				$location.path('/app/login');
			}
		};

		$scope.logout = function() {
			window.localStorage["loggedIn"] = 'no';
			window.localStorage["hash"] = '';

			$location.path('/app/main');
		};

    // Called when a photo is successfully retrieved
    //
    $scope.onPhotoDataSuccess = function(imageData) {
      var img_upload = document.getElementById('img-upload');
      img_upload.src = "data:image/jpeg;base64," + imageData;
    };

    // Called when a photo is successfully retrieved
    //
    $scope.onPhotoURISuccess = function(imageURI) {
    	$scope.imageURI = '';
      var img_upload = document.getElementById('img-upload');
      img_upload.src = imageURI;
      $scope.imageURI = imageURI;
    };

    // Capture photo
    $scope.capturePhoto = function() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture($scope.onPhotoURISuccess, $scope.onSilentFail, { quality: 50,
        destinationType: $scope.destinationType.FILE_URI, encodingType: Camera.EncodingType.JPEG });

                // sourceType: Camera.PictureSourceType.CAMERA
    };

    // Get photo
    $scope.getPhoto = function(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture($scope.onPhotoURISuccess, $scope.onSilentFail, { quality: 50,
        destinationType: $scope.destinationType.FILE_URI,
        sourceType: source });
    };


    // Called if something bad happens.
    //
    $scope.onFail = function(error) {
    	// TODO: vibrate...
    	navigator.notification.vibrate(800);
      navigator.notification.alert('Failed because: ' + error.message);
      return;
    };

    $scope.onError = function(error) {
    	// TODO: vibrate...
    	navigator.notification.vibrate(800);
      navigator.notification.alert('Failed because: ' + error);
      return;
    };

    $scope.onSilentFail = function(error) {
      $location.path('/app/home');
    };

    $scope.onSuccess = function(message) {
      navigator.notification.alert(message);
    };

		$scope.getCurrentPosition = function() {
			navigator.geolocation.getCurrentPosition($scope.onGeolocationSuccess, $scope.onFail, {enableHighAccuracy: true });
		};

		$scope.onGeolocationSuccess = function(position) {
			$scope.currentLatLng = position.coords.latitude + ',' + position.coords.longitude;
			// TODO: Get address - Geocode it!
    };


})

.controller('PhotosCtrl', function($scope, $http, $location, LoaderService) {

	if (!$scope.isLoggedIn()) {
		// Go to login
		$location.path('/app/login');
		return;
	}

	LoaderService.show();
	$http.jsonp('http://yayasser.eu1.frbit.net/app/photos?callback=JSON_CALLBACK', {params: {hash: window.localStorage["hash"]}})
		.success(function(data){
			$scope.photos = data;
			LoaderService.hide();
		})
		.error(function(data) {
			LoaderService.hide();
			$scope.onError(data);
		});

})

.controller('PhotoCtrl', function($scope, $http, $location, $stateParams, LoaderService) {


 //  var Base64 = {
	//     getBase64ImageFromInput : function (input, callback) {
	//         var imageReader = new FileReader();
	//         imageReader.onloadend = function (evt) {
	//             if (callback)
	//                 callback(evt.target.result);
	//         };
	//         //Start the asynchronous data read.
	//         imageReader.readAsDataURL(input);
	//     },
	//     formatImageSrcString : function (base64) {
	//         return (base64.match(/(base64)/))? base64 : "data:image/jpeg;base64," + base64;
	//     } 
	// };

 //  function encodeImageUri(imageUri)
	// {
	// 	alert('encoding...');
	// 	// Base64.getBase64ImageFromInput(imageUri, function (imageData) {
	// 	// 	alert(imageUri);
 //  //       return imageData;
 //  //   });
	// };

	LoaderService.show();
	$http.jsonp('http://yayasser.eu1.frbit.net/app/photos/' + $stateParams.photoId + '?callback=JSON_CALLBACK', {params: {hash: window.localStorage["hash"]}})
		.success(function(data){
			$scope.photo = data;
			LoaderService.hide();
		})
		.error(function(data) {
			LoaderService.hide();
			$scope.onError(data);
		});
})

.controller('CaptureCtrl', function($scope, $location, $stateParams, LoaderService) {

	$scope.capturePhoto();
	// $scope.getCurrentPosition();

  function clearCache() {
	  navigator.camera.cleanup();
	}

	function win(r) {
		clearCache();
		navigator.notification.beep(1);
		LoaderService.hide();
		navigator.notification.alert('Photo uploaded successfully');
		$location.path('/app/photos');
	}

	function uploadError(error) {
			LoaderService.hide();
    	navigator.notification.vibrate(800);
      navigator.notification.alert('Failed because: ' + angular.toJson(error));
      return;
	}

  // Uplaod photo
  $scope.uploadPhoto = function() {

  	LoaderService.show();

  	imageURI = $scope.imageURI;
  	var options = new FileUploadOptions();
  	options.fileKey = "file";
  	options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
  	options.mimeType = "image/jpeg";

  	var params = new Object();
		params.creator = "YaYasser";
		params.hash = window.localStorage["hash"];
		params.caption = document.getElementById('elm-caption').value;
		params.lat_lng = $scope.currentLatLng;

  	options.params = params;
  	options.chunkedMode = false;

  	var ft = new FileTransfer();
  	ft.upload(imageURI, "http://yayasser.eu1.frbit.net/upload.php", win, uploadError, options);
  };

	// Handle uploading the photo

})

.controller('UploadCtrl', function($scope, $location, $stateParams, LoaderService) {
	if (!$scope.isLoggedIn()) {
		// Go to login
		$location.path('/app/login');
		return;
	}

	// $scope.getCurrentPosition();
	$scope.getPhoto($scope.pictureSource.SAVEDPHOTOALBUM);

	function win(r) {
		navigator.notification.beep(1);
		LoaderService.hide();
		navigator.notification.alert('Photo uploaded successfully');
		$location.path('/app/photos');
	}

	function uploadError(error) {
			LoaderService.hide();
    	navigator.notification.vibrate(800);
      navigator.notification.alert('Failed because: ' + angular.toJson(error));
      return;
	}

  // Uplaod photo
  $scope.uploadPhoto = function() {

  	LoaderService.show();

  	imageURI = $scope.imageURI;
  	var options = new FileUploadOptions();
  	options.fileKey = "file";
  	options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
  	options.mimeType = "image/jpeg";

  	var params = new Object();
		params.creator = "YaYasser";
		params.hash = window.localStorage["hash"];
		params.caption = document.getElementById('elm-caption').value;
		params.lat_lng = $scope.currentLatLng;

  	options.params = params;
  	options.chunkedMode = false;

  	var ft = new FileTransfer();
  	ft.upload(imageURI, "http://yayasser.eu1.frbit.net/upload.php", win, uploadError, options);
  };	
})

/* User controllers */

.controller('SignupCtrl', function($scope, $location, $http, LoaderService) {

	$scope.user = {
		fullname: null,
		email: null,
		password: null,
		password_confirmation: null
	};

	$scope.signUp = function() {

		if(!$scope.user.fullname) {
      navigator.notification.alert('fullname is required');
      return;
    }

		if(!$scope.user.email) {
      navigator.notification.alert('email is required');
      return;
    }

    if(!$scope.user.password) {
      navigator.notification.alert('password is required');
      return;
    }

    if(!$scope.user.password_confirmation) {
      navigator.notification.alert('password confirmation is required');
      return;
    }

    if($scope.user.password != $scope.user.password_confirmation) {
      navigator.notification.alert('password confirmation should match the password');
      return;
    }

    LoaderService.show();

		// $http.jsonp('http://yayasser.dev/app/users/signup?callback=JSON_CALLBACK', {params: $scope.user})
			$http.jsonp('http://yayasser.eu1.frbit.net/app/users/signup?callback=JSON_CALLBACK', {params: $scope.user})
				.success(function(data){
					LoaderService.hide();
					if (data.status == 200) {
						// $scope.onSuccess(data.message);

						// Go to login
						$location.path('/app/login');
					} else if (data.status == 500) {
						$scope.onError(data.error);
					}
			})
				.error(function(data) {
					LoaderService.hide();
					$scope.onError(data);
				});
	};
	
})

.controller('LoginCtrl', function($scope, $location, $http, LoaderService) {

	$scope.user = {
		email: null,
		password: null
	};

	$scope.login = function() {

		if(!$scope.user.email) {
      navigator.notification.alert('email is required');
      return;
    }
    if(!$scope.user.password) {
      navigator.notification.alert('password is required');
      return;
    }

    LoaderService.show();

		// $http.jsonp('http://yayasser.dev/app/users/login?callback=JSON_CALLBACK', {params: $scope.user})
			$http.jsonp('http://yayasser.eu1.frbit.net/app/users/login?callback=JSON_CALLBACK', {params: $scope.user})
				.success(function(data){
					LoaderService.hide();
					if (data.status == 200) {
						// $scope.onSuccess(data.message);
						navigator.notification.beep(1);

						// TODO: Get hash
						window.localStorage["loggedIn"] = 'yes';
						window.localStorage["hash"] = data.hash;

						// Go to my photos
						$location.path('/app/photos');
					} else if (data.status == 500) {
						$scope.onError(data.error);
					}
			})
				.error(function(data) {
					LoaderService.hide();
					$scope.onError(data);
				});

	};

})


;