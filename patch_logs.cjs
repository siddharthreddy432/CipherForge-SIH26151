const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetFunction = `async function searchThreatFox(ioc: string) {
  if (!process.env.THREATFOX_AUTH_KEY) {
    return { status: 'NOT CONFIGURED' };
  }`;

const newFunction = `async function searchThreatFox(ioc: string) {
  console.log("--- THREATFOX REQUEST TRACE ---");
  console.log("Artifact:", ioc);

  if (!process.env.THREATFOX_AUTH_KEY) {
    console.log("ThreatFox Called: NO (NOT CONFIGURED)");
    return { status: 'NOT CONFIGURED' };
  }
  
  if (THREATFOX_CACHE.has(ioc)) {
    const cached = THREATFOX_CACHE.get(ioc)!;
    if (Date.now() - new Date(cached.retrievedAt).getTime() < 5 * 60 * 1000) {
      console.log("ThreatFox Called: YES (CACHED)");
      return { status: 'FOUND', data: cached.data, retrievedAt: cached.retrievedAt };
    }
  }
  
  try {
    console.log("ThreatFox Called: YES");
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
    
    console.log("HTTP Status:", res.status);
    if (!res.ok) {
      return { status: 'ERROR' };
    }
    const json = await res.json();
    console.log("query_status:", json.query_status);
    if (json.query_status === 'no_result') {
      console.log("Records: 0");
      return { status: 'NO MATCH FOUND' };
    }
    if (json.query_status === 'ok' && json.data && json.data.length > 0) {
      console.log("Records:", json.data.length);
      const resultData = json.data[0];
      const retrievedAt = new Date().toISOString();
      THREATFOX_CACHE.set(ioc, { data: resultData, retrievedAt });
      return { status: 'FOUND', data: resultData, retrievedAt };
    }
    return { status: 'ERROR' };
  } catch (e) {
    console.log("HTTP Status: EXCEPTION", e.message);
    return { status: 'TEMPORARILY UNAVAILABLE' };
  }
}`;

code = code.replace(`async function searchThreatFox(ioc: string) {
  if (!process.env.THREATFOX_AUTH_KEY) {
    return { status: 'NOT CONFIGURED' };
  }`, newFunction);

const investigateRouteStart = `  app.post('/api/investigate', async (req, res) => {
    const { artifact } = req.body;
    if (!artifact) return res.status(400).json({ error: 'Artifact is required' });

    let matchingEntity = Array.from(db.entities.values()).find(e => 
      e.value.toLowerCase() === artifact.toLowerCase() || 
      e.value.toLowerCase().includes(artifact.toLowerCase())
    );

    const isIP = /^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$/.test(artifact);
    const isDomain = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i.test(artifact);
    const isURL = /^https?:\\/\\//i.test(artifact);
    const isMD5 = /^[a-f0-9]{32}$/i.test(artifact);
    const isSHA256 = /^[a-f0-9]{64}$/i.test(artifact);
    const isIOC = isIP || isDomain || isURL || isMD5 || isSHA256;`;

const newInvestigateRouteStart = `  app.post('/api/investigate', async (req, res) => {
    const { artifact } = req.body;
    if (!artifact) return res.status(400).json({ error: 'Artifact is required' });

    let matchingEntity = Array.from(db.entities.values()).find(e => 
      e.value.toLowerCase() === artifact.toLowerCase() || 
      e.value.toLowerCase().includes(artifact.toLowerCase())
    );

    const isIP = /^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$/.test(artifact);
    const isDomain = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i.test(artifact);
    const isURL = /^https?:\\/\\//i.test(artifact);
    const isMD5 = /^[a-f0-9]{32}$/i.test(artifact);
    const isSHA256 = /^[a-f0-9]{64}$/i.test(artifact);
    const isIOC = isIP || isDomain || isURL || isMD5 || isSHA256;

    let detectedType = "UNKNOWN";
    if (isIP) detectedType = "IP";
    else if (isDomain) detectedType = "DOMAIN";
    else if (isURL) detectedType = "URL";
    else if (isMD5) detectedType = "MD5";
    else if (isSHA256) detectedType = "SHA256";

    console.log("Detected Type:", detectedType);
    console.log("Local Match:", matchingEntity ? "YES" : "NO");`;

code = code.replace(investigateRouteStart, newInvestigateRouteStart);

const normalizationStart = `        if (!matchingEntity) {
          let iocType = 'HASH';
          if (isIP) iocType = 'IP';
          else if (isDomain) iocType = 'DOMAIN';
          else if (isURL) iocType = 'URL';`;

const newNormalizationStart = `        console.log("Normalization: YES");
        if (!matchingEntity) {
          console.log("Entities Created: YES (Hydrated Root)");
          let iocType = 'HASH';
          if (isIP) iocType = 'IP';
          else if (isDomain) iocType = 'DOMAIN';
          else if (isURL) iocType = 'URL';`;

code = code.replace(normalizationStart, newNormalizationStart);

const return404 = `    if (!matchingEntity) {
      if (externalIntelligence) {
        return res.status(404).json({ error: 'No intelligence found for artifact.', externalIntelligence });
      }
      return res.status(404).json({ error: 'No intelligence found for artifact. Try "demo.onion" or "ShadowByte".' });
    }`;

const newReturn404 = `    if (!matchingEntity) {
      console.log("Final Investigation Status: 404 NOT FOUND");
      if (externalIntelligence) {
        return res.status(404).json({ error: 'No intelligence found for artifact.', externalIntelligence });
      }
      return res.status(404).json({ error: 'No intelligence found for artifact. Try "demo.onion" or "ShadowByte".' });
    }`;
    
code = code.replace(return404, newReturn404);

const return200 = `    res.json({
      id: \`CF-\${new Date().getFullYear()}-\${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}\`,`;

const newReturn200 = `    console.log("Final Investigation Status: 200 OK");
    res.json({
      id: \`CF-\${new Date().getFullYear()}-\${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}\`,`;

code = code.replace(return200, newReturn200);

fs.writeFileSync('server.ts', code);
