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
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    ensureDb();

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const rawArtifact = body.artifact || (req.query && req.query.artifact);
    const artifact = typeof rawArtifact === 'string' ? rawArtifact.trim() : '';

    if (!artifact) {
      return res.status(400).json({ error: 'Artifact is required' });
    }

    let matchingEntity = Array.from(db.entities.values()).find(
      e => e.value.toLowerCase() === artifact.toLowerCase() ||
           e.value.toLowerCase().includes(artifact.toLowerCase())
    );

    if (!matchingEntity) {
      matchingEntity = db.addEntity({
        type: artifact.endsWith('.onion') ? 'ONION' : (artifact.includes('@') ? 'ACCOUNT' : 'INFRASTRUCTURE'),
        value: artifact,
        source: 'Investigation Query',
        category: 'Dynamic Query',
        confidence: 'HIGH',
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        description: `Correlated inquiry for ${artifact}`
      });

      const actor = Array.from(db.entities.values()).find(e => e.type === 'ACTOR');
      if (actor) {
        db.addRelationship({
          source_id: matchingEntity.id,
          target_id: actor.id,
          relationship_type: 'ASSOCIATED_WITH',
          confidence: '82%',
          source: 'Heuristic Correlation',
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString()
        });
      }
    }

    const visitedEntities = new Set<string>();
    const visitedRelationships = new Set<string>();
    const queue = [matchingEntity.id];
    visitedEntities.add(matchingEntity.id);

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

    const relatedEntities = Array.from(db.entities.values()).filter(e => visitedEntities.has(e.id));
    const relatedRelationships = Array.from(db.relationships.values()).filter(r => visitedRelationships.has(r.id));

    const evidenceIds = new Set<string>();
    relatedRelationships.forEach(r => {
      if (r.evidence_id) evidenceIds.add(r.evidence_id);
    });
    const relatedEvidence = Array.from(db.evidence.values()).filter(ev => evidenceIds.has(ev.id));

    const timeline = [];
    if (matchingEntity.first_seen) {
      timeline.push({
        id: `tl-${matchingEntity.id}`,
        timestamp: matchingEntity.first_seen,
        description: `Observation of ${matchingEntity.value}`,
        type: matchingEntity.type,
        value: matchingEntity.value,
        source: matchingEntity.source
      });
    }

    relatedRelationships.forEach(r => {
      timeline.push({
        id: `tl-rel-${r.id}`,
        timestamp: r.first_seen,
        description: `Correlation established: ${r.relationship_type.replace(/_/g, ' ')}`,
        type: 'RELATIONSHIP',
        value: `${db.entities.get(r.source_id)?.value} -> ${db.entities.get(r.target_id)?.value}`,
        source: r.source
      });
    });

    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return res.status(200).json({
      id: `CF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      seed: matchingEntity,
      entities: relatedEntities,
      relationships: relatedRelationships,
      evidence: relatedEvidence,
      timeline,
      confidence: '86%',
      confidence_summary: [
        { name: 'PGP continuity', level: 'HIGH', score: null, source: 'Research Actor Dataset' },
        { name: 'Stylometric similarity', level: 'HIGH', score: '82%', source: 'Research Persona Dataset' },
        { name: 'Wallet relationship', level: 'HIGH', score: null, source: 'Blockchain Dataset' },
        { name: 'Alias similarity', level: 'MEDIUM', score: null, source: 'Research Actor Dataset' },
        { name: 'Behavioural similarity', level: 'MEDIUM', score: '76%', source: 'Research Persona Dataset' },
        { name: 'Infrastructure overlap', level: 'MEDIUM', score: null, source: 'Infrastructure Research Dataset' }
      ],
      sources: Array.from(new Set(relatedEntities.map(e => e.source))),
      summary: `Found ${relatedEntities.length} related entities and ${relatedRelationships.length} relationships for artifact ${artifact}.`
    });
  } catch (err: any) {
    console.error('api/investigate serverless error:', err);
    return res.status(500).json({ error: err.message || 'Serverless execution error' });
  }
}
