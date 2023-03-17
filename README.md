# s3-cnpmcore

a S3 storage wrapper which based on @aws-sdk 3.x for [cnpmcore](https://github.com/cnpm/cnpmcore) 

## Installation

```shell
npm i s3-cnpmcore
```

## Repuirement

NodeJS 18+

## Usage

```ts
import S3Client from 's3-cnpmcore';

// ...
// other configuration in cnpmcore
// ...

// api reference(https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)
config.nfs.client = new S3Client({
  endpoint: 'endpoint',
  credentials: { 
    accessKeyId: 'your id',
    secretAccessKey: 'your access key'
  },
  region: '',
  bucket: 'npm'
})
```

### License

MIT