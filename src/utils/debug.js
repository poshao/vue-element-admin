import Cookies from 'js-cookie'

const PhpDebugToken = 'XDEBUG_SESSION'

export function getPhpDebugStatus() {
  return Cookies.get(PhpDebugToken) === 'xdebug'
}

export function setPhpDebugFlag(flag) {
  if (flag) {
    return Cookies.set(PhpDebugToken, 'xdebug')
  }
  return Cookies.remove(PhpDebugToken)
}
