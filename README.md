<p align="center"><img src="https://github.com/Needrose/whalejet-app/blob/main/public/wj.png?raw=true" height="200"></p>

<h1 align="center">Whalejet</h1>

The really cool non-web proxy that totally doesn't let you do things that a web proxy would let you do. 

#### Refer to <a href="https://github.com/HeyPuter/browser.js">browser.js</a> where this project will now receive updates outside of just bypassing internet censorship.

## Supported Sites

Whalejet has CAPTCHA support! Some of the popular websites that Whalejet supports include:

- [Google](https://google.com)
- [Twitter](https://twitter.com)
- [Instagram](https://instagram.com)
- [Youtube](https://youtube.com)
- [Spotify](https://spotify.com)
- [Discord](https://discord.com)
- [Reddit](https://reddit.com)
- [GeForce NOW](https://play.geforcenow.com/)

## Setup / Usage

You will need to set these environnement variables.
```
SITE_PASSWORD=4321 # the password people are prompted with to use the site
SECRET=change-me # please make this a long random string, just spam ur keyboard
PROXY=http://user:pass@ip:port # sorry for now you need a proxy, i reccomend residential, i will make it so you no need one soon
PORT=8080 # dont change this for now
```

You will need Node.js 16.x (and above) and Git installed; below is an example for Debian/Ubuntu setup.

```
sudo apt update
sudo apt upgrade
sudo apt install curl git nginx

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install 20
nvm use 20

git clone https://github.com/Needrose/whalejet-app
cd whalejet-app
```

Install dependencies

```
pnpm install
```

Run the server

```
pnpm start
```

Resources for self-hosting:

- https://github.com/nvm-sh/nvm
- https://docs.titaniumnetwork.org/guides/nginx/
- https://docs.titaniumnetwork.org/guides/vps-hosting/
- https://docs.titaniumnetwork.org/guides/dns-setup/

### HTTP Transport

Whalejet uses [libcurl-transport](https://github.com/MercuryWorkshop/libcurl-transport) to fetch proxied data encrypted.

See the [bare-mux](https://github.com/MercuryWorkshop/bare-mux) documentation for more information.
