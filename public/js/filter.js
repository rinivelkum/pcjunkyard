const sortButton = document.querySelector('#menu-button')
const sortDropdown = document.querySelector('#menu-button-drop')
const contentDiv = document.querySelector('#content-div')

const manufacturerFilters = document.querySelector('#filter-section-0')
const showManufacturer = document.querySelector('#show-filter-section-0')
const hideManufacturer = document.querySelector('#hide-filter-section-0')

const groupFilters = document.querySelector('#filter-section-1')
const showGroup = document.querySelector('#show-filter-section-1')
const hideGroup = document.querySelector('#hide-filter-section-1')

const priceFilters = document.querySelector('#filter-section-2')
const showPrice = document.querySelector('#show-filter-section-2')
const hidePrice = document.querySelector('#hide-filter-section-2')

fetch('/data/productlist').then((response) => {
  response.json().then((data) => {
    console.log(data)
  })
})

sortButton.addEventListener('click', async (e) => {
  e.preventDefault()
  sortDropdown.classList.toggle('hidden')
})

showManufacturer.addEventListener('click', async (e) => {
  if (manufacturerFilters.classList.contains('hidden')) {
    manufacturerFilters.classList.toggle('hidden')
  }
})

hideManufacturer.addEventListener('click', async (e) => {
  if (!manufacturerFilters.classList.contains('hidden')) {
    manufacturerFilters.classList.toggle('hidden')
  }
})

showGroup.addEventListener('click', async (e) => {
  if (groupFilters.classList.contains('hidden')) {
    groupFilters.classList.toggle('hidden')
  }
})

hideGroup.addEventListener('click', async (e) => {
  if (!groupFilters.classList.contains('hidden')) {
    groupFilters.classList.toggle('hidden')
  }
})

showPrice.addEventListener('click', async (e) => {
  if (priceFilters.classList.contains('hidden')) {
    priceFilters.classList.toggle('hidden')
  }
})

hidePrice.addEventListener('click', async (e) => {
  if (!priceFilters.classList.contains('hidden')) {
    priceFilters.classList.toggle('hidden')
  }
})
