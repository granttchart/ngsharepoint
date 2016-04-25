//fix attachEvent error on SharePoint pages
if (typeof browseris !== 'undefined') {
	browseris.ie = false;
}

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

				if (params.intent === 'delete') {
					defaults.method = 'DELETE';
					var addHeaders = {
						'X-HTTP-Method': 'DELETE',
						'IF-MATCH': '*',
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

		.factory('ngSharePoint', function(SharePointRequest) {
        	 return {
        		get: function(params) {
        			return SharePointRequest.doSharePointRequest(params)
        			.then(function(response) {
    	                return response.data.d.results;
    	            	});
     		    	},

     		    getItem: function(params) {
    		    	return SharePointRequest.doSharePointRequest(params)
    		    	.then(function(response) {
    		    		return response.data.d;
   	                	});
    		    	},

		    		addListItem: function(params) {
         		    return SharePointRequest.doSharePointRequest({
         		    	URL: params.URL,
         		    	intent: 'add',
         		    	data: params.data,
         		    	formDigest: params.formDigest
         		    }).then(function(response) {
         		    	return response;
       	             	});
        		   	 },

         		updateListItem: function(params) {
         		    return SharePointRequest.doSharePointRequest({
         		    	URL: params.URL,
         		    	intent: 'update',
         		    	data: params.data,
         		    	formDigest: params.formDigest
         		    }).then(function(response) {
         		    	return response;
       	             	});
        		   	 },

					 deleteListItem: function(params) {
							 return SharePointRequest.doSharePointRequest({
								 URL: params.URL,
								 intent: 'delete',
								 data: params.data,
								 formDigest: params.formDigest
							 }).then(function(response) {
								 return response;
										 });
								},

     		   	getUserName: function() {
        			return SharePointRequest.doSharePointRequest({
        				URL: 'web/currentuser'
        			}).then(function(response) {
        				return response.data.d.Title.toLowerCase();
        			});
        			 },

        	   getUserEmail: function() {
        			 return SharePointRequest.doSharePointRequest({
        					URL: 'web/currentuser'
        				}).then(function(response) {
        	                return response.data.d.Email;
        	            });
        	        },

        	   getFormDigest: function(params) {
        		    	return SharePointRequest.doSharePointRequest({
        	    			intent: 'formdigest',
        	    			URL: 'contextinfo'
        	    		}).then(function(response) {
        	                return {
        	                	formDigest: response.data.d.GetContextWebInformation.FormDigestValue,
        	                	formDigestExpiry: response.data.d.GetContextWebInformation.FormDigestTimeoutSeconds
        	                }
        	            });
        		    }
        	    };
        })

        .filter('cleanSystemName', function() {
        	return function(item) {
        		if (item) {
        			var name = item.split(',');
        			return $.trim(name[1] + ' ' + name[0]);
        		}
        	}
        })
}));
