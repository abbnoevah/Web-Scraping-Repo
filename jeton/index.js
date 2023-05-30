import { startBrowser } from './browser.js'
import scraperController from './pageScraper.js'

//Start the browser and create a browser instance
let browserInstance = startBrowser()

// Pass the browser instance to the scraper controller
scraperController(browserInstance)