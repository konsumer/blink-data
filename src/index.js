import * as api from './api'

export class Blink {
  // login and store credentials & headers
  login (email, password) {
    return api.login({ email, password })
      .then(info => {
        this.hydrate(info.authtoken.authtoken, info.account.id, Object.keys(info.region)[0])
        return info
      })
  }

  // rehydrate with token, id & region, so you don't have to log back in
  hydrate (token, account, tier = 'u004') {
    this.headers = { TOKEN_AUTH: token, ACCOUNT_ID: account }
    this.tier = tier
  }

  // get current user-info
  user () {
    return api.getUser(this.tier, { headers: this.headers })
  }

  // get list of current user's networks & battery info
  networks () {
    return api.batteryUsage(this.tier, { headers: this.headers })
  }

  // get details about a network
  network (network) {
    return api.network(this.tier, network, { headers: this.headers }).then(r => r.network)
  }

  // get a list of videos
  videos (page = 0, since = new Date(0)) {
    return api.videos(this.tier, this.headers.ACCOUNT_ID, since, page, { headers: this.headers })
  }

  // get details about a camera
  camera (network, camera) {
    return api.cameraCommandStatus(this.tier, network, camera, { headers: this.headers })
      .then(r => r.camera_status)
  }

  // take a thumbnail for a camera
  // this just triggers and returns info
  thumbnail (network, camera) {
    return api.takeSnapshot(this.tier, network, camera, {}, { headers: this.headers })
  }

  // get liveview for a camera
  liveview (network, camera) {
    // return api.liveView(this.tier, network, camera, {}, { headers: this.headers })
    return api.liveViewV5(this.tier, this.headers.ACCOUNT_ID, network, camera, {}, { headers: this.headers })
  }
}

export default Blink
