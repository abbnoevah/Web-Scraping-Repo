import puppeteer, { launch } from "puppeteer" // Importing Puppeteer and launch function
import { setTimeout } from "timers/promises" // Importing setTimeout function from timers/promises module

import fs from "fs" // Importing fs (file system) module

// const { default: puppeteer } = require("puppeteer")

const getQuotes = async () => {

    const url = "https://www.inet.se/kategori/164/grafikkort-gpu?sortColumn=search&sortDirection=desc" // URL of the website to be scraped

    // Launch a new session with Puppeteer
    const browser = await puppeteer.launch({
        headless: false, // Makes the browser visible
        defaultViewport: null, // Sets the webpage to full height and width
    })

    const page = await browser.newPage() // Create a new page
    console.log(`Navigating to ${url}...`)

    await page.goto(url, {
        waitUntil: "domcontentloaded", // Wait until the page finishes loading
    })

    const selectorCookiesButton = 'button[class="bgx7mup acgbr7b"]' // Selector for cookies popup button
    const loadMoreButton = 'button[class="btn bziojrb"]' // Selector for load more button

    await page.waitForSelector(selectorCookiesButton) // Wait for the cookies popup button to appear
    await page.click('button[class="bgx7mup acgbr7b"]').catch(() => { }) // Click on the cookies popup button (if it exists)

    await page.waitForSelector(loadMoreButton) // Wait for the load more button to appear
    await page.click('button[class="btn bziojrb"]').catch(() => { }) // Click on the load more button (if it exists)
    await page.click(loadMoreButton).catch(() => { }) // Click on the load more button again (if it exists)

    console.log("Removed cookies popup")

    // Extract GPU information from the page using page.evaluate function
    const GPUs = await page.evaluate(() => {

        let length
        function scroll () {
            window.scrollTo(0, document.body.scrollHeight) // Scroll to the bottom of the page
        }

        window.scrollTo(0, document.body.scrollHeight)

        let elementList = Array.from(document.querySelectorAll(".l1qhmxkx")) // Select all GPU elements on the page

        console.log(elementList.length)

        return new Promise((resolve) => {
            let length = elementList.length

            const interval = setInterval(async () => {

                window.scrollTo(0, document.body.scrollHeight) // Scroll to the bottom of the page
                elementList = Array.from(document.querySelectorAll(".l1qhmxkx")) // Update the GPU element list

                if (length != elementList.length) {
                    length = elementList.length
                } else {
                    clearInterval(interval) // Stop the interval
                    resolve(elementList.map(item => {

                        const titleElement = item.querySelector(".h1nslqy4") // Select the title element
                        const title = titleElement ? titleElement.innerHTML : "" // Extract the title (if it exists)

                        const priceElement = item.querySelector(".dkdwco6.db5cfg0 .bp5wbcj") // Select the price element
                        const price = priceElement ? priceElement.textContent : "" // Extract the price (if it exists)

                        const stockElement = item.querySelector(".dkdwco6.dldf3n8") // Select the stock element
                        const stock = stockElement ? stockElement.textContent.substring(1) : "" // Extract the stock (if it exists)

                        const imgElement = item.querySelector('.i1rvexb') // Select the image element
                        const img = imgElement ? imgElement.getAttribute('src') : "" // Extract the image URL (if it exists)

                        return {
                            title: title,
                            price: price,
                            stock: stock,
                            image: img
                        }

                    }))
                }
            }, 2000) // Interval to wait for the elements to load
        })
    })

    console.log(GPUs) // Log the extracted GPU information to the console

    const jsonData = JSON.stringify(GPUs) // Convert the extracted GPU information to JSON format
    const filePath = './InetData.json' // Path of the file to save the JSON data

    // Write the JSON data to a file
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('An error occurred while writing to the file:', err)
        } else {
            console.log('Data has been written to the file successfully.')
        }
    })

    // await browser.close();
}

getQuotes() // Call the getQuotes function to start the web scraping process
