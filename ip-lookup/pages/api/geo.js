export default async function handler(req, res) {
  try {
    const ipQuery = req.query.ip
    const rawIp = ipQuery ||
      (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()

    // Fallback to ipify if localhost
    let ipToLookup = rawIp
    if (!ipToLookup || ipToLookup.startsWith('127.') || ipToLookup === '::1') {
      const ipify = await fetch('https://api.ipify.org?format=json').then(r => r.json()).catch(() => null)
      if (ipify?.ip) ipToLookup = ipify.ip
    }

    const url = `http://ip-api.com/json/${encodeURIComponent(ipToLookup)}?fields=status,message,query,country,regionName,city,zip,lat,lon,timezone,isp,org,as`
    const r = await fetch(url)
    const data = await r.json()

    if (data.status !== 'success') {
      return res.status(400).json({ error: data.message || 'Lookup failed', providerResult: data })
    }
    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}
