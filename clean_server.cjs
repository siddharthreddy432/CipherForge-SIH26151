const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldFunc = code.substring(code.indexOf('async function searchThreatFox'), code.indexOf("app.post('/api/investigate'"));

const newFunc = `async function searchThreatFox(ioc: string) {
  if (!process.env.THREATFOX_AUTH_KEY) {
    return { status: 'NOT CONFIGURED' };
  }
  
  if (THREATFOX_CACHE.has(ioc)) {
    const cached = THREATFOX_CACHE.get(ioc)!;
    if (Date.now() - new Date(cached.retrievedAt).getTime() < 5 * 60 * 1000) {
      return { status: 'FOUND', data: cached.data, retrievedAt: cached.retrievedAt };
    }
  }
  
  try {
    const res = await fetch('https://threatfox-api.abuse.ch/api/v1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Auth-Key': process.env.THREATFOX_AUTH_KEY
      },
      body: JSON.stringify({
        query: 'search_ioc',
        search_term: ioc,
        exact_match: true
      }),
      signal: AbortSignal.timeout(5000)
    });
    
    if (!res.ok) {
      return { status: 'UNAVAILABLE' };
    }
    const json = await res.json();
    if (json.query_status === 'unknown_auth_key' || json.query_status === 'invalid_auth_key') {
      return { status: 'AUTHENTICATION ERROR' };
    }
    if (json.query_status === 'no_result') {
      return { status: 'NO MATCH FOUND' };
    }
    if (json.query_status === 'ok' && json.data && json.data.length > 0) {
      const resultData = json.data[0];
      const retrievedAt = new Date().toISOString();
      THREATFOX_CACHE.set(ioc, { data: resultData, retrievedAt });
      return { status: 'FOUND', data: resultData, retrievedAt };
    }
    return { status: 'UNAVAILABLE' };
  } catch (e) {
    return { status: 'UNAVAILABLE' };
  }
}

  `;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('server.ts', code);
