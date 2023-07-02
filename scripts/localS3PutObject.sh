#!/bin/bash
# configure profile
# aws configure --profile s3local
aws --endpoint http://localhost:4569 s3 cp $1 s3://local-bucket/$1 --profile s3local
# https://www.serverless.com/plugins/serverless-s3-local
