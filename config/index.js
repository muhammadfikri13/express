const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './bucketCreds.json') // bucket creds

const { Storage } = Cloud
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'your-projectId',
})

module.exports = storage