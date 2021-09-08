const review = new EditorJS({
  holder: 'review',
  minHeight: 0,
})

const productName = window.location.pathname.split('/')[2]
const productHeading = document.querySelector('#productName')
const productPrice = document.querySelector('#productPrice')
const productQuant = document.querySelector('#productQuant')
const userReviews = document.querySelector('#userReviews')
const navCategory = document.querySelector('#navCategory')
const navModel = document.querySelector('#navModel')
const navProduct = document.querySelector('#navProduct')
const productReviewNumber = document.querySelector('#productReviewNumber')
const addReview = document.querySelector('#addReview')
const addToBasket = document.querySelector('#addToBasket')
const reviewStar1 = document.querySelector('#reviewStar1')
const reviewStar2 = document.querySelector('#reviewStar2')
const reviewStar3 = document.querySelector('#reviewStar3')
const reviewStar4 = document.querySelector('#reviewStar4')
const reviewStar5 = document.querySelector('#reviewStar5')
const star1 = document.querySelector('#star1')
const star2 = document.querySelector('#star2')
const star3 = document.querySelector('#star3')
const star4 = document.querySelector('#star4')
const star5 = document.querySelector('#star5')

let currentGrade = 1

fetch(`/data/${productName}`)
  .then((response) => {
    if (response.status === 404) {
      productHeading.textContent = 'Produsul nu a fost gasit'
    } else if (response.status === 500) {
      productHeading.textContent = 'S-a intamplat o problema'
    } else {
      response.json().then((data) => {
        console.log(data)
        const description = new EditorJS({
          holder: 'description',
          tools: {
            image: SimpleImage,
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            header: Header,
            quote: Quote,
            delimiter: Delimiter,
            list: {
              class: List,
              inlineToolbar: true,
            },
          },
          minHeight: 0,
          readOnly: true,
          data: JSON.parse(data.description),
        })
        const image = new EditorJS({
          holder: 'image',
          tools: {
            image: SimpleImage,
          },
          minHeight: 0,
          readOnly: true,
          data: JSON.parse(data.image),
        })
        productHeading.textContent = data.name
        productQuant.textContent = 'Produse in stoc: ' + data.quantity
        if (!data.quantity) {
          addToBasket.style.display = 'none'
        }
        productPrice.textContent = data.price + ' RON'
        productReviewNumber.textContent = data.reviews.length + ' review-uri'
        productReviewNumber.setAttribute('href', '#userReviews')
        navProduct.textContent = data.name
        navModel.textContent = data.model
        navModel.setAttribute(
          'href',
          `/?model=${data.model.replaceAll(' ', '-')}`
        )
        navCategory.textContent = data.category
        navCategory.setAttribute(
          'href',
          `/${data.category.replaceAll(' ', '-')}`
        )
        star1.classList.replace(
          'text-gray-200',
          data.overallGrade > 0 ? 'text-gray-700' : 'text-gray-200'
        )
        star2.classList.replace(
          'text-gray-200',
          data.overallGrade > 1 ? 'text-gray-700' : 'text-gray-200'
        )
        star3.classList.replace(
          'text-gray-200',
          data.overallGrade > 2 ? 'text-gray-700' : 'text-gray-200'
        )
        star4.classList.replace(
          'text-gray-200',
          data.overallGrade > 3 ? 'text-gray-700' : 'text-gray-200'
        )
        star5.classList.replace(
          'text-gray-200',
          data.overallGrade > 4 ? 'text-gray-700' : 'text-gray-200'
        )

        data.reviews.forEach((review) => {
          let content = document.createElement('div')
          let stars = `<div class="flex items-center">
            <svg class="text-gray-700 h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="t${
              review.grade > 1 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="${
              review.grade > 2 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="${
              review.grade > 3 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="${
              review.grade > 4 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>`

          content.innerHTML = `
          ${stars}
          <p>${review.review}</p>
          `
          userReviews.appendChild(content)
        })
      })
    }
  })
  .catch((error) => {})

reviewStar1.addEventListener('click', async (e) => {
  reviewStar2.classList.replace('text-gray-700', 'text-gray-200')
  reviewStar3.classList.replace('text-gray-700', 'text-gray-200')
  reviewStar4.classList.replace('text-gray-700', 'text-gray-200')
  reviewStar5.classList.replace('text-gray-700', 'text-gray-200')

  currentGrade = 1
})

reviewStar2.addEventListener('click', async (e) => {
  reviewStar2.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar3.classList.replace('text-gray-700', 'text-gray-200')
  reviewStar4.classList.replace('text-gray-700', 'text-gray-200')
  reviewStar5.classList.replace('text-gray-700', 'text-gray-200')

  currentGrade = 2
})

reviewStar3.addEventListener('click', async (e) => {
  reviewStar2.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar3.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar4.classList.replace('text-gray-700', 'text-gray-200')
  reviewStar5.classList.replace('text-gray-700', 'text-gray-200')

  currentGrade = 3
})

reviewStar4.addEventListener('click', async (e) => {
  reviewStar2.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar3.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar4.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar5.classList.replace('text-gray-700', 'text-gray-200')

  currentGrade = 4
})

reviewStar5.addEventListener('click', async (e) => {
  reviewStar2.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar3.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar4.classList.replace('text-gray-200', 'text-gray-700')
  reviewStar5.classList.replace('text-gray-200', 'text-gray-700')
  currentGrade = 5
})

function getReviews() {
  fetch(`/data/review/${productName}`).then((response) =>
    response
      .json()
      .then((data) => {
        data.reviews.forEach((review) => {
          let content = document.createElement('div')
          let stars = `<div class="flex items-center">
            <svg class="text-gray-700 h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="t${
              review.grade > 1 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="${
              review.grade > 2 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="${
              review.grade > 3 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <svg class="${
              review.grade > 4 ? 'text-gray-700' : 'text-gray-200'
            } h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>`

          content.innerHTML = `
          ${stars}
          <p>${review.review}</p>
          `
          userReviews.appendChild(content)
        })
        star1.classList =
          data.overallGrade > 0
            ? 'text-gray-700 h-5 w-5 flex-shrink-0'
            : 'text-gray-200 h-5 w-5 flex-shrink-0'
        star2.classList =
          data.overallGrade > 1
            ? 'text-gray-700 h-5 w-5 flex-shrink-0'
            : 'text-gray-200 h-5 w-5 flex-shrink-0'
        star3.classList =
          data.overallGrade > 2
            ? 'text-gray-700 h-5 w-5 flex-shrink-0'
            : 'text-gray-200 h-5 w-5 flex-shrink-0'
        star4.classList =
          data.overallGrade > 3
            ? 'text-gray-700 h-5 w-5 flex-shrink-0'
            : 'text-gray-200 h-5 w-5 flex-shrink-0'
        star5.classList =
          data.overallGrade > 4
            ? 'text-gray-700 h-5 w-5 flex-shrink-0'
            : 'text-gray-200 h-5 w-5 flex-shrink-0'

        productReviewNumber.textContent = data.reviews.length + ' review-uri'
      })
      .catch((error) => {
        userReviews.innerHTML = `An error happened`
      })
  )
}

addReview.addEventListener('click', async (e) => {
  e.preventDefault()
  const formData = new FormData()
  review.save().then((data) => {
    if (data.blocks.length === 0) {
      alert('Adauga un review')
    } else {
      formData.append('review', data.blocks[0].data.text)
      formData.append('grade', currentGrade)

      fetch(`/data/review/${productName}`, {
        method: 'POST',
        body: formData,
      }).then((_) => {
        userReviews.innerHTML = ''
        getReviews()
      })
    }
  })
})

setTimeout(() => {
  document.getElementsByClassName(
    'cdx-input cdx-simple-image__caption'
  )[0].style.display = 'none'
}, 2000)
