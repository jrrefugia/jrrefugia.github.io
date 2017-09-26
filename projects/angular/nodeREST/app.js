var app = angular.module('jerieApp', ['ui.router']);

/*routes*/
app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
	  url: '/home',
      templateUrl: '/home.html',
      controller: 'customersCtrl'
    });
	
	$stateProvider.state('customer', {
	  url: '/customers/{id}',
	  templateUrl: '/customers.html',
	  controller: 'customersCtrl'
	});

	$urlRouterProvider.otherwise('home');
}]);

/*factories*/
app.factory('customersAPI', ["$http",function($http){
	return {
		getData: function(id){
			id = typeof id != "undefined" ? id : "";
			return $http.get("/api/customers/"+id);
		},
		addData: function(data){
			return $http.post("/api/customers/", data);
		},
		updateData: function(id, data){
			return $http.put("/api/customers/" + id, data);
		},
		deleteData: function(id){
			return $http.delete("/api/customers/" + id);
		}
    };
}]);

/*controllers*/
app.controller('customersCtrl', ['$scope', '$location','$stateParams','customersAPI', function($scope,$location, $stateParams,customersAPI){
	$scope.params = {
		name:"",
		purchases:"",
		url:""
	}
	$scope.fakeArray = [{"_id":"59c6e6f5550beb0233722506","name":"joe","purchases":14,"url":"dsfdsf"},{"_id":"59c6fc4bb70a5224308fcf64","name":"jerie","purchases":13,"url":"sdf","__v":0},{"_id":"59c74cc62f884611f0ef562a","name":"jerie","purchases":516,"url":"google.com","__v":0},{"_id":"59c750efea84112b0073d8fd","name":"jdklfj","purchases":345,"url":"dfs","__v":0},{"_id":"59c7512dea84112b0073d8ff","name":"adsf","purchases":44,"url":"adsf","__v":0},{"_id":"59c758c107b9d02c949e4d45","name":"joe","purchases":252,"url":"shmo","__v":0},{"_id":"59c75f9f29aedc1de07ed79d","name":"killa","purchases":15,"url":"killa","__v":0},{"_id":"59c76255e5b54e2c243d5971","name":"fddsf","purchases":2347654454345355,"url":"asd","__v":0},{"_id":"59c766397ae25e27e09b53b9","name":"mercy","purchases":23,"url":"mercy.com","__v":0},{"_id":"59c767267ae25e27e09b53ba","name":"jerie","purchases":324,"url":"here","__v":0}];
	

	if($stateParams.id){
		/*
		customersAPI.getData($stateParams.id).then(function(response){
			$scope.customer = response.data;
			setScopeParams(response.data);
		});
		*/
		for(index in $scope.fakeArray){
			if($scope.fakeArray[index]._id == $stateParams.id){
				$scope.customer = $scope.fakeArray[index];
				setScopeParams($scope.customer);
				break;
			}
		}
	}else if($stateParams.id != ""){
		/*
		customersAPI.getData().then(function(response){
			$scope.allCustomers = response.data;
		});	
		*/
		$scope.allCustomers = $scope.fakeArray;
	}
	
	$scope.addCustomer = function(){
		if(!scopeParamsIsValid()){return;}
		customersAPI.addData($scope.params).then(function(){
			$location.path('/home');
		});
	}
	$scope.updateCustomer = function(customer){
		if(!scopeParamsIsValid()){return;}
		/*
		customersAPI.updateData(customer._id, $scope.params).then(function(){
			$location.path('/home');
		});
		*/
		
		for(key in $scope.params){
			var value = key == "purchases" ? Number($scope.params[key]) : $scope.params[key];
			$scope.fakeArray[$scope.fakeArray.indexOf($scope.fakeArray[index])][key] = value;
		}
		$location.path('/home');
		
		
		
	}
	$scope.deleteCustomer = function(customer){
		customersAPI.deleteData(customer._id).then(function(){
			$location.path('/home');
		});
	}
	
	$scope.incrementPurchases = function(customer){
		var currentCustomer = $scope.allCustomers[$scope.allCustomers.indexOf(customer)];
		currentCustomer.purchases += 1;
		setScopeParams(currentCustomer);
		$scope.updateCustomer(customer);
	};
	
	function setScopeParams(object){
		for(key in $scope.params){$scope.params[key] = object[key];}
	}
	
	function scopeParamsIsValid(){
		return ($scope.params.name == "" || ($scope.params.purchases == "" || isNaN($scope.params.purchases))) ? false : true;
	}
}]);