function filterPageData (data, input) {
    const filteredData = data.filter(item => {
        const itemTitle = item.title.toLowerCase()
        const userInput = input.toLowerCase()
        return itemTitle.includes(userInput)
    })

    return filteredData
}

// Function to update the filtered items in the HTML
function updateFilteredItems (filteredItems, toID) {
    const filteredItemsList = document.getElementById(toID)
    filteredItemsList.innerHTML = ''

    let itemsDisplay

    if (filteredItems.length == 0) { itemsDisplay = pageData }
    else { itemsDisplay = filteredItems }

    // Iterate over the list items and display them
    itemsDisplay.forEach(product => {

        const listItem = document.createElement('li')

        console.log('Title:', product.title)
        console.log('Price:', product.price)
        console.log('Stock:', product.stock)
        console.log('Image:', product.image)
        console.log('---')

        const infoElement = document.createElement('div')
        infoElement.className = "infoElement"

        const dataElement = document.createElement('div')
        dataElement.className = "dataElement"

        const titleElement = document.createElement('h3')
        titleElement.textContent = product.title
        titleElement.className = "gpuTitle"

        const priceElement = document.createElement('p')
        priceElement.textContent = product.price
        priceElement.className = "gpuPrice"

        const stockElement = document.createElement('p')
        stockElement.textContent = "In stock: " + product.stock
        stockElement.className = "gpuStock"

        dataElement.appendChild(priceElement)
        dataElement.appendChild(stockElement)

        const imageElement = document.createElement('img')
        imageElement.src = product.image

        listItem.appendChild(titleElement)

        infoElement.appendChild(dataElement)
        infoElement.appendChild(imageElement)

        listItem.appendChild(infoElement)

        const productList = document.getElementById(toID)
        productList.appendChild(listItem)
    })
}

fetch("InetData.json")
    .then(response => response.json())
    .then(data => {
        console.log(data)

        function filterPageData (input) {
            const filteredData = data.filter(item => {
                const itemTitle = item.title.toLowerCase()
                const userInput = input.toLowerCase()
                return itemTitle.includes(userInput)
            })

            return filteredData.map(item => ({
                title: item.title,
                price: item.price,
                stock: item.stock,
                image: item.image,
            }))
        }

        //updateFilteredItems
        const userInput = document.getElementById('keyword').value
        const filteredItems = filterPageData(userInput)
        updateFilteredItems(filteredItems, 'inet-list')

        document.getElementById('filterBtn').addEventListener('click', function () {
            const userInput = document.getElementById('keyword').value
            const filteredItems = filterPageData(userInput)
            updateFilteredItems(filteredItems, 'inet-list')
        })
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error)
    })


fetch("ElgigData.json")
    .then(response => response.json())
    .then(data => {

        function filterPageData (input) {
            const filteredData = data.filter(item => {
                const itemTitle = item.title.toLowerCase()
                const userInput = input.toLowerCase()
                return itemTitle.includes(userInput)
            })

            return filteredData.map(item => ({
                title: item.title,
                price: item.price,
                stock: item.stock,
                image: item.image,
            }))
        }

        //updateFilteredItems
        const userInput = document.getElementById('keyword').value
        const filteredItems = filterPageData(userInput)
        updateFilteredItems(filteredItems, 'elgig-list')

        document.getElementById('filterBtn').addEventListener('click', function () {
            const userInput = document.getElementById('keyword').value
            const filteredItems = filterPageData(userInput)
            updateFilteredItems(filteredItems, 'elgig-list')
        })
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error)
    })