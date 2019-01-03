const https = require('https')
const Stocks = require('stocks.js')

exports.handler = async (event, context) => {
  const { stocksToPoll, alphavantageKey, webhookId } = event
  const stocks = new Stocks(alphavantageKey)
  const promises = []
  for (let index = 0; index < stocksToPoll.length; index++) {
    const stockName = stocksToPoll[index]
    const promise = stocks.timeSeries({
      symbol: stockName,
      interval: '1min',
      amount: 1
    })

    promises.push(promise.then(data => ({ stockName, data: data[0] })))
  }

  const results = await Promise.all(promises)
  console.log('Try to push the following into Chime', results)
  await pushToChimeWebhook(event, results)

  return `stock values from ${stocksToPoll} are posted to chime chanel ${webhookId} successfully`
}

function pushToChimeWebhook (event, results) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      hostname: 'hooks.chime.aws',
      path: `/incomingwebhooks/${event.webhookId}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }, res => {
      console.log('Got response: ' + res.statusCode)
      resolve('success')
    })

    req.on('error', e => {
      console.log('Got error: ' + e.message)
      reject(e.message)
    })

    req.write(JSON.stringify({
      Content: results.length ? getMDStockTable(results) : 'unable to fetch 😾' // The message that will be posted to Chime
    }))

    req.end()
  })
}

function getMDStockTable (results) {
  const tableRows = results.reduce((acc, cur) => {
    const { low, high, open, close } = cur.data
    return acc + `| ${cur.stockName} |  *${low}* / **${open}** / **${close}** / *${high}* |
    `
  }, '')

  return `/md
    | Stock | Value |
    | ------ | ------ |
    ${tableRows}
  `
}
