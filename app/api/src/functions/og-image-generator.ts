import { builder } from '@netlify/functions'
import type { HandlerResponse } from '@netlify/functions'
import chromium from 'chrome-aws-lambda'

const captureWidth = 1200
const captureHeight = 630
const clipY = 0

async function unwrappedHandler (event, context): Promise<HandlerResponse> {
  let path = event.path
    .replace(/.+\/og-image-generator/, '')
    .replace(/\/og-image-.+\.jpg/, '')
  console.log(event.path, path)

  const url = `${process.env.URL}/u${path}/social-card`
  console.log(url, 'url')

  const browser = await chromium.puppeteer.launch({
    executablePath: process.env.URL?.includes('localhost')
      ? null
      : await chromium.executablePath,
    args: ['--no-sandbox','--disable-web-security','--disable-gpu', '--hide-scrollbars', '--disable-setuid-sandbox'],
    // args: chromium.args,
    defaultViewport: {
      width: captureWidth,
      height: captureHeight + clipY
    },
    headless: chromium.headless
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
