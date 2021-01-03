const puppeteer = require('puppeteer');
const assert = require('assert');
const { URL } = require('url');
const { delayAction } = require('./utils');

const WHATSAPP_URL = 'https://web.whatsapp.com';

class WhatsApp {
  /**
   * @param {import('puppeteer').LaunchOptions} options
   *
   * @returns WhatasappService
   */
  static async initService(options = {}) {
    options.headless = false;

    const browserInstance = await puppeteer.launch(options);

    const page = await browserInstance.newPage();

    await page.goto(WHATSAPP_URL);
    await page.waitForSelector('#side');
    
    await page.close();

    return new WhatsAppService(browserInstance)
  }
}

class WhatsAppService {
  /**
   * @param {import('puppeteer').Browser} browserInstance
   */
  constructor(browserInstance) {
    this._browserInstance = browserInstance;
    this._pageOpen = false;
  }

  /**
   * @param {string} phone
   * @param {string} message
   * @param {number} closeDelayTimeMs
   */
  async sendMessage(phone, message, closeDelayTimeMs = 5000) {
    assert.ok(!this._pageOpen, 'You can only send one message asynchronously');

    this._pageOpen = true;

    const url = new URL(WHATSAPP_URL);
    url.pathname = '/send';
    url.searchParams.set('phone', phone);
    url.searchParams.set('text', message);

    const page = await this._browserInstance.newPage();
    await page.goto(url.href);

    await page.waitForSelector('[data-icon=send]');
    await page.click('[data-icon=send]');
    await delayAction(closeDelayTimeMs, async () => {
      await page.close();
    });

    this._pageOpen = false;
  }

  async stopService() {
    await this._browserInstance.close();
  }
}

module.exports = WhatsApp;
