import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9222
const APP = 'http://localhost:5173/#/roster'
const OUT = tmpdir()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--remote-debugging-port=${PORT}`,
  '--window-size=1440,1000',
  '--hide-scrollbars',
  APP,
])

async function getTarget() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const targets = await res.json()
      const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page
    } catch {}
    await sleep(500)
  }
  throw new Error('no chrome target')
}

const target = await getTarget()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))

let msgId = 0
const pending = new Map()
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
}
function send(method, params = {}) {
  const id = ++msgId
  ws.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve) => pending.set(id, resolve))
}
async function evaluate(expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (res.result?.exceptionDetails) throw new Error(JSON.stringify(res.result.exceptionDetails))
  return res.result?.result?.value
}
async function shot(name) {
  const res = await send('Page.captureScreenshot', { format: 'png' })
  const path = join(OUT, `afk-verify-${name}.png`)
  writeFileSync(path, Buffer.from(res.result.data, 'base64'))
  console.log('saved', path)
}

await send('Page.enable')
await send('Runtime.enable')
await sleep(3000)

const seed = {
  state: {
    schemaVersion: 1,
    profile: { crystalLevel: 300 },
    heroes: {
      98: {
        heroId: '98',
        ascension: 'ascended3',
        level: 240,
        inCrystal: true,
        signatureItem: 30,
        furniture: 9,
        engraving: 60,
        gear: {
          weapon: { slot: 'weapon', tier: 't4', stars: 5, exclusive: true, resonant: false },
          helmet: { slot: 'helmet', tier: 't2', stars: 3, resonant: true, faction: 'Dimensional' },
          chest: { slot: 'chest', tier: 'mythic', stars: 2, faction: 'Lightbearer' },
          boots: { slot: 'boots', tier: 't1', stars: 0, resonant: true },
        },
        linkedHeroId: '182',
        notes: 'Prioridad: subir SI a 40.',
        updatedAt: new Date().toISOString(),
      },
      182: {
        heroId: '182',
        ascension: 'mythic',
        level: 200,
        inCrystal: false,
        signatureItem: 10,
        furniture: 3,
        engraving: 0,
        gear: {},
        updatedAt: new Date().toISOString(),
      },
    },
    teams: [],
  },
  version: 1,
}

await evaluate(`localStorage.setItem('afk-astral-codex:data', ${JSON.stringify(JSON.stringify(seed))}); location.reload(); 'ok'`)
await sleep(4000)

console.log('roster heroes:', await evaluate(`document.querySelectorAll('article').length`))

await evaluate(`document.querySelector('button[aria-label="View Ainz Ooal Gown"]')?.click(); 'clicked'`)
await sleep(3500)
console.log('dialog title:', await evaluate(`document.querySelector('[role="dialog"] h2')?.textContent`))
await shot('desktop-edit')

await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true })
await sleep(1200)
await shot('mobile-edit')

await send('Emulation.clearDeviceMetricsOverride')
await sleep(600)

await evaluate(`document.querySelector('[role="dialog"] button[aria-label="Close"], [role="dialog"] button')?.click(); 'closed'`)
await sleep(800)
const closed = await evaluate(`!document.querySelector('[role="dialog"]')`)
console.log('dialog closed:', closed)
if (!closed) {
  await evaluate(`[...document.querySelectorAll('[role="dialog"] button')].find(b => b.textContent.trim() === 'Close')?.click(); 'x'`)
  await sleep(800)
}

await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('Add hero'))?.click(); 'add'`)
await sleep(2500)
await shot('desktop-picker')

ws.close()
chrome.kill()
console.log('done')
