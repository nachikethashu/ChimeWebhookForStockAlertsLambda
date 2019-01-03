# ChimeWebhookForStockAlertsLambda
A Lambda function which polls the stock values and pushes the same into provided Chime webhook.


### How to use
1. Create an AWS Lambda function
2. Pull this package and run `npm install`
3. Run `npm run release` to push this code into your Lambda function
4. Dont forget to configure your event details/data in following format
   `{
  "webhookId": "your chime webhook id here",
  "stocksToPoll": [
    "AAPL",
    "AMZN",
    "BABA",
    "MSFT"
  ],
  "alphavantageKey": "Your alphavantage key"
}`

### How the Stock polling is done
Refer [stock.js](https://www.npmjs.com/package/stocks.js) for all the info.