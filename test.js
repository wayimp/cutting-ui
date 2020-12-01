const AWS = require('aws-sdk')
const env = {
  SPACES_ENDPOINT: 'nyc3.digitaloceanspaces.com',
  SPACES_KEY: 'KLUV6F4KW5OQ7S6HM6RN',
  SPACES_SECRET: '3K2WdaGCYSJMZheknSQB8vTl0kq8WGRAhvGaB4EPK9Y'
}

const spacesEndpoint = new AWS.Endpoint(env.SPACES_ENDPOINT)
const s3 = new AWS.S3({
  endpoint: env.SPACES_ENDPOINT,
  accessKeyId: env.SPACES_KEY,
  secretAccessKey: env.SPACES_SECRET
})

var params = {
  Bucket: 'wayimp'
}

s3.listObjects(params, function (err, data) {
  if (err) {
    console.log('s3===' + err.stack)
    console.log(err, err.stack)
  } else {
    data['Contents'].forEach(function (obj) {
      console.log(obj['Key'])
    })
  }
})
