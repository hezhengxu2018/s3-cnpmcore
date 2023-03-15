import fs from "fs/promises";
import { S3 } from "@aws-sdk/client-s3";
import { ClientConfiguration, UploadOptions, AppendOptions } from "./types/index";

class S3v2Client {
  config: ClientConfiguration;
  s3: S3;

  constructor(config: ClientConfiguration) {
    this.config = config;
    this.s3 = new S3(config);
  }

  trimKey(key: string) {
    key = key ? key.replace(/^\//, "") : "";
    return key;
  }

  async upload(file: string | Buffer, options: UploadOptions) {
    const _key = this.trimKey(options.key);
    if (typeof file === "string") {
      file = await fs.readFile(file);
    }
    await this.s3
      .putObject({ Bucket: this.config.bucket, Key: _key, Body: file, ContentLength: options.size });
    return { key: options.key };
  }

  async uploadBytes(bytes: string | Buffer, options: UploadOptions) {
    if (typeof bytes === "string") {
      bytes = Buffer.from(bytes);
    }
    return await this.upload(bytes, options);
  }

  async appendBytes(bytes: Uint8Array | string, options: AppendOptions) {
    const _key = this.trimKey(options.key);
    if (typeof bytes === "string") {
      bytes = Buffer.from(bytes);
    }
    const oldBytes = await this.readBytes(_key);
    if (oldBytes) {
      const oldBuffer = new Uint8Array(oldBytes);
      const newBytes = Buffer.concat([oldBuffer, Buffer.from(bytes)]);
      return await this.uploadBytes(newBytes, options);
    } else {
      const newBytes = Buffer.from(bytes);
      return await this.uploadBytes(newBytes, options);
    }
  }

  async readBytes(key: string) {
    const _key = this.trimKey(key);
    try {
      return (await this.s3.getObject({ Bucket: this.config.bucket, Key: _key })).Body?.transformToByteArray();
    } catch (error) {
      return undefined;
    }
  }

  async download(key: string, savePath: string) {
    const _key = this.trimKey(key);
    const res = await (await this.s3.getObject({ Bucket: this.config.bucket, Key: _key })).Body?.transformToByteArray();
    res && await fs.writeFile(savePath, res);
  }

  async createDownloadStream(key: string) {
    const _key = this.trimKey(key);
    try {
      await this.s3.headObject({ Bucket: this.config.bucket, Key: _key });
    } catch (error) {
      if ((error as any) === 404) {
        return undefined;
      } else {
        throw error;
      }
    }
    return (await this.s3.getObject({ Bucket: this.config.bucket, Key: _key })).Body?.transformToWebStream();
  }

  async remove(key: string) {
    const _key = this.trimKey(key);
    await this.s3.deleteObject({ Bucket: this.config.bucket, Key: _key });
  }

  async list(prefix: string) {
    const _prefix = this.trimKey(prefix);
    const fileList = (await this.s3.listObjectsV2({ Bucket: this.config.bucket, Prefix: _prefix })).Contents;
    return fileList?.map((item) => {
      return item.Key?.split(`${_prefix}/`)[1];
    });
  }

  async url(key: string) {
    const _key = this.trimKey(key);
    return `${this.config.endpoint}/${this.config.bucket}/${_key}`;
  }
}

export default S3v2Client;
