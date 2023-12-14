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
  router.get('/assets/:filename', get)
  router.all('*', () => error(404, 'Invalid path.'))
  return router
}

export async function get(request: IRequest, env: Env) {
  const { params: { filename } } = request
  const site = new URL(request.url).hostname
  const key = [site, filename].join('/')
  const item = await env.assets.get(key)
  if (item === null) return error(404, 'File not found.')
  const headers = new Headers()
  item.writeHttpMetadata(headers)
  return new Response(item.body, { headers })
}

export interface Env {
  VERSION: string,
  assets: R2Bucket,
}
