const createForm = document.querySelector('#createForm')
const password = document.querySelector('#password')
const passwordConfirm = document.querySelector('#passwordConfirm')
const errorMessage = document.querySelector('#errorMessage')

createForm.addEventListener('submit', async (e) => {
  if (password.value !== passwordConfirm.value) {
    e.preventDefault()
    errorMessage.classList.remove('hidden')
    errorMessage.textContent = 'Parolele nu coincid!'
  }
})
