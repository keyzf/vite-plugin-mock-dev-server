import bodyParser from 'co-body'
import formidable from 'formidable'
import type { Connect } from 'vite'
import { debug } from './utils'

export async function parseReqBody(req: Connect.IncomingMessage): Promise<any> {
  const method = req.method!.toUpperCase()
  if (['GET', 'DELETE', 'HEAD'].includes(method)) return undefined
  const type = req.headers['content-type']
  if (type === 'application/json') {
    return await bodyParser.json(req)
  }
  if (type === 'application/x-www-form-urlencoded') {
    return await bodyParser.form(req)
  }
  if (type === 'text/plain') {
    return await bodyParser.text(req)
  }
  if (type?.startsWith('multipart/form-data;')) {
    return await parseMultipart(req)
  }
  return undefined
}

async function parseMultipart(req: Connect.IncomingMessage): Promise<any> {
  const form = formidable({ multiples: true })
  debug('multiparty start')
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error)
        return
      }
      resolve({ ...fields, ...files })
    })
  })
}
