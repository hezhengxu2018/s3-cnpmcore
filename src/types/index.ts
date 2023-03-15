import { S3ClientConfig } from "@aws-sdk/client-s3";
export interface UploadOptions {
  key: string;
  size?: number;
}

export interface AppendOptions {
  key: string;
}

export interface UploadResult {
  key: string;
}

export interface ClientConfiguration extends S3ClientConfig {
  bucket: string;
}
