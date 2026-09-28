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
    const entities = Array.from(db.entities.values());
    const relationships = Array.from(db.relationships.values());
    return res.status(200).json({
      total_entities: entities.length,
      total_actors: entities.filter(e => e.type === 'ACTOR').length,
      total_aliases: entities.filter(e => e.type === 'ALIAS').length,
      pgp_keys: entities.filter(e => e.type === 'PGP_FINGERPRINT').length,
      wallets: entities.filter(e => e.type === 'WALLET').length,
      transactions: entities.filter(e => e.type === 'TRANSACTION').length,
      hidden_services: entities.filter(e => e.type === 'ONION').length,
      certificates: entities.filter(e => e.type === 'CERTIFICATE').length,
      infrastructure: entities.filter(e => e.type === 'INFRASTRUCTURE' || e.type === 'IP' || e.type === 'DOMAIN').length,
      relationships: relationships.length,
      high_confidence_links: relationships.filter(r => r.confidence === 'HIGH' || parseInt(r.confidence) > 80).length,
      persona_links: relationships.filter(r => r.relationship_type === 'POTENTIALLY_LINKED').length,
      recent_alerts: Array.from(db.alerts.values()).length,
      last_scan: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Serverless error' });
  }
}
