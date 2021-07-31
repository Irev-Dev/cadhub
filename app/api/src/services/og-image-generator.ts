// TODO this should be in the functions folder.
// Got the proof of concept working locally, but even though chrome-aws-lambda is supposed to fit into a AWS lambda it did not for me
// in the mean time this is causing builds to fail so moved it out here.
import { builder } from '@netlify/functions'
const { headless, executablePath, puppeteer} = require('chrome-aws-lambda')

const captureWidth = 1200
const captureHeight = 630
const clipY = 0

async function unwrappedHandler (event, context) {
  let path = event.path
    .replace(/.+\/og-image-generator/, '')
    .replace(/\/og-image-.+\.jpg/, '')

  const url = `${process.env.URL}/u${path}/social-card`

  const browser = await puppeteer.launch({
    executablePath: process.env.URL?.includes('localhost')
      ? null
      : await executablePath,
    args: ['--no-sandbox','--disable-web-security','--disable-gpu', '--hide-scrollbars', '--disable-setuid-sandbox'],
    // args: chromium.args,
    defaultViewport: {
      width: captureWidth,
      height: captureHeight + clipY
    },
    headless: headless
  })
  const page = await browser.newPage()

  await page.goto(url, {"waitUntil" : "networkidle0"});

  const screenshot = await page.screenshot({
    type: 'jpeg',
    // netlify functions can only return strings, so base64 it is
    encoding: 'base64',
    quality: 70,
    clip: {
      x: 0,
      y: clipY,
      width: captureWidth,
      height: captureHeight
    }
  })

  await browser.close()

  if (typeof screenshot !== 'string') {
    return {
      statusCode: 400,
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/jpg'
    },
    body: screenshot,
    isBase64Encoded: true
  }
}

export const handler = builder(unwrappedHandler)
