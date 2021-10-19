# Serverless

We're using the serverless framework for deployment

```
yarn rw build api && sls deploy --stage <stagename>
```
But [Kurt Hutten](https://github.com/Irev-Dev) is the only one with credentials for deployment atm, though if you wanted to set your own account you could deploy to that if you wanted to test.
Deploying has `yarn rw build` first because the image uses built js files

## Testing changes locally

You'll need to have Docker installed

Because of the way the docker containers to be deployed as lambdas on aws are somewhat specialised for the purpose we're using `docker-compose` to spin one up for each function/endpoint. So we've added a aws-emulation layer


The docker build relies on a git ignored file, the aws-lambda-rie. [Download it](https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/download/v1.0/aws-lambda-rie), then put it into `app/api/src/docker/common/`. Alternatively you can put this download into the DockerFiles by reading the instructions at around line 29 of the DockerFiles (`app/api/src/docker/openscad/Dockerfile` & `app/api/src/docker/cadquery/Dockerfile`). However this will mean slower build times as it will need download this 14mb file every build.


Run

```bash
yarn cad
```
The first time you run this, it has to build the main image it will take some time, but launching again will be quicker.

After which we'll also spin up a light express server to act as an emulator to transform some the request from the front end into how the lambda's expect them (This emulates the aws-api-gateway which changes tranforms the inbound requests somewhat).
```
yarn aws-emulate
```
You can now add CAD_LAMBDA_BASE_URL="http://localhost:8080" to you .env file and restart your main dev process (`yarn rw dev`) comment that line out if you want to go back to using the aws endpoint (and restart the dev process).

If you change anything in the `api/src/docker/openscad` directory, you will need to stop the docker process and restart it (will be fairly quick if you're only changing the js)


