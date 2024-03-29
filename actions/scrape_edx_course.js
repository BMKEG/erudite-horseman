/**
 * 
 */
var Horseman = require('node-horseman')
  , validUrl = require('valid-url')
  , fs = require('fs')
  , program = require('commander')

program
  .version('1.0.0')
  .option('-f --file [string]', 'A file with URLs to crawl from (one per line).')
  .parse(process.argv);

var array = fs.readFileSync(program.file).toString().split("\n");

// Grab links from Google.
var Horseman = require("node-horseman");

var horseman = new Horseman();

var results = [];

function getLinks(){
	return horseman.evaluate( function(){
		// This code is executed in the browser.
		var results = [];
		$("div.g h3.r a").each(function( item ){
			var link = {
				title : $(this).text(),
				url : $(this).attr("href")
			};
			links.push(link);
		});
		return links;
	});
}

function hasNextPage(){
	return horseman.exists("#pnnext");
}

function scrape(){
	
	return new Promise( function( resolve, reject ){
		return getLinks()
		.then(function(newLinks){
			
			links = links.concat(newLinks);

			if ( links.length < 30 ){
				return hasNextPage()
				.then(function(hasNext){
					if (hasNext){
						return horseman
							.click("#pnnext")
							.wait(1000)
							.then( scrape );
					} 
				});
			}
		})
		.then( resolve );
	});
}

horseman
	.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
	.open("http://www.google.com")
	.type("input[name='q']","horseman")
	.click("button:contains('Google Search')")
	.keyboardEvent("keypress",16777221)
	.waitForSelector("div.g")
	.then( scrape )
	.finally(function(){
		console.log(links.length)
		horseman.close();
	});
