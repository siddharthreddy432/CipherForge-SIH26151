import { db, initDemoData } from '../server/db';

let initialized = false;
function ensureDb() {
  if (!initialized) {
    if (db.entities.size === 0) {
      initDemoData();
    }
    initialized = true;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    ensureDb();
    const actors = Array.from(db.entities.values()).filter(e => e.type === 'ACTOR');
    const enhanced = actors.map(actor => {
      const relatedRels = Array.from(db.relationships.values()).filter(
        r => r.source_id === actor.id || r.target_id === actor.id
      );
      const relatedEntityIds = relatedRels.map(r => r.source_id === actor.id ? r.target_id : r.source_id);
      const relatedEntities = relatedEntityIds.map(id => db.entities.get(id)).filter(Boolean) as any[];

      return {
        ...actor,
        aliases: relatedEntities.filter(e => e.type === 'ALIAS').length,
        pgp: relatedEntities.filter(e => e.type === 'PGP_FINGERPRINT').length,
        wallets: relatedEntities.filter(e => e.type === 'WALLET').length,
        hidden_services: relatedEntities.filter(e => e.type === 'ONION').length,
        accounts: relatedEntities.filter(e => e.type === 'ACCOUNT').length,
        infrastructure: relatedEntities.filter(e => e.type === 'IP' || e.type === 'DOMAIN').length,
      };
    });
    return res.status(200).json(enhanced);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverless error' });
  }
}
