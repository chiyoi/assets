import { Env } from '@/app'
import { IRequest, error } from 'itty-router'

export const getAssets = async (request: IRequest, env: Env) => {
  const { params: { filename } } = request
  const site = new URL(request.url).host
  const key = [site, decodeURIComponent(filename)].join('/')
  return getItem(env.assets, key)
}

export const getFavicon = async (request: IRequest, env: Env) => {
  const site = new URL(request.url).host
  const key = [site, 'favicon.ico'].join('/')
  return getItem(env.assets, key)
}

export const getItem = async (bucket: R2Bucket, key: string,) => {
  const item = await bucket.get(key)
  if (item === null) return error(404, 'Asset not found.')
  const headers = new Headers()
  item.writeHttpMetadata(headers)
  return new Response(item.body, { headers })
}
