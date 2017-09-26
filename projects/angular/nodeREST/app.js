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
	function findCustomerIndex(id){
		for(index in fakeDataArray){
			if(fakeDataArray[index]._id == id){
				return index;
				break;
			} 
		}
	}
	var fakeDataArray = [{
	    "_id": "59c6e6f5550beb0233722506",
	    "name": "jerie",
	    "purchases": 14,
	    "email": "jerie@gmail.com"
	}, {
	    "_id": "59c6fc4bb70a5224308fcf64",
	    "name": "christa",
	    "purchases": 13,
	    "email": "christa@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c74cc62f884611f0ef562a",
	    "name": "bunky",
	    "purchases": 516,
	    "email": "bunky@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c750efea84112b0073d8fd",
	    "name": "chris",
	    "purchases": 345,
	    "email": "chris@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c7512dea84112b0073d8ff",
	    "name": "lynn",
	    "purchases": 44,
	    "email": "lynn@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c758c107b9d02c949e4d45",
	    "name": "joe",
	    "purchases": 252,
	    "email": "joe@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c75f9f29aedc1de07ed79d",
	    "name": "amy",
	    "purchases": 15,
	    "email": "amy@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c76255e5b54e2c243d5971",
	    "name": "john",
	    "purchases": 2345,
	    "email": "john@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c766397ae25e27e09b53b9",
	    "name": "mercy",
	    "purchases": 23,
	    "email": "mercy@gmail.com",
	    "__v": 0
	}, {
	    "_id": "59c767267ae25e27e09b53ba",
	    "name": "rob",
	    "purchases": 324,
	    "email": "rob@gmail.com",
	    "__v": 0
	}];
	
	return {
		getData: function(id){
			id = typeof id != "undefined" ? id : "";
			if(id == ""){
				return fakeDataArray;
			}else{
				return fakeDataArray[findCustomerIndex(id)];
			}
			//return $http.get("/api/customers/"+id);
		},
		addData: function(data){
			var d = new Date();
			var n = d.getTime();
			var object = {
				_id: String(n),
				__v: 0
			}
			for(key in data){
				object[key] = key == "purchases" ? Number(data[key]) : data[key];				
			}
			fakeDataArray.push(object);
			
			//return $http.post("/api/customers/", data);
		},
		updateData: function(id, data){
			for(key in data){
				fakeDataArray[findCustomerIndex(id)][key] = data[key];
			}
			//return $http.put("/api/customers/" + id, data);
		},
		deleteData: function(id){
			fakeDataArray.splice(findCustomerIndex(id), 1);
			//return $http.delete("/api/customers/" + id);
		}
    };
}]);

/*controllers*/
app.controller('customersCtrl', ['$scope', '$location','$stateParams','customersAPI', function($scope,$location, $stateParams,customersAPI){
	$scope.params = {
		name:"",
		purchases:"",
		email:""
	}

	if($stateParams.id){
		/*
		customersAPI.getData($stateParams.id).then(function(response){
			$scope.customer = response.data;
			setScopeParams(response.data);
		});
		*/		
		$scope.customer = customersAPI.getData($stateParams.id);
		setScopeParams($scope.customer);
	}else if($stateParams.id != ""){
		/*
		customersAPI.getData().then(function(response){
			$scope.allCustomers = response.data;
		});
		*/
		$scope.allCustomers = customersAPI.getData();
	}
	
	$scope.addCustomer = function(){
		if(!scopeParamsIsValid()){return;}
		/*
		customersAPI.addData($scope.params).then(function(){
			$location.path('/home');
		});
		*/
		customersAPI.addData($scope.params);
		$location.path('/home');
		
	}
	$scope.updateCustomer = function(customer){
		if(!scopeParamsIsValid()){return;}
		/*
		customersAPI.updateData(customer._id, $scope.params).then(function(){
			$location.path('/home');
		});
		*/
		customersAPI.updateData(customer._id, $scope.params);
		$location.path('/home');
	}
	$scope.deleteCustomer = function(customer){
		/*
		customersAPI.deleteData(customer._id).then(function(){
			$location.path('/home');
		});
		*/
		customersAPI.deleteData(customer._id);
		$location.path('/home');
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