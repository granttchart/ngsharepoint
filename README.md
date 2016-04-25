ngsharepoint extends Angular's $http service to make CRUD actions via SharePoint's REST API less verbose and more DRY.

# Getting Started
1. Add `angular-sharepoint.js` to your project page:
    `<script src="angular-sharepoint.js"></script>`
2. Inject `ngSharePoint` into your Angular module:
    `angular.module('myApp', ['ngSharePoint']);`
3. Declare a global apiBaseURL variable as a default prefix to all REST requests:
    `var apiBaseURL = 'http://mysite/_api/';`

# Helper Functions

## Get a List Item
		ngSharePoint.getItem({
			URL: "web/lists(guid'2F7B91BC-90F1-47E7-901A-71300161F60C')/items("+ id +")"
		}).then(function(response) {
		  var listItemData = response;
		}).catch(function(problemo) {
		  //deal with errors
		});

## Get Multiple Items
		ngSharePoint.get({
			URL: "web/lists(guid'69E8A64D-8F59-4C33-9625-803C9F0DFD0C')/items/"
		}).then(function(response) {
			var myListData = response;
		}).catch(function(problemo) {
		  //deal with errors
		});

## Get Current User Email
      ngSharePoint.getUserEmail().then(function(response) {
	      var userEmail = response;
	    }).catch(function(problemo) {
	    	//deal with errors
	    });
	    
## Get Current User Name
	    ngSharePoint.getUserEmail().then(function(response) {
	      var userEmail = response;
	    }).catch(function(problemo) {
	    	//deal with errors
	    });
	    
## Get a Form Digest
        ngSharePoint.getFormDigest().then(function(response) {
          sessionFormDigest = response.formDigest;
          sessionFormDigestExpiry = response.formDigestExpiry;
        }).catch(function(problemo) {
          //deal with errors
        });

## Create New List Item
Note: Create and Delete actions require a form digest.

        ngSharePoint.addListItem({
              formDigest: sessionFormDigest,
              URL: "web/lists(guid'2F7B91BC-90F1-47E7-901A-71300161F60C')/items",
              data: JSON.stringify({ '__metadata': { 'type': 'SP.Data.MyListListItem' },
            	  'myDataKey': myDataValue,
            	  'mySecondDataKey': mySecondDataValue})
            }).then(function() {
              //handle successful add
            }).catch(function(problemo) {
            	//deal with errors
            });

## Update List Item

		ngSharePoint.updateListItem({
			URL: "web/lists(guid'2F7B91BC-90F1-47E7-901A-71300161F60C')/items("+ id +")",
			data: JSON.stringify({ '__metadata': { 'type': 'SP.Data.MyListListItem' }, 'myDataKey': myDataValue}),
			formDigest: $scope.formDigest
		}).then(function(response) {
		  //handle successful update
		}).catch(function(problemo) {
			//deal with errors
		});

## Filter: Reformat Active Directory Name
Use the `cleanSystemName` filter in a user name variable to reformat an Active Directory name from "Doe, John H" to "John H Doe".
