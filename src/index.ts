import { getAssets, getFavicon } from '@/src/assets'
import { Router, error } from 'itty-router'

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router()
    .handle(request, env, ctx)
    .catch(error)
}

const router = () => {
  const router = Router()
  router.all('/ping', () => new Response('Pong!\n'))
  router.get('/assets/:filename', getAssets)
  router.get('/favicon.ico', getFavicon)
  router.all('*', () => error(404, 'Invalid path.'))
  return router
}

export interface Env {
  assets: R2Bucket,
}
