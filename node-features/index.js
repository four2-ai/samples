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

  console.log(`This Feature is named ${feature.name}`);

  while (hasMoreItems) {
    // this response is paginated.
    const trackedUserFeatures =
      await four2.features.fetchFeatureTrackedUserFeaturesAsync({
        page: page++,
        token,
        id: feature.id,
      });

    // console.log(trackedUserFeatures);
    //{
    // items: [
    //{
    //   version: 2,
    //   trackedUserId: 169681,
    //   trackedUser: [Object],
    //   featureId: 9,
    //   feature: [Object],
    //   value: 'Good',
    //   id: 12922,
    //   created: '2021-07-30T05:15:57.9933333+00:00',
    //   lastUpdated: '2021-07-30T05:15:57.9933333+00:00'
    // }
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

    for (let trackedUserFeature of trackedUserFeatures.items) {
      console.log(
        `${trackedUserFeature.trackedUser.commonId} has ${trackedUserFeature.feature.name} value: ${trackedUserFeature.value}`
      );

      // Your code goes here.
    }

    hasMoreItems = trackedUserFeatures.pagination.hasNextPage;
    hasMoreItems = false; // prevent sample from running too long - uncomment to continue.
  }
};

main()
  .then(() => console.log("Feature iteration complete"))
  .catch((e) => {
    console.log("There was an error");
    console.log(e);
  });
