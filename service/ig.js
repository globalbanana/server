import fetch from 'isomorphic-fetch'
var queryString = require('query-string');

const getUserProfile = (igName) => {
    const url = `https://www.instagram.com/${igName}/?__a=1`
    return fetch(url).then( res => res.json())
}

const getMediaByCode = (code) => {
    const url = `https://www.instagram.com/p/${code}/?__a=1`
    return fetch(url).then( res => res.json())
}

export {getUserProfile, getMediaByCode}
export default {getUserProfile, getMediaByCode}

