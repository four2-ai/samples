# NodeJS - Feature Iteration

In this sample, we show how to access the healthScore Feature for all applicable Tracked Users.

## Preparing your environment

### Clone this repository.

```sh
git clone https://github.com/four2-ai/samples.git
```

### Install NodeJS

Check NodeJS is installed. If not installed, this command will display an error.

```sh
node --version
# v12.13.1
```

### Install the dependencies

```sh
cd samples
npm install
```

### Copy your API Key and URL from Four2.

When you registered with Four2, you received a url that links to your instance.

#### Creating an API Key

If you don't have an API Key, you can create one in the app.

> https://{your_base_url}/settings/api-keys

Copy the Base URL and Api Key into the sample code at index.js

> In this sample, we cache the access token. When exchanging an API Key for an Access Token, it is good practice to cache and re-use the token. Exchanging the token too many times will results in errors due to rate-limitations.

## Running the sample

When you run the sample, you should see a list of tracked users and their associated healthScore.

```sh
node index.js
```

Because Features are calculated asynchonously, some tracked users may not have a health score.

