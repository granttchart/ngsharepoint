(function (root, factory) {
  'use strict';
  
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (root.hasOwnProperty('angular')) {
    factory(root.angular);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'));
  }
}(this, function(angular) {
    'use strict';
    angular = (angular && angular.module ) ? angular : window.angular;
    return angular.module('ngSharePoint', [])

    .service('SharePointRequest', function($http) {
    	this.doSharePointRequest = function(params) {
    		var defaults = {
    			method: 'GET',
    			headers: {
    				'Accept': 'application/json;odata=verbose',
    				'Content-Type': 'application/json;odata=verbose'
    			}
    		};

    		if (params.intent === 'update') {
    			defaults.method = 'POST';
    			var addHeaders = {
    				'X-HTTP-Method': 'MERGE',
    				'IF-MATCH': '*',
    				'X-RequestDigest': params.formDigest
    			};
    			defaults.headers = angular.extend({}, addHeaders, defaults.headers);
    		}

    		if (params.intent === 'add') {
    			defaults.method = 'POST';
    			var addHeaders = {
    				'X-RequestDigest': params.formDigest
    			};
    			defaults.headers = angular.extend({}, addHeaders, defaults.headers);
    		}

    		if (params.intent === 'formdigest') {
    			defaults.method = 'POST';
    			var addHeaders = {};
    			defaults.headers = angular.extend({}, addHeaders, defaults.headers);
    		}

    		var opts = angular.merge({}, defaults, params);
    		
    		return $http({
    			method: opts.method,
    			url: apiBaseURL + params.URL,
    			headers: opts.headers,
    			data: opts.data
    		});
    	};
    
    })
    
    .service('ngSharePoint', function(SharePointRequest) {
    	this.config = function(params) {
 	    	apiBaseUL : params.apiBaseURL 	    	
 	    };
    	
	    this.get = function(params) {
	    	return SharePointRequest.doSharePointRequest(params);
	    };
	    
	    this.getUserEmail = function() {
			return SharePointRequest.doSharePointRequest({
				URL: 'web/currentuser'
			});
	    };
	   
	    this.getFormDigest = function(params) {
	    	return SharePointRequest.doSharePointRequest({
    			intent: 'formdigest',
    			URL: 'contextinfo'
    		});
	    };

    })
    
}));
