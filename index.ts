import { IRequest, Router, error, json } from 'itty-router'

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router()
    .handle(request, env, ctx)
    .catch(error)
}

function router() {
  const router = Router()
  router.all('/ping', () => json('Pong!'))
  router.all('/version', (_, env: Env) => json(env.VERSION))
  router.get('/assets/:filename', getAssets)
  router.get('/favicon.ico', getFavicon)
  router.all('*', () => error(404, 'Invalid path.'))
  return router
}

async function getAssets(request: IRequest, env: Env) {
  const { params: { filename } } = request
  const site = new URL(request.url).host
  const key = [site, filename].join('/')
  return getItem(env.assets, key)
}

async function getFavicon(request: IRequest, env: Env) {
  const site = new URL(request.url).host
  const key = [site, 'favicon.ico'].join('/')
  return getItem(env.assets, key)
}

async function getItem(bucket: R2Bucket, key: string,) {
  const item = await bucket.get(key)
  if (item === null) return error(404, 'Site icon not found.')
  const headers = new Headers()
  item.writeHttpMetadata(headers)
  return new Response(item.body, { headers })
}

export interface Env {
  VERSION: string,
  assets: R2Bucket,
}
