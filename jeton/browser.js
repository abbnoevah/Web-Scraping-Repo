// import puppeteer, { launch } from 'puppeteer'

const { default: puppeteer } = require('puppeteer')

const startBrowser = async () => {
	// launcha en ny session med puppeteer

	let browser

	try {
		browser = await puppeteer.launch({
			headless: false, //gör browser synlig
			defaultViewport: null, //websidan får full h och w
		})
	} catch (err) {
		console.log('Could not create a browser instance => : ', err)
	}

	return browser
}

module.exports = {
	startBrowser,
}
