const fs = require('fs')

const _delete = function (path) {
  return new Promise(function (resolve, reject) {
    fs.unlink(path, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  delete: _delete
}
