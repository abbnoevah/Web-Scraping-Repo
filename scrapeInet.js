import puppeteer, { launch } from "puppeteer"
import { setTimeout } from "timers/promises"

import fs from "fs"

// const { default: puppeteer } = require("puppeteer")

const getQuotes = async () => {

  const url = "https://www.inet.se/kategori/164/grafikkort-gpu?sortColumn=search&sortDirection=desc"
  // launcha en ny session med puppeteer
  const browser = await puppeteer.launch({
    headless: false, //gör browser synlig
    defaultViewport: null, //websidan får full h och w
  })

  const page = await browser.newPage()
  console.log(`Navigating to ${url}...`)

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  })

  const selectorCookiesButton = 'button[class="bgx7mup acgbr7b"]'
  const loadMoreButton = 'button[class="btn bziojrb"]'
  // let cookiesVisible = await isElementVisible(page, selectorCookiesButton);
  // let loadMoreVisible = await isElementVisible(page, loadMoreButton);

  await page.waitForSelector(selectorCookiesButton)
  await page.click('button[class="bgx7mup acgbr7b"]').catch(() => { })

  await page.waitForSelector(loadMoreButton)
  await page.click('button[class="btn bziojrb"]').catch(() => { })
  await page.click(loadMoreButton).catch(() => { })


  console.log("Removed cookies popup")

  const GPUs = await page.evaluate(() => {

    let length
    function scroll () {
      window.scrollTo(0, document.body.scrollHeight)
    }

    window.scrollTo(0, document.body.scrollHeight)

    let elementList = Array.from(document.querySelectorAll(".l1qhmxkx"))

    console.log(elementList.length)

    return new Promise((resolve) => {
      let length = elementList.length

      const interval = setInterval(async () => {

        window.scrollTo(0, document.body.scrollHeight)
        elementList = Array.from(document.querySelectorAll(".l1qhmxkx"))

        if (length != elementList.length) {
          length = elementList.length

        } else {

          clearInterval(interval)
          resolve(elementList.map(item => {

            const titleElement = item.querySelector(".h1nslqy4")
            const title = titleElement ? titleElement.innerHTML : "" //ternary operator kollar om värdet är null. om inte returnerar den innerHtml

            const priceElement = item.querySelector(".dkdwco6.db5cfg0 .bp5wbcj")
            const price = priceElement ? priceElement.textContent : ""

            const stockElement = item.querySelector(".dkdwco6.dldf3n8")
            const stock = stockElement ? stockElement.textContent.substring(1) : ""

            const imgElement = item.querySelector('.i1rvexb')
            const img = imgElement ? imgElement.getAttribute('src') : ""

            return {
              title: title,
              price: price,
              stock: stock,
              image: img
            }

          }))
        }
      }, 2000)
    })
  })


  console.log(GPUs)

  const jsonData = JSON.stringify(GPUs)
  const filePath = './InetData.json'

  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing to the file:', err)
    } else {
      console.log('Data has been written to the file successfully.')
    }
  })

  // await browser.close();
}


getQuotes()