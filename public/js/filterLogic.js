searchGroups()

const modelList = document.querySelector('#modelList')
function searchModel() {
  const input = document.querySelector('#productModel')
  const filter = input.value.toUpperCase()
  const div = modelList.getElementsByTagName('div')

  for (let i = 0; i < div.length; i++) {
    label = div[i].getElementsByTagName('label')[0].innerText
    if (label.toUpperCase().includes(filter)) {
      div[i].style.display = ''
    } else {
      div[i].style.display = 'none'
    }
  }
}

function searchGroups() {
  fetch('/data/groups').then((response) =>
    response
      .json()
      .then((data) => {
        if (data) {
          data.forEach((model) => {
            let content = document.createElement('div')
            content.className = 'flex items-center'
            content.innerHTML = `
            <label
              class='ml-3 text-sm text-gray-600'
            ><input
              name='model[]'
              value='${data.indexOf(model)}'
              type='checkbox'
              class='h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500'
              onclick='onlyOneModelChecked(this)'
            />
              ${model.charAt(0).toUpperCase() + model.slice(1)}
            </label>`
            modelList.appendChild(content)
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  )
}

function onlyOneManChecked(checkbox) {
  const checkboxes = document.getElementsByName('manufacturer[]')
  checkboxes.forEach((box) => {
    if (box !== checkbox) box.checked = false
  })
}

function onlyOneCatChecked(checkbox) {
  const checkboxes = document.getElementsByName('category[]')
  checkboxes.forEach((box) => {
    if (box !== checkbox) box.checked = false
  })
}

function onlyOneModelChecked(checkbox) {
  const checkboxes = document.getElementsByName('model[]')
  checkboxes.forEach((box) => {
    if (box !== checkbox) box.checked = false
  })
}
