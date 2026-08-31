const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `    if (!matchingEntity) {
      console.log("Final Investigation Status: 404 NOT FOUND");
      if (externalIntelligence) {
        return res.status(404).json({ error: 'No intelligence found for artifact.', externalIntelligence });
      }
      return res.status(404).json({ error: 'No intelligence found for artifact. Try "demo.onion" or "ShadowByte".' });
    }`;

const newStr = `    if (!matchingEntity) {
      if (externalIntelligence) {
        return res.status(200).json({
          id: \`CF-\${new Date().getFullYear()}-\${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}\`,
          seed: {
            id: 'entity-seed',
            type: detectedType as any,
            value: artifact,
            source: 'Unknown',
            category: 'Infrastructure',
            confidence: 'UNKNOWN',
            first_seen: new Date().toISOString(),
            last_seen: new Date().toISOString(),
            description: 'Seed artifact with no local records',
            last_scanned: new Date().toISOString()
          },
          entities: [],
          relationships: [],
          evidence: [],
          timeline: [],
          confidence: 'UNKNOWN',
          confidence_summary: [],
          sources: [externalIntelligence.source],
          summary: \`No local intelligence found for \${artifact}.\`,
          externalIntelligence
        });
      }
      return res.status(404).json({ error: 'No intelligence found for artifact. Try "demo.onion" or "ShadowByte".' });
    }`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('server.ts', code);
