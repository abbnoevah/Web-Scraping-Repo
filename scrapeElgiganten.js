import puppeteer, { launch } from "puppeteer";
import { setTimeout } from "timers/promises";


// const { default: puppeteer } = require("puppeteer")

const getQuotes = async () => {

    const url = "https://www.elgiganten.se/gaming/datorkomponenter/grafikkort"
    // launcha en ny session med puppeteer
    const browser = await puppeteer.launch({
        headless: false, //gör browser synlig
        defaultViewport: null, //websidan får full h och w
    });

    const page = await browser.newPage();
    console.log(`Navigating to ${url}...`);

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });
    
    const selectorCookiesButton = 'button[class="coi-banner__accept"]';
    let loadMoreVisible = await isElementVisible(page, selectorCookiesButton);
    
    await page.waitForSelector(selectorCookiesButton);

    while (loadMoreVisible) {
      await page
        .click('button[class="coi-banner__accept"]')
        .catch(() => {});
      await page.click('span[data-testid="modal-close-btn"]').catch(() => {});
      await page.click(selectorCookiesButton).catch(() => {});
      loadMoreVisible = await isElementVisible(page, selectorCookiesButton);
    }

    console.log("Removed cookies popup");

    const importComponents = await page.evaluate(() => {

        // var cookieBtn = document.querySelectorAll('.coi-banner__accept');

        // if (cookieBtn) {
        //     cookieBtn.click();
        // }
        
        // const comps = Array.from(document.querySelectorAll(".product-tile.ng-star-inserted"));
        
        // console.log("comps:", comps);

        // for (const comp of comps) {

        //     console.log("comp:", comp);
        //     const compLink = comp.querySelector("a");
        //     compLink.click();



        //     const title = compLink.querySelector()
        //     history.go(-1)

            
        // }
        const comp = document.querySelector(".product-tile.ng-star-inserted")
        const compLink = comp.querySelector("a");
        compLink.click();
    

        // return Array.from(components).map((component) => {
        // // Fetch the sub-elements from the previously fetched quote element
        //  // Get the displayed text and return it (`.innerText`)
        //     console.log(component);
        //     const rating = component.querySelector(".product-name.lift-above-gradient.product-name--plp-view.kps-link.ng-star-inserted").innerText;
        //     // const author = quote.querySelector(".author").innerText;

        //     return { rating };

        // });


    });

    await page.waitForNavigation({ waitUntil: "domcontentloaded"})
    await page.waitForSelector(".b2c.ng-tns-0-2.dy_temp_class_pageview")

    const getInfo = await page.evaluate(() => {

        const list = [];

        const title = document.querySelector(".product-title").textContent
        const price = document.querySelector(".price__value.price--200.ng-star-inserted span").textContent
        const code2Split = document.querySelector(".sku-mobile").textContent
        const newCode = code2Split.split(' ')
        
        const productCode = newCode[1].split('\n')
        
        const stock = document.querySelector(".tab-group__item.tab-group__item--active.ng-star-inserted span[class='ng-star-inserted'").textContent
        const imgElement = document.querySelector('.i1rvexb');
        const img = imgElement ? imgElement.getAttribute('src'): "";

        list.push({
          title: title,
          price: price,
          // code2SplitCode: code2Split,
          // newCode: newCode,
          // productCode1:productCode,
          productCode: productCode[0],
          stock: stock,
          imgLink: img
        });

        return list;
      
    })
    
    
    console.log(getInfo);

    await browser.close();
};

const isElementVisible = async (page, cssSelector) => {
  let visible = true;
  await page
    .waitForSelector(cssSelector, { visible: true, timeout: 3000 })
    .catch(() => {
      visible = false;
    });
  return visible;
};

getQuotes();