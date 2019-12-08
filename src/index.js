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

  // geta nice summary for basic usage (homescreen)
  summary () {
    return api.homescreenV3(this.tier, this.headers.ACCOUNT_ID, { headers: this.headers })
  }

  // Obtain information about the Blink Sync Module on the given network.
  syncmodule (network) {
    return api.syncmodule(this.tier, network, { headers: this.headers })
      .then(r => r.syncmodule)
  }

  // take a thumbnail for a camera
  // this just triggers, need to loop-check
  // might also trigger { message: 'System is busy, please wait', code: 307 } if busy
  thumbnail (network, camera) {
    return api.takeSnapshot(this.tier, network, camera, {}, { headers: this.headers })
  }

  // get liveview for a camera
  // this just triggers, need to do commandPolling
  // might also trigger { message: 'System is busy, please wait', code: 307 } if busy
  liveview (network, camera) {
    // return api.liveView(this.tier, network, camera, {}, { headers: this.headers })
    return api.liveViewV5(this.tier, this.headers.ACCOUNT_ID, network, camera, {}, { headers: this.headers })
  }

  // Arm the given network (start recording/reporting motion events)
  // this just triggers, need to do commandPolling
  arm (network) {
    return api.armDisarmNetwork(this.tier, network, 'arm', {}, { headers: this.headers })
  }

  // Disarm the given network (stop recording/reporting motion events)
  // this just triggers, need to do commandPolling
  disarm (network) {
    return api.armDisarmNetwork(this.tier, network, 'disarm', {}, { headers: this.headers })
  }

  // Gets camera sensor information
  sensor (network, camera) {
    return api.loadCameraStatus(this.tier, network, camera, { headers: this.headers })
  }

  // disable motion-detection for a single camera
  disableCamera (network, camera) {
    return api.cameraMotion(this.tier, network, camera, 'disable', {}, { headers: this.headers })
  }

  // enable motion-detection for a single camera
  enableCamera (network, camera) {
    return api.cameraMotion(this.tier, network, camera, 'enable', {}, { headers: this.headers })
  }

  // Gets information about devices that have connected to the blink service
  clients () {
    return api.clients(this.tier, { headers: this.headers })
      .then(r => r.clients)
  }

  // Gets information about supported regions (use for this.tier)
  regions () {
    return api.getRegions(this.tier, { headers: this.headers })
  }

  // Gets information about system health
  health () {
    return api.health(this.tier, { headers: this.headers })
      .then(r => r.health)
  }

  // Gets information about programs
  programs (network) {
    return api.getPrograms(this.tier, network, { headers: this.headers })
  }

  // proxy GET with credentials for correct tier
  // TODO: this is for binaries, so should abstract binary body blob/buffer stuff for cross-platform (browser vs node)
  get (url) {
    return api.fetch(`https://rest-${this.tier}.immedia-semi.com${url}`, { headers: this.headers })
  }
}

export default Blink
