import puppeteer, { launch } from "puppeteer"
import { setTimeout } from "timers/promises"

import fs from 'fs'

// const { default: puppeteer } = require("puppeteer")

const getQuotes = async () => {



  // GO TO URL -----

  const url = "https://www.elgiganten.se/gaming/datorkomponenter/grafikkort"
  // launcha en ny session med puppeteer
  const browser = await puppeteer.launch({
    headless: false, //gör browser synlig
    defaultViewport: null, //websidan får full h och w
  })

  let data = []

  for (let i = 1; i < 3; i++) {

    const page = await browser.newPage()
    console.log(`Navigating to ${url}...`)

    await page.goto(url + "/page-" + i.toString(), {
      waitUntil: "domcontentloaded",
    })



    //REMOVE COOKIES -----

    if (i == 1) {

      const selectorCookiesButton = 'button[class="coi-banner__accept"]'
      // const loadMoreButton = "a[class='pagination__arrow']"
      const isElementVisible = async (page, cssSelector) => {
        let visible = true
        await page
          .waitForSelector(cssSelector, { visible: true, timeout: 3000 })
          .catch(() => {
            visible = false
          })
        return visible
      }

      let cookiesVisible = await isElementVisible(page, selectorCookiesButton)
      // let loadMoreVisible = await isElementVisible(page, selectorCookiesButton)


      await page.waitForSelector(selectorCookiesButton)

      while (cookiesVisible) {
        await page
          .click('button[class="coi-banner__accept"]')
          .catch(() => { })
        await page.click(selectorCookiesButton).catch(() => { })
        cookiesVisible = await isElementVisible(page, selectorCookiesButton)
      }

      console.log("Removed cookies popup")
    }

    await page.waitForSelector(".product-list__cell")



    // SCRAPE PAGE -----

    const GPUs = await page.evaluate(() => {
      let length
      function scroll () {
        window.scrollTo(0, document.body.scrollHeight)
      }

      window.scrollTo(0, document.body.scrollHeight)

      let list = Array.from(document.querySelectorAll(".product-list__cell"))

      console.log(list.length)

      return new Promise((resolve) => {
        let length = list.length

        const interval = setInterval(async () => {

          window.scrollTo(0, document.body.scrollHeight)
          list = Array.from(document.querySelectorAll(".product-list__cell"))

          if (length != list.length) {
            length = list.length

          } else {

            // while (loadMoreVisible) {

            //   await page.click(loadMoreButton).catch(() => { })
            //   loadMoreVisible = await isElementVisible(page, loadMoreButton)
            // }
            clearInterval(interval)
            resolve(list.map(item => {

              return {
                title: item.querySelector(".product-name").innerText,
                price: item.querySelector(".price__value.price--100").innerText,
                stock: item.querySelector(".product-delivery__deliveryTextWithOutError").textContent.substring(1),
                image: item.querySelector('.product-tile__image').src
              }

            }))
          }
        }, 2000)
      })


    })



    // WRITE TO FILE -----

    // data = [...data, ...GPUs]
    data.push(GPUs)
    data = data.flat()

    console.log(data)
    console.log(data.length)

    const jsonData = JSON.stringify(data)
    const filePath = './ElgigData.json'

    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred while writing to the file:', err)
      } else {
        console.log('Data has been written to the file successfully.')
      }
    })
  }



  await browser.close()
}

getQuotes()