# no-game

## Site Update

Once the updated site has been pushed on the git repository, simply fetch the update and hard reset the local branch:

    git fetch --all
    git reset --hard origin/master

## Site Deployment

### site content

* copy the statics into `/var/www/no-game/`
  * `sudo cp -a static/. /var/www/no-game/`

### nginx configuration

* copy the nginx config into `/etc/nginx/sites-available/`
  * `sudo cp config/nginx-sites-available/no-game /etc/nginx/sites-available/`
* create a symlink to it in `/etc/nginx/sites-enabled`
  * `sudo ln -s /etc/nginx/sites-available/no-game /etc/nginx/sites-enabled`
* Restart nginx
  * `sudo systemctl restart nginx`

### Automatic redeploy on git push

Create a `post-receive` file in the destination server git repository, inside `.git/hooks`. Put the following contents in it:

    #!/bin/sh
    cd ..
    GIT_DIR='.git'
    umask 002 && git reset --hard
    umask 002 && cp -a no-game/static/. /var/www/no-game/

Make it executable and it will be run by git everytime you push to this remote. Also, set git config to allow resetting the current branch on receive:

    chmod +x .git/hooks/post-receive
    git config receive.denyCurrentBranch ignore
