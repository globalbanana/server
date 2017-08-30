const fs = require('fs')

function _removeStringAfterMp4 (name) {
  return name.substring(0, name.indexOf('mp4') + 3)
}

function _urlFileName (url) {
  const getName = url.split('/').pop()
  return _removeStringAfterMp4(getName)
}

function _delete(path) {
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
  removeStringAfterMp4: _removeStringAfterMp4,
  urlFileName: _urlFileName,
  delete: _delete  
}
