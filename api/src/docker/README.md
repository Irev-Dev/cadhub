# Serverless

We're using the serverless from work for deployment

```
sls deploy
```
But Kurt Hutten credentials for deployment, though if you wanted to set your own account you could deploy to that if you wanted to test.

## testing changes locally

You'll need to have Docker installed

Because of the way the docker containers to be deployed as lambdas on aws are somewhat specialised for the purpose we're using `docker-compose` to spin one up for each function/endpoint. So we've added a aws-emulation layer

first cd into this folder `cd api/src/docker`
then

```bash
docker-compose up --build
```
The first time you run the, when it has to build the main image it will take some time, but launching again will be quicker.

After which we'll also spin up a light express server to act as an emulator to transform some the request from the front end into how the lambda's expect them.
```
yarn install
yarn emulate
```
You can now change the url in `web/src/helpers/cadPackages/openScadController.js` from the aws url to `http://localhost:8080`

If you change anything in the `api/src/docker/openscad` directory, you will need to stop the docker process and restart it (will be fairly quick if you're only changing the js)


