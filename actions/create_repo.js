'use strict';

/**
 * @param Horseman phantomInstance
 * @param string username
 * @param string password
 * @param string repository
 */
module.exports = function (phantomInstance, username, password, repository) {

  if (!username || !password || !repository) {
    throw 'You must specify login credentials and a repository name';
  }

  repository = repository.replace(/\s+/, '-');
  console.log('Creating repository: ', repository);

  var possibleRepoMatch = new RegExp(username + '/' + repository);

  phantomInstance
    .open('https://github.com/login')

    // Clear cookies from previous runs
    // .cookies([])

    // Optionally, determine the status of the response
    .status()
    .then(function (statusCode) {
      console.log('HTTP status code: ', statusCode);
      if (Number(statusCode) >= 400) {
        throw 'Page failed with status: ' + statusCode;
      }
    })

    // Fill out the login form and submit it
    .type('input[name="login"]', username)
    .type('input[name="password"]', password)
    .click('input[name="commit"]')
    
    // Wait for the login submission response page
    .waitForNextPage()

    // Determine if you were logged in successfully
    .evaluate(function () {
      $ = window.$ || window.jQuery;
      var fullHtml = $('body').html();
      return !fullHtml.match(/Incorrect username or password/);
    })
    .then(function (isLoggedIn) {
      if (!isLoggedIn) {
        throw 'Login failed';
      }
    })
    
    // Optionally, retrieve any cookies that were set on successful login
    .cookies()                    
    .then(function (cookies) {
      // console.log('Cookies: ', cookies);
    })

    // Find out if specified repository already exists
    // Go to profile page and view repositories list
    .click('a:contains("Your profile")')
    .waitForNextPage()

    // Click the "repositories" link, wait for its view to show
    .click('nav[role="navigation"] a:nth-child(2)')
    .waitForSelector('a.new-repo')

    // Gather existing repository names
    .evaluate(function () {
      $ = window.$ || window.jQuery;

      var possibleRepositories = [];
      $('.repo-list-item h3 a').each(function (i, el) {
        possibleRepositories.push($(el).text().replace(/^\s+/, ''));
      });

      return possibleRepositories;
    })

    // Determine if the specified repository already exists
    .then(function (possibleRepositories) {
      if (possibleRepositories.indexOf(repository) > -1) {
        throw 'Repository already exists: ' + repository;
      }
    })

    // Navigate to the create repository page, enter the repository name, and submit the form
    .click('a.new-repo')
    .waitForNextPage()
    .type('input#repository_name', repository)
    .click('button:contains("Create repository")')

    // Wait for the submission response page
    .waitForNextPage()
    .then(function () {
      console.log('Success! You should now have a new repository at: ', 'https://github.com/' + username + '/' + repository);
    })

    .catch(function (err) {
      console.log('Error creating repository: ', err);
    })

    // Always close the Horseman instance, or you might end up with orphaned phantom processes
    .close();
};