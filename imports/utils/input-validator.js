export const InputValidator = {
  isValidEmail: (text) => {
    const mailRegex = /^\w(\.|\w)*@\w+(\.\w+)+$/i
    return text.search(mailRegex) == 0
  },
  isValidPhone: (phone) => {
    const phoneRegex = /^[8-9]\d{7}$/
    return phone.search(phoneRegex) == 0
  }
}
