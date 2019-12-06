/* global describe, it, expect */

require = require('esm')(module)
const { Blink } = require('./index')

const { BLINK_EMAIL, BLINK_PASSWORD } = process.env
if (!BLINK_EMAIL || !BLINK_PASSWORD) {
  throw new Error('BLINK_EMAIL and/or BLINK_PASSWORD not set')
}

// TODO: before tests, shold record state, and set it back after

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

  it('should be able to get info about a camera.', async () => {
    const r = await blink.camera(network.network_id, network.cameras[0].id)
    expect(r.camera_id).toBeDefined()
    expect(r.network_id).toBeDefined()
    expect(r.account_id).toBeDefined()
    expect(r.created_at).toBeDefined()
    expect(r.id).toBeDefined()
    expect(r.thumbnail).toBeDefined()
  })

  it('should be able to get a summary.', async () => {
    const r = await blink.summary()
    expect(r.networks).toBeDefined()
    expect(r.sync_modules).toBeDefined()
    expect(r.cameras).toBeDefined()
    expect(r.sirens).toBeDefined()
    expect(r.chimes).toBeDefined()
    expect(r.video_stats).toBeDefined()
    expect(r.doorbell_buttons).toBeDefined()
    expect(r.app_updates).toBeDefined()
    expect(r.whats_new).toBeDefined()
  })

  it('should be able to get syncmodule for network.', async () => {
    const r = await blink.syncmodule(network.network_id)
    expect(r.id).toBeDefined()
    expect(r.wifi_strength).toBeDefined()
  })

  it('should be able to get sensor info for a camera.', async () => {
    const r = await blink.sensor(network.network_id, network.cameras[0].id)
    expect(r.lfr).toBeDefined()
    expect(r.wifi).toBeDefined()
    expect(r.temp).toBeDefined()
    expect(r.battery).toBeDefined()
  })

  it('should be able to get info about clients that have been used', async () => {
    const r = await blink.clients()
    expect(r[0].device_identifier).toBeDefined()
  })

  it('should be able to get regions', async () => {
    const r = await blink.regions()
    expect(r.preferred).toBeDefined()
    expect(r.regions).toBeDefined()
  })

  it('should be able to get health', async () => {
    const r = await blink.health()
    expect(r).toEqual('OK')
  })

  it('should be able to get programs', async () => {
    const r = await blink.programs(network.network_id)
    expect(r).toBeDefined()
  })

  // these will lock up the device in quick-succession
  // run them 1-at-a-time
  // eventually, these should wait for completion, which will fix this

  it.skip("should be able to enable a single camera's motion-detection", async () => {
    const r = await blink.enableCamera(network.network_id, network.cameras[0].id)
    expect(r.transaction).toBeDefined()
    expect(r.command).toEqual('config_lfr')
  })

  it.skip("should be able to disable a single camera's motion-detection", async () => {
    const r = await blink.disableCamera(network.network_id, network.cameras[0].id)
    expect(r.transaction).toBeDefined()
    expect(r.command).toEqual('config_lfr')
  })

  it.skip('should be able to take a thumbnail.', async () => {
    const r = await blink.thumbnail(network.network_id, network.cameras[0].id)
    expect(r.id).toBeDefined()
    expect(r.transaction).toBeDefined()
    expect(r.command).toEqual('thumbnail')
  })

  it.skip('should be able to get a liveview.', async () => {
    const r = await blink.liveview(network.network_id, network.cameras[0].id)
    expect(r.command_id).toBeDefined()
    expect(r.server).toBeDefined() // this is the rtsps:// address
    expect(r.duration).toEqual('thumbnail')
  })

  it.skip('should be able to arm the network.', async () => {
    const r = await blink.arm(network.network_id)
    expect(r.id).toBeDefined()
    expect(r.transaction).toBeDefined()
    expect(r.command).toEqual('arm')
  })

  it.skip('should be able to disarm the network.', async () => {
    const r = await blink.disarm(network.network_id)
    expect(r.id).toBeDefined()
    expect(r.transaction).toBeDefined()
    expect(r.command).toEqual('disarm')
  })
})
