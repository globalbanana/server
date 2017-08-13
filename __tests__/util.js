export const randomInt = (min = 0 , max = 5) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomString = (max = 5) => {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < max; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}
