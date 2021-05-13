# no-game

## First-time deployment on a server or local

The admin access code in the site is stored in a `.env` file that does not exist by default. Instead, the repository contains a `.env.sample` file that needs to be copied, renamed and edited to set the code expected on this specific environment.

## Run locally in development mode

In dev mode, the local code will be mapped inside the containers, so you can edit and debug locally:

    docker-compose up -d --build
    docker-compose down

Once the containers are started, the site can be accessed through:

- <http://localhost:8070> to access the web site
- <http://localhost:8071> to access the DB admin interface

### Run locally in production mode

Here are the commands to start/stop everything (with the containers built locally):

    docker-compose -f "docker-compose.yml" up -d --build
    docker-compose -f "docker-compose.yml" down

## Site Update

Once the updated site has been pushed on the git repository, simply fetch the update and hard reset the local branch. Then use docker-compose to refressh the running containers:

    git fetch --all
    git reset --hard origin/master
    docker-compose up -d --build

This can be automated throug a `post-receive` file in the destination server git repository, inside `.git/hooks`. Put the following contents in it:

    #!/bin/sh
    cd ..
    GIT_DIR='.git'
    umask 002 && git reset --hard
    umask 002 && cd no-game && docker-compose -f docker-compose.yml up -d --build

Make it executable and it will be run by git everytime you push to this remote. Also, set git config to allow resetting the current branch on receive:

    chmod +x .git/hooks/post-receive
    git config receive.denyCurrentBranch ignore
