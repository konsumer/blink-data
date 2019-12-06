/* global describe, it, expect */

require = require('esm')(module)
const { Blink } = require('./index')

const { BLINK_EMAIL, BLINK_PASSWORD } = process.env
if (!BLINK_EMAIL || !BLINK_PASSWORD) {
  throw new Error('BLINK_EMAIL and/or BLINK_PASSWORD not set')
}

const blink = new Blink()
let network

describe('blink-data', () => {
  it('should be able to login.', async () => {
    const r = await blink.login(BLINK_EMAIL, BLINK_PASSWORD)
    expect(r.account).toBeDefined()
  })

  it('should be able to get current user.', async () => {
    const r = await blink.user()
    expect(r.id).toBeDefined()
    expect(r.email).toBeDefined()
  })

  it('should be able to get networks.', async () => {
    const r = await blink.networks()
    network = r.networks[0]
    expect(r.range_days).toBeDefined()
    expect(r.reference).toBeDefined()
    expect(r.networks).toBeDefined()
  })

  it('should be able to get info about a single network.', async () => {
    const r = await blink.network(network.network_id)
    expect(r.id).toBeDefined()
    expect(r.status).toBeDefined()
  })

  it('should be able to get videos.', async () => {
    const r = await blink.videos()
    expect(r.limit).toBeDefined()
    expect(r.purge_id).toBeDefined()
    expect(r.refresh_count).toBeDefined()
    expect(r.media).toBeDefined()
  })

  it('should be able to get a camera.', async () => {
    const r = await blink.camera(network.network_id, network.cameras[0].id)
    expect(r.camera_id).toBeDefined()
    expect(r.network_id).toBeDefined()
    expect(r.account_id).toBeDefined()
    expect(r.created_at).toBeDefined()
    expect(r.id).toBeDefined()
    expect(r.thumbnail).toBeDefined()
  })

  it('should be able to take a thumbnail.', async () => {
    const r = await blink.thumbnail(network.network_id, network.cameras[0].id)
    expect(r.id).toBeDefined()
    expect(r.transaction).toBeDefined()
    expect(r.command).toEqual('thumbnail')
  })

  it('should be able to get a liveview.', async () => {
    const r = await blink.liveview(network.network_id, network.cameras[0].id)
    // this will probly be busy from previous
  })
})
