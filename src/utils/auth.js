import Cookies from 'js-cookie'

const TokenKey = 'XToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getWorkid() {
  return Cookies.get('workid')
}

export function setWorkid(workid) {
  return Cookies.set('workid', workid)
}

export function removeWorkid() {
  return Cookies.remove('workid')
}
