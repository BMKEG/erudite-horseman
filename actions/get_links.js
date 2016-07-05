'use strict';

/**
 * @param Horseman phantomInstance
 * @param string url
 */
module.exports = function (phantomInstance, url) {

  if (!url || typeof url !== 'string') {
    throw 'You must specify a url to gather links';
  }

  console.log('Getting links from: ', url);

  phantomInstance
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
        links: []
      };

      if ($) {
        $('a').each(function (i, el) {
          var href = $(el).attr('href');
          if (href) {
            if (!href.match(/^(#|javascript|mailto)/) && result.links.indexOf(href) === -1) {
              result.links.push(href);
            }
          }
        });
      }
      // jQuery should be present, but if it's not, then collect the links using pure javascript
      else {
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
          var href = links[i].href;
          if (href) {
            if (!href.match(/^(#|javascript|mailto)/) && result.links.indexOf(href) === -1) {
              result.links.push(href);
            }
          }
        }
      }

      return result;
    })
    .then(function (result) {
      console.log('Success! Here are the derived links: \n', result.links);
    })

    .catch(function (err) {
      console.log('Error getting links: ', err);
    })

    // Always close the Horseman instance, or you might end up with orphaned phantom processes
    .close();
};