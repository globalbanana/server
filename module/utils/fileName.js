
function _removeStringAfterMp4 (name) {
  return name.substring(0, name.indexOf('mp4') + 3)
}

function _urlFileName (url) {
  const getName = url.split('/').pop()
  return _removeStringAfterMp4(getName)
}

module.exports = {
  removeStringAfterMp4: _removeStringAfterMp4,
  urlFileName: _urlFileName
}
