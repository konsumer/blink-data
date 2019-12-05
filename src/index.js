import { fetch } from 'popsicle'

export class Blink {
  constructor (baseUrl = 'https://rest.prod.immedia-semi.com') {
    this.baseUrl = baseUrl
  }

  // login and store credentials & headers
  login (email, password) {
    return fetch(`${this.baseUrl}/login`, { method: 'POST', body: JSON.stringify({ email, password }) })
      .then(r => r.json())
      .then(info => {
        this.hydrate(info.authtoken.authtoken, info.account.id, Object.keys(info.region)[0])
        return info
      })
  }

  // rehydrate the object, so you don't have to log back in
  hydrate (token, account, region = 'u004') {
    this.headers = {
      TOKEN_AUTH: token,
      ACCOUNT_ID: account
    }
    this.baseUrl = this.baseUrl.replace('rest.prod', `rest-${region}`)
  }

  // proxy for binary URLs (media)
  proxy (url) {
    return fetch(`${this.baseUrl}/${url}`, { headers: this.headers })
      .then(r => r.body)
  }

  // get current user-info
  user () {
    return fetch(`${this.baseUrl}/user`, { headers: this.headers })
      .then(r => r.json())
  }

  // get list of current user's networks
  networks () {
    return fetch(`${this.baseUrl}/api/v1/camera/usage`, { headers: this.headers })
      .then(r => r.json())
  }

  // get details about a network
  network (id) {
    return fetch(`${this.baseUrl}/network/${id}`, { headers: this.headers })
      .then(r => r.json())
      .then(({ network }) => network)
  }

  // get a list of videos
  videos (page = 0, since = new Date(0)) {
    return fetch(`${this.baseUrl}/api/v1/accounts/${this.headers.ACCOUNT_ID}/media/changed?since=${since.toISOString()}&page=${page}`, { headers: this.headers })
      .then(r => r.json())
  }

  // get details about a camera
  camera (network, camera) {
    return fetch(`${this.baseUrl}/network/${network}/camera/${camera}`, { headers: this.headers })
      .then(r => r.json())
      .then(r => r.camera_status)
  }
}

export default Blink
