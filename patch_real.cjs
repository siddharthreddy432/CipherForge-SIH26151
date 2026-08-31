const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

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

    fs.appendFileSync('trace.txt', "\\n--- THREATFOX REQUEST TRACE ---\\n");
    fs.appendFileSync('trace.txt', "Artifact: " + artifact + "\\n");

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

    fs.appendFileSync('trace.txt', "Detected Type: " + detectedType + "\\n");
    fs.appendFileSync('trace.txt', "Local Match: " + (matchingEntity ? "YES" : "NO") + "\\n");`;

code = code.replace(investigateRouteStart, newInvestigateRouteStart);

const tfCallStart = `    if (isIOC) {
      const tfResult = await searchThreatFox(artifact);`;

const newTfCallStart = `    if (isIOC) {
      fs.appendFileSync('trace.txt', "ThreatFox Called: YES\\n");
      const tfResult = await searchThreatFox(artifact);
      fs.appendFileSync('trace.txt', "HTTP Status: " + (tfResult._debugHttpStatus || 200) + "\\n");
      fs.appendFileSync('trace.txt', "query_status: " + (tfResult._debugQueryStatus || 'unknown') + "\\n");
      fs.appendFileSync('trace.txt', "Records: " + (tfResult._debugRecords || 0) + "\\n");
      fs.appendFileSync('trace.txt', "Normalization: " + (tfResult.status === 'FOUND' ? "YES" : "NO") + "\\n");
      fs.appendFileSync('trace.txt', "Entities Created: " + ((tfResult.status === 'FOUND' && !matchingEntity) ? "YES" : "NO") + "\\n");`;
      
code = code.replace(tfCallStart, newTfCallStart);

const endRoute = `    if (!matchingEntity) {
      if (externalIntelligence) {
        return res.status(404).json({ error: 'No intelligence found for artifact.', externalIntelligence });
      }
      return res.status(404).json({ error: 'No intelligence found for artifact. Try "demo.onion" or "ShadowByte".' });
    }

    res.json({`;

const newEndRoute = `    if (!matchingEntity) {
      fs.appendFileSync('trace.txt', "Final Investigation Status: 404 NOT FOUND\\n");
      if (externalIntelligence) {
        return res.status(404).json({ error: 'No intelligence found for artifact.', externalIntelligence });
      }
      return res.status(404).json({ error: 'No intelligence found for artifact. Try "demo.onion" or "ShadowByte".' });
    }

    fs.appendFileSync('trace.txt', "Final Investigation Status: 200 OK\\n");
    res.json({`;

code = code.replace(endRoute, newEndRoute);

// Patch searchThreatFox for debug fields
const tfReturn1 = `return { status: 'NO MATCH FOUND' };`;
const tfReturn2 = `return { status: 'FOUND', data: resultData, retrievedAt };`;
const tfReturn3 = `return { status: 'ERROR' };`;

code = code.replace(tfReturn1, `return { status: 'NO MATCH FOUND', _debugHttpStatus: res.status, _debugQueryStatus: json.query_status, _debugRecords: 0 };`);
code = code.replace(tfReturn2, `return { status: 'FOUND', data: resultData, retrievedAt, _debugHttpStatus: res.status, _debugQueryStatus: json.query_status, _debugRecords: json.data.length };`);
code = code.replace(tfReturn3, `return { status: 'ERROR', _debugHttpStatus: res ? res.status : 500, _debugQueryStatus: json ? json.query_status : 'unknown', _debugRecords: 0 };`);


fs.writeFileSync('server.ts', code);
