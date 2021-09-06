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
  placeholder: 'Introdu descrierea produsului',
  minHeight: 0,
})

const image = new EditorJS({
  holder: 'image',
  tools: {
    image: SimpleImage,
  },
  placeholder: 'Copiaza link-ul cu poza',
  minHeight: 0,
})

const addModelButton = document.querySelector('#addModelButton')
const saveProductButton = document.querySelector('#saveProductButton')
const productName = document.querySelector('#productName')
const productPrice = document.querySelector('#productPrice')
const productQuant = document.querySelector('#productQuant')

addModelButton.addEventListener('click', async (e) => {
  e.preventDefault()
  console.log(document.querySelector('#addModel').value)
  if (document.querySelector('#addModel').value) {
    const formData = new FormData()
    formData.append('newGroup', document.querySelector('#addModel').value)
    fetch('/data/groups', {
      method: 'POST',
      body: formData,
    }).then(() => {
      modelList.innerHTML = ''
      searchGroups()
    })
  }
})

saveProductButton.addEventListener('click', async (e) => {
  e.preventDefault()
  const formData = new FormData()
  if (!productName.value) {
    alert('Adauga numele produsului')
  } else if (!productPrice.value) {
    alert('Adauga pretul produsului')
  } else if (!productQuant.value) {
    alert('Adauga cantitatea produsului')
  } else if (
    document.querySelectorAll("input[name='manufacturer[]']:checked").length ===
    0
  ) {
    alert('Selecteaza producatorul produsului')
  } else if (
    document.querySelectorAll("input[name='category[]']:checked").length === 0
  ) {
    alert('Selecteaza categoria produsului')
  } else if (
    document.querySelectorAll("input[name='model[]']:checked").length === 0
  ) {
    alert('Selecteaza modelul produsului')
  } else {
    console.log('Price is ' + productPrice.value)
    formData.append('productName', productName.value)
    formData.append('productPrice', productPrice.value)
    formData.append('productQuant', productQuant.value)
    console.log(
      document.querySelectorAll("input[name='category[]']:checked")[0].value
    )
    formData.append(
      'manufacturer',
      document.querySelectorAll("input[name='manufacturer[]']:checked")[0].value
    )
    formData.append(
      'category',
      document.querySelectorAll("input[name='category[]']:checked")[0].value
    )
    formData.append(
      'model',
      document.querySelectorAll("input[name='model[]']:checked")[0].value
    )

    description.save().then((data) => {
      if (data.blocks.length === 0) {
        alert('Adauga o descriere')
      } else {
        formData.append('description', JSON.stringify(data))

        image.save().then((data) => {
          if (data.blocks.length === 0) {
            alert('Adauga o imagine')
          } else {
            console.log(data)
            formData.append('productImage', JSON.stringify(data))

            if (formData.has('description') && formData.has('productImage')) {
              fetch('/add/item', {
                method: 'POST',
                body: formData,
              }).then((result) =>
                result
                  .json()
                  .then((data) => {
                    console.log(data)
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              )
            } else {
              for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1])
              }
            }
          }
        })
      }
    })
  }
})
