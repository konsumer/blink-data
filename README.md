# blink-data

Interact with blink camera servers in javascript

This will allow you to interact with [blink cameras](https://blinkforhome.com/). You can use it in node, electron, or a browser (with CORS security disabled.)

## install

```
npm i blink-data
```

## usage

### basics

```js
import { Blink } from 'blink-data'

async function run () {
  const blink = new Blink()
  await blink.login('me@demo.com', 'mypassword')

  // get current user-info
  const user = await blink.user()
  console.log(user)

  // get list of current user's networks
  const networks = await blink.networks()
  console.log(networks)

  // get details about a network
  const network = await blink.network(networks[0].id)
  console.log(network)

  // get a list of videos
  const videos = await blink.videos()
  console.log(videos)

  // get details about a camera
  const camera = await blink.camera(networks[0].network_id, networks[0].cameras[0].id)
  console.log(camera)
}

run()
```

I haven't setup API-docs yet, but you can see usage examples iun the [unit-test](./src/blink-data.test.js).

### browser

You will need to disable CORS security for this to work directly from blink servers, in a browser:

Close all instances of Chrome browser (open taskmanager and kill any resilient Chrome process). Execute 

Windows
```
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe --disable-web-security --user-data-dir=<path to viewer>. 
```
MacOS
```
open -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --disable-web-security --user-data-dir=<path to viewer>
```

You can also do this in your own electron app:

```js
const win = new BrowserWindow({
  webPreferences: { webSecurity: false }
})
```

Alternatively, if you want to do it all in IPC-space, you can:

```js
const Blink = require('electron').remote.require('blink-data')
```

And CORS-security should be disabled for just blink.

### rehydrate

If you are using this on a webserver, or just want to login via a token (instead of email/password), you can rehydrate them to work with their session:

```js
const blink = new Blink()
blink.hydrate (token, account, region)
blink.user().then(console.log)
```

You can get `token`, `account`, and `region` from the output of `blink.login()`, so store this, and send it via a cookie/session/header.


Here is a client-side example using `localStorage`:
```js
// at login time
const blink = new Blink()
const { authtoken, account, region } = await blink.login(email, password)
localStorage.user = JSON.stringify({ token: authtoken.authtoken, id: account.id, region: Object.keys(region)[0] })

// later
const blink = new Blink()
const { token, id, region } = JSON.parse(localStorage.user)
blink.hydrate(token, id, region)
blink.user().then(console.log)
```

## related

* [Here](https://github.com/konsumer/blink-desktop) is my desktop-client, using electron.

## credit

Big shout-out to [MattTW's BlinkMonitorProtocol](https://github.com/MattTW/BlinkMonitorProtocol/). This is totally generated from that. [bling-viewer](https://github.com/lurume84/bling-viewer) is also great, and helped work out some parts.

