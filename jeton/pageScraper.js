const fs = require('fs')

const scraperObject = {

	url: 'https://www.elgiganten.se/',

	async scraper(browser, sortiment, category) {

		let page = await browser.newPage()
		console.log(`Navigating to ${this.url}...`)

		await page.goto(`${this.url}${sortiment}`, {
			 waitUntil: 'domcontentloaded' 
		})
		// Wait for the required DOM to be rendered
		// await page.waitForSelector(".sc-504002c3-0");

		const selectorForLoadMoreButton = 'button[data-testid="load-more-btn"]'
		let loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton)

		while (loadMoreVisible) {
			await page.click('button[id="onetrust-reject-all-handler"]').catch(() => {})
			await page.click('span[data-testid="modal-close-btn"]').catch(() => {})

			await page.click(selectorForLoadMoreButton).catch(() => {})

			loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton)
		}

		let products = await page.evaluate(() => {

			const egList = []
			const egItems = document.querySelectorAll('.cms-image-title-element __cms_internal_link kps-link ng-star-inserted')

			for (const egItem of egItems) {

				const name = egItem.querySelector('.product-tile__bullet-points-wrapper').innerHTML
				
				const rating = egItem.querySelector('.rating__count ng-star-inserted').innerText

				imageUrl = egItem.querySelector('.sc-bc8bed15-0 img[itemprop="image"]')

				const price = egItem.querySelector('.price__value').innerHTML
				const stock = egItem.querySelector('.product-delivery ng-star-inserted').innerHTML	

				console.log(name)		
				console.log(rating)		
				console.log(price)

				const weightUnit = egItem.querySelector('.sc-d29e4bca-8').innerHTML

				egList.push({
					name: name,
					weight: rating,
					imageUrl: imageUrl?.src ?? '',
					price: price,
					weightUnit: weightUnit,
				})
			}

			return egList
		})

		console.log(products)

		products = products.map((p) => {
			return { ...p, category: category }
		})

		fs.writeFile(`${sortiment.split('/').join('-')}.json`, JSON.stringify(products), 'utf8', function (err) {

			if (err) {
				return console.log(err)
			}
			console.log(`The data has been scraped and saved successfully! View it at './${sortiment}.json'`)
		})

		await page.close()
	},
}

const isElementVisible = async (page, cssSelector) => {
	let visible = true

	await page.waitForSelector(cssSelector, { visible: true, timeout: 3000 }).catch(() => {
		visible = false
	})
	return visible
}

module.exports = scraperObject