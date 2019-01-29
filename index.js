const recipe = require('./creates/recipe');
//const authentication = require('./authentication');
const auth_it = {
  type: 'digest',
  // "test" could also be a function
  test: {
    url: 'https://example.com/api/accounts/me.json'
  },
  connectionLabel: '{{bundle.authData.username}}' // Can also be a function, check digest auth below for an example
  // you can provide additional fields, but we'll provide `username`/`password` automatically
};

const auth_it_2 = {
  type: 'custom',
  // "test" could also be a function
  test: {
    url:
      'https://api.pverify.com/Token',
      method: 'POST',
      body: 'username={{bundle.authData.username}}&password={{bundle.authData.password}}&grant_type=password',
      headers: {
         'content-type': 'application/x-www-form-urlencoded'
      }

  },
  fields: [
    {
      key: 'username',
      type: 'string',
      required: true,
      helpText: 'Username from pVerify'
    },
    {
      key: 'password',
      type: 'string',
      required: true,
      helpText: 'password from pVerify for API'
    }
  ]
};

const addApiKeyToHeader = (request, z, bundle) => {
  //request.headers['X-Subdomain'] = bundle.authData.subdomain;
  //const basicHash = Buffer(`${bundle.authData.api_key}:x`).toString('base64');
  //request.headers.Authorization = `Basic ${basicHash}`;
  request.headers.Authorization = "Bearer " + Buffer(`${bundle.authData.access_token}:x`);
	
  request.headers['Client-User-Name'] = bundle.authData.username;
  request.headers['foo'] = "bar";
  return request;
};

// We can roll up all our behaviors in an App.

// To include the API key on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot.

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: auth_it_2,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    addApiKeyToHeader
  ],


  afterResponse: [
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
     [recipe.key]: recipe
  }

};

// Finally, export the app.
module.exports = App;
