let baseURL = document.location.protocol == 'https:' ? process.env.CONFIG_ASSET_URL_HTTPS : process.env.CONFIG_ASSET_URL
const base = (baseURL || '').replace(/\/$/, '')

global.asset = function asset(pathname) {
  return base + pathname
}
