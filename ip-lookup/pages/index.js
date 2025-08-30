import { useEffect, useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function doLookup(ip) {
    try {
      setLoading(true)
      setError(null)
      setData(null)
      const q = ip ? `?ip=${encodeURIComponent(ip)}` : ''
      const res = await fetch(`/api/geo${q}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { doLookup() }, [])

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌐 IP Lookup</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter IP (leave empty for your IP)"
          style={{ padding: '8px 10px', width: '70%', border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button
          onClick={() => doLookup(query)}
          style={{ marginLeft: 10, padding: '8px 14px', borderRadius: 4, border: 'none', background: '#222', color: '#fff' }}
        >
          Lookup
        </button>
        <button
          onClick={() => { setQuery(''); doLookup() }}
          style={{ marginLeft: 10, padding: '8px 14px', borderRadius: 4, border: '1px solid #222', background: '#fff', color: '#222' }}
        >
          My IP
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'red' }}>⚠️ {error}</div>}
      {data && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: 10 }}>Result</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
