const fs = require("fs");
const retry = require("promise-fn-retry");

// import the 'signalbox' library as four2
const four2 = require("signalbox.js");

// set the URL of youe Four2 instance.
const FOUR2_BASE_URL = "https://your_base_url";
four2.setBaseUrl(FOUR2_BASE_URL);

const API_KEY = "YOUR_API_KEY"
const FEATURE_ID = "healthScore";

// we use async methods when possible.
const main = async () => {

  // Start API Key exchange
  let tokenResponse = null;
  if (fs.existsSync(".token.json")) {
    console.log("Using cached token");
    tokenResponse = JSON.parse(fs.readFileSync(".token.json"));
  } else {
    console.log("Exchanging Api Key for token");
    tokenResponse = await four2.apiKeys.exchangeApiKeyAsync({
      apiKey: API_KEY,
    });
    // and cache the token response
    fs.writeFileSync(".token.json", JSON.stringify(tokenResponse));
  }

  const token = tokenResponse.access_token;
  // end API Key exchange


  let page = 1;
  let hasMoreItems = true;

  // check the feature exists.
  const feature = await four2.features.fetchFeatureAsync({
    token,
    id: FEATURE_ID,
  });

  console.log(`This Feature is named ${feature.name}`)

  while (hasMoreItems) {
    // this response is paginated.
    const trackedUsers = await four2.features.fetchFeatureTrackedUsersAsync(
      {
        page: page++,
        token,
        id: feature.id,
      }
    );
  
  
  // console.log(trackedUsers)
  //{
  // items: [
  //   {
  //
  //   }
  // ],
  // pagination: {
  //   pageCount: 1,
  //   totalItemCount: 2,
  //   pageNumber: 1,
  //   hasPreviousPage: false,
  //   hasNextPage: false,
  //   isFirstPage: true,
  //   isLastPage: true
  // }
  //}

    for (let trackedUser of trackedUsers.items) {
      // this loop may run many times.
      // using a try/catch patterns helps prevent transient errors from interrupting the process.
      try {

        // you can use a retry pattern to mitigate transient errors.
        const featureValuesResponse = await retry(() =>
          // this async method returns the feature value and related information.
          four2.features.fetchTrackedUserFeatureValuesAsync({
            token,
            id: trackedUser.id,
            feature: FEATURE_ID,
          })
        );

        console.log(`${trackedUser.commonId} has ${featureValuesResponse.feature.name} value: ${featureValuesResponse.value}`);

        // Your code goes here.
        //
        //
        //

      } catch (ex) {
        console.log(ex);
      }
    }

    hasMoreItems = trackedUsers.pagination.hasNextPage;
    hasMoreItems = false; // prevent sample from running too long.
  }
};

main()
  .then(() => console.log("Feature iteration complete"))
  .catch((e) => {
    console.log("There was an error");
    console.log(e);
  });
