const eligibilityInquiry = require('./creates/eligibilityInquiry');
const getEligibilityResponse = require('./creates/getEligibilityResponse');
const easyEligibility = require('./creates/easyEligibility'); 
const eligibilitySummary = require('./creates/eligibilitySummary');
const easyEligibilitySummary = require('./creates/easyEligibilitySummary');
const sosPost = require('./creates/sosPost');
const sosGet = require('./creates/sosGet');
const mbiPost = require('./creates/mbiPost');
const mbiGet = require('./creates/mbiGet');

const getSessionKey = (z, bundle) => {
	// this is successfully passing in user/password and should work
  const promise = z.request({
   url:
      'https://api.pverify.com/Token',
      method: 'POST',
      body: 'username={{bundle.authData.username}}&password={{bundle.authData.password}}&grant_type=password',
      headers: {
         'content-type': 'application/x-www-form-urlencoded'
      }

  });

  return promise.then(response => {
    if (response.status === 401) {
      throw new Error('The username/password you supplied is invalid');
    }
    return {
      sessionKey: z.JSON.parse(response.content).access_token
    };
  });
};

const authentication = {
  type: 'session',
  // "test" could also be a function
	// This is passing user/pass and should work
  test: {
	   url:
      'https://api.pverify.com/Token',
      method: 'POST',
      body: 'username={{bundle.authData.username}}&password={{bundle.authData.password}}&grant_type=password',
      headers: {
         'content-type': 'application/x-www-form-urlencoded',
	      'sent-from':'authentication'
      }

  },

  fields: [
    {
      key: 'username',
      type: 'string',
      required: true,
      helpText: 'Your login username.'
    },
    {
      key: 'password',
      type: 'string',
      required: true,
      helpText: 'Your login password.'
    }
    // For Session Auth we store `sessionKey` automatically in `bundle.authData`
    // for future use. If you need to save/use something that the user shouldn't
    // need to type/choose, add a "computed" field, like:
    // {key: 'something': type: 'string', required: false, computed: true}
    // And remember to return it in sessionConfig.perform
  ],
  sessionConfig: {
    perform: getSessionKey
  }
};

const includeSessionKeyHeader = (request, z, bundle) => {
  request.headers['Authorization'] = "Bearer " + bundle.authData.sessionKey;
  request.headers['Client-User-Name'] = bundle.authData.username;

  return request;
};

const sessionRefreshIf401 = (response, z, bundle) => {
  if (bundle.authData.sessionKey) {
    if (response.status === 401) {
      throw new z.errors.RefreshAuthError(); // ask for a refresh & retry
    }
  }
  return response;
};



const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [includeSessionKeyHeader],
  afterResponse: [sessionRefreshIf401],
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
    //j [recipe.key]: eligibilityInquiry,
     [eligibilityInquiry.key]: eligibilityInquiry,
     [getEligibilityResponse.key]: getEligibilityResponse,
     [easyEligibility.key]: easyEligibility,
     [eligibilitySummary.key]: eligibilitySummary,
     [easyEligibilitySummary.key]: easyEligibilitySummary,
     [sosGet.key]: sosGet,
     [sosPost.key]: sosPost,
     [mbiGet.key]: mbiGet,
     [mbiPost.key]: mbiPost

     //[recipe.key]: getEligibilityResponse
  }

};

// Finally, export the app.
module.exports = App;
