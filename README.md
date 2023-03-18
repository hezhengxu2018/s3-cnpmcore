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
// extend bucket item from https://github.com/aws/aws-sdk-js-v3/blob/7ff83c46fbab466fea1bed45af79d2f6e71b50f9/clients/client-s3/src/S3Client.ts#L698
config.nfs.client = new S3Client({
  endpoint: 'endpoint',
  credentials: { 
    accessKeyId: 'your id',
    secretAccessKey: 'your access key'
  },
  bucket: 'npm',
  // optional
  region: '',
  // optional
  disableURL: true // default is false, set true when S3 provider can not provide anonymous url
})
```

### License

MIT