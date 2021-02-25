# Serverless

We're using the serverless from work for deployment

```
sls deploy
```
But Kurt Hutten credentials for deployment, though if you wanted to set your own account you could deploy to that if you wanted to test.

## testing changes locally

Honestly it's a pain in the neck, for a number of reasons.

You'll need to have Docker installed

Because of the way the docker containers to be deployed as lambdas on aws are somewhat specialised for the purpose we're using `docker-compose` to spin one up for each function/endpoint. But more work needs to be done to get this to work with the app locally.

```bash
docker-compose up --build
```
The first time you run the, when it has to build the main image it will take some time, but launching again will be quicker.

