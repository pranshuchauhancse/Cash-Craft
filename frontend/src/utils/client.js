export async function api(path, { method='GET', body, token } = {}){
  const headers = { 'Content-Type': 'application/json' }
  const t = token || localStorage.getItem('token')
  if (t) headers['Authorization'] = `Bearer ${t}`

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const ct = res.headers.get('content-type') || ''
  const isJSON = ct.includes('application/json')
  const data = isJSON ? await res.json() : await res.text()

  if (!res.ok) {
    const message = (data && data.message) || res.statusText
    throw new Error(message)
  }
  return data
}
