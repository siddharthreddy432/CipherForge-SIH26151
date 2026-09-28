import { db, initDemoData } from '../server/db';
import Papa from 'papaparse';

let initialized = false;
function ensureDb() {
  if (!initialized) {
    if (db.entities.size === 0) {
      initDemoData();
    }
    initialized = true;
  }
}

function traverseGraph(seedValue: string) {
  ensureDb();
  const seed = Array.from(db.entities.values()).find(
    e => e.value.toLowerCase() === seedValue.toLowerCase() || e.value.toLowerCase().includes(seedValue.toLowerCase())
  );
  if (!seed) {
    return {
      entities: Array.from(db.entities.values()),
      relationships: Array.from(db.relationships.values())
    };
  }
  const visitedEntities = new Set<string>();
  const visitedRelationships = new Set<string>();
  const queue = [seed.id];
  visitedEntities.add(seed.id);
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const rels = Array.from(db.relationships.values()).filter(
      r => r.source_id === currentId || r.target_id === currentId
    );
    for (const r of rels) {
      if (!visitedRelationships.has(r.id)) {
        visitedRelationships.add(r.id);
        const nextId = r.source_id === currentId ? r.target_id : r.source_id;
        if (!visitedEntities.has(nextId)) {
          visitedEntities.add(nextId);
          queue.push(nextId);
        }
      }
    }
  }
  return {
    entities: Array.from(db.entities.values()).filter(e => visitedEntities.has(e.id)),
    relationships: Array.from(db.relationships.values()).filter(r => visitedRelationships.has(r.id))
  };
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
    const url = req.url || '';
    const seed = (req.query?.seed as string) || '';
    
    let format = 'json';
    if (url.includes('/csv') || req.query?.format === 'csv') format = 'csv';
    else if (url.includes('/report') || req.query?.format === 'report') format = 'report';

    const { entities, relationships } = traverseGraph(seed);

    if (format === 'csv') {
      const csv = Papa.unparse(entities.length > 0 ? entities : Array.from(db.entities.values()));
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="cipherforge-${(seed || 'dataset').replace(/[^a-zA-Z0-9_-]/g, '_')}.csv"`);
      return res.status(200).send(csv);
    }

    if (format === 'report') {
      const actors = entities.filter(e => e.type === 'ACTOR');
      let text = `CIPHERFORGE INTELLIGENCE CASE REPORT\n`;
      text += `Generated: ${new Date().toISOString()}\n`;
      if (seed) text += `Seed Artifact: ${seed}\n`;
      text += `=====================================\n\n`;
      text += `Total Entities: ${entities.length}\n`;
      text += `Total Relationships: ${relationships.length}\n`;
      text += `Threat Actors: ${actors.map(a => a.value).join(', ') || 'None'}\n`;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(text);
    }

    const exportData = {
      seed: seed || 'ALL',
      exported_at: new Date().toISOString(),
      entities: entities.length > 0 ? entities : Array.from(db.entities.values()),
      relationships: relationships.length > 0 ? relationships : Array.from(db.relationships.values()),
      evidence: Array.from(db.evidence.values())
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="cipherforge-${(seed || 'dataset').replace(/[^a-zA-Z0-9_-]/g, '_')}.json"`);
    return res.status(200).json(exportData);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Export error' });
  }
}
