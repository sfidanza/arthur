# no-game

## Site Update

Once the updated site has been pushed on the git repository, simply fetch the update and hard reset the local branch:
```
git fetch --all
git reset --hard origin/master
```

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
