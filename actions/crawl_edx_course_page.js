'use strict';

/**
 * @param Horseman
 *            phantomInstance
 * @param string
 *            query
 * @param string
 *            password
 * @param string
 *            repository
 */
module.exports = function (horseman, url, output_file) {

	console.log('Getting links from: ', url);
	
	var fs = require('fs');
	
	horseman
		.open(url)

		// Optionally, determine the status of the response
		.status()
		.then(function (statusCode) {
			console.log('HTTP status code: ', statusCode);
		  	if (Number(statusCode) >= 400) {
		  		throw 'Page failed with status: ' + statusCode;
		  	}
		})
        
		// Interact with the page. This code is run in the browser.
		.evaluate(function () {
			$ = window.$ || window.jQuery;
        
			// Return a single result object with properties for
			// whatever intelligence you want to derive from the page
			var result = {
			};
		  			
			// extract titles
			$('.course-intro-heading').each(function (i, el) {
				result.title = $(el).text()
			});

			// extract description
			$('.see-more-content').each(function (i, el) {
				result.description = $(el).text()
			});

			/*$('.content-block li[data-field~=length] .block-list__desc').each(function (i, el) {
				result.duration = $(el).text()
			});

			$('.content-block li[data-field~=school] .block-list__desc').each(function (i, el) {
				result.institution = $(el).text()
			});*/
			
			return result;
			
		})
		.then(function (result) {
			
			fs.appendFile(output_file, "," + JSON.stringify(result, null, 4));
			console.log('Success!');
			
		})
		.catch(function (err) {
			console.log('Error: ', err);
		})
		
		// Always close the Horseman instance, or you might end up with orphaned
		// phantom processes
		.close();
	
		
};