'use strict';

/**
 * @param Horseman phantomInstance
 * @param string url
 */
module.exports = function (phantomInstance, url) {

  if (!url || typeof url !== 'string') {
    throw 'You must specify a url to ping';
  } else {
    console.log('Pinging url: ', url);
  }
  
  phantomInstance
    .open(url)
    .status()
    .then(function (statusCode) {
      if (Number(statusCode) >= 400) {
        throw 'Page failed with status: ' + statusCode;
      } else {
        console.log('Hello world. Status code returned: ', statusCode);
      }
    })
    .catch(function (err) {
      console.log('Error: ', err);
    })
    .close(); // Always close the Horseman instance, or you might end up with orphaned phantom processes
};