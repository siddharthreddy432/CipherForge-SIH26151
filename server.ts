import express from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { db, initDemoData, EntityType } from './server/db';
import Papa from 'papaparse';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize demo data
  initDemoData();

  // API Routes
  app.get('/api/search', (req, res) => {
    const q = (req.query.q || '').toString().toLowerCase();
    if (!q) return res.json([]);
    const results = Array.from(db.entities.values()).filter(e => 
      e.value.toLowerCase().includes(q) || 
      e.type.toLowerCase().includes(q)
    );
    res.json(results);
  });


  app.get('/api/stats', (req, res) => {
    const entities = Array.from(db.entities.values());
    const relationships = Array.from(db.relationships.values());
    res.json({
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
  });

  app.get('/api/entities', (req, res) => {
    res.json(Array.from(db.entities.values()));
  });
  
  app.get('/api/entities/:id', (req, res) => {
    const entity = db.entities.get(req.params.id);
    if (!entity) return res.status(404).json({ error: 'Entity not found' });
    res.json(entity);
  });

  app.get('/api/relationships', (req, res) => {
    res.json(Array.from(db.relationships.values()));
  });

    app.patch('/api/alerts/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const alert = db.alerts.get(id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    if (status === 'REVIEWED' || status === 'DISMISSED' || status === 'READ') {
        alert.read = true;
    } else if (status === 'NEW') {
        alert.read = false;
    }
    db.alerts.set(id, alert);
    res.json(alert);
  });

app.get('/api/alerts', (req, res) => {
    res.json(Array.from(db.alerts.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  });

  app.get('/api/evidence', (req, res) => {
    res.json(Array.from(db.evidence.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  });

  app.get('/api/sources', (req, res) => {
    res.json(Array.from(db.sources.values()).sort((a, b) => new Date(b.last_imported).getTime() - new Date(a.last_imported).getTime()));
  });

  app.get('/api/actors', (req, res) => {
    const actors = Array.from(db.entities.values()).filter(e => e.type === 'ACTOR');
    const enhancedActors = actors.map(actor => {
      const relatedRels = Array.from(db.relationships.values()).filter(r => r.source_id === actor.id || r.target_id === actor.id);
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
    res.json(enhancedActors);
  });

  app.get('/api/actors/:id', (req, res) => {
    const actor = db.entities.get(req.params.id);
    if (!actor || actor.type !== 'ACTOR') return res.status(404).json({ error: 'Actor not found' });

    const relatedRels = Array.from(db.relationships.values()).filter(r => r.source_id === actor.id || r.target_id === actor.id);
    const relatedEntities = relatedRels.map(r => {
      const targetId = r.source_id === actor.id ? r.target_id : r.source_id;
      const entity = db.entities.get(targetId);
      return { entity, relationship: r };
    }).filter(x => x.entity);

    const evidence = Array.from(db.evidence.values()).filter(ev =>
      relatedRels.some(r => r.evidence_id === ev.id)
    );

    res.json({
      actor,
      related: relatedEntities,
      evidence
    });
  });

  app.get('/api/infrastructure', (req, res) => {
    const onions = Array.from(db.entities.values()).filter(e => e.type === 'ONION');
    const enriched = onions.map(onion => {
      const relatedRels = Array.from(db.relationships.values()).filter(r => r.source_id === onion.id || r.target_id === onion.id);
      const relatedEntities = relatedRels.map(r => {
        const targetId = r.source_id === onion.id ? r.target_id : r.source_id;
        const entity = db.entities.get(targetId);
        return { entity, relationship: r };
      }).filter(x => x.entity);
      
      return {
        onion,
        related: relatedEntities
      };
    });
    res.json(enriched);
  });

  app.get('/api/blockchain', (req, res) => {
    const wallets = Array.from(db.entities.values()).filter(e => e.type === 'WALLET');
    const transactions = Array.from(db.entities.values()).filter(e => e.type === 'TRANSACTION');
    
    const enrichedWallets = wallets.map(wallet => {
      const relatedRels = Array.from(db.relationships.values()).filter(r => r.source_id === wallet.id || r.target_id === wallet.id);
      const relatedActors = relatedRels
        .map(r => db.entities.get(r.source_id === wallet.id ? r.target_id : r.source_id))
        .filter(e => e?.type === 'ACTOR');
        
      return {
        wallet,
        relatedActors
      };
    });
    
    const enrichedTransactions = transactions.map(tx => {
      const relatedRels = Array.from(db.relationships.values()).filter(r => r.source_id === tx.id || r.target_id === tx.id);
      const fromWallet = relatedRels.find(r => r.relationship_type === 'SENT_TRANSACTION')?.source_id;
      const toWallet = relatedRels.find(r => r.relationship_type === 'RECEIVED_TRANSACTION')?.target_id;
      return {
        transaction: tx,
        from: db.entities.get(fromWallet || ''),
        to: db.entities.get(toWallet || ''),
        confidence: 'HIGH',
        source: tx.source
      };
    });

    res.json({
      wallets: enrichedWallets,
      transactions: enrichedTransactions
    });
  });

  app.post('/api/persona', (req, res) => {
    const { actorValue, candidateValue } = req.body;
    // Simulate AI persona analysis response
    res.json({
      candidate: candidateValue || 'Shadow_Byte',
      linked_to: actorValue || 'ShadowByte',
      confidence: '86%',
      signals: [
        { name: 'PGP continuity', level: 'HIGH' },
        { name: 'Stylometric similarity', level: 'HIGH', score: '82%' },
        { name: 'Wallet relationship', level: 'HIGH' },
        { name: 'Alias similarity', level: 'MEDIUM' },
        { name: 'Behavioural similarity', level: 'MEDIUM', score: '76%' },
        { name: 'Infrastructure overlap', level: 'MEDIUM' }
      ]
    });
  });


const THREATFOX_CACHE = new Map<string, { data: any, retrievedAt: string }>();

async function searchThreatFox(ioc: string) {
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

  app.post('/api/investigate', async (req, res) => {
    const { artifact } = req.body;
    if (!artifact) return res.status(400).json({ error: 'Artifact is required' });


    let matchingEntity = Array.from(db.entities.values()).find(e => 
      e.value.toLowerCase() === artifact.toLowerCase() || 
      e.value.toLowerCase().includes(artifact.toLowerCase())
    );

    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(artifact);
    const isDomain = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i.test(artifact);
    const isURL = /^https?:\/\//i.test(artifact);
    const isMD5 = /^[a-f0-9]{32}$/i.test(artifact);
    const isSHA256 = /^[a-f0-9]{64}$/i.test(artifact);
    const isIOC = isIP || isDomain || isURL || isMD5 || isSHA256;

    let detectedType = "UNKNOWN";
    if (isIP) detectedType = "IP";
    else if (isDomain) detectedType = "DOMAIN";
    else if (isURL) detectedType = "URL";
    else if (isMD5) detectedType = "MD5";
    else if (isSHA256) detectedType = "SHA256";




    let externalIntelligence: any = null;

    if (isIOC) {
        const tfResult = await searchThreatFox(artifact);
                externalIntelligence = {
        source: 'ThreatFox',
        status: tfResult.status
      };
      
      if (tfResult.status === 'FOUND') {
        const tfData = tfResult.data;
        const retrievedAt = tfResult.retrievedAt;
        
        externalIntelligence.ioc = tfData.ioc;
        externalIntelligence.iocType = tfData.ioc_type;
        externalIntelligence.threatType = tfData.threat_type;
        externalIntelligence.threatTypeDescription = tfData.threat_type_desc;
        externalIntelligence.malware = tfData.malware;
        externalIntelligence.malwarePrintable = tfData.malware_printable;
        externalIntelligence.confidence = tfData.confidence_level;
        externalIntelligence.firstSeen = tfData.first_seen;
        externalIntelligence.lastSeen = tfData.last_seen;
        externalIntelligence.reporter = tfData.reporter;
        externalIntelligence.reference = tfData.reference;
        externalIntelligence.retrievedAt = retrievedAt;
        externalIntelligence.sourceRecordId = tfData.id;
        
            if (!matchingEntity) {
                let iocType = 'HASH';
          if (isIP) iocType = 'IP';
          else if (isDomain) iocType = 'DOMAIN';
          else if (isURL) iocType = 'URL';

          matchingEntity = db.addEntity({
            type: iocType as any,
            value: tfData.ioc,
            source: 'ThreatFox',
            category: 'Infrastructure',
            confidence: tfData.confidence_level ? `${tfData.confidence_level}%` : 'UNKNOWN',
            first_seen: tfData.first_seen || new Date().toISOString(),
            last_seen: tfData.last_seen || new Date().toISOString(),
            description: `External CTI IOC`
          });
        }
        
        const obsEntity = db.addEntity({
          type: 'OBSERVATION' as any,
          value: `ThreatFox Record ${tfData.id}`,
          source: 'ThreatFox',
          category: 'External CTI',
          confidence: tfData.confidence_level ? `${tfData.confidence_level}%` : 'UNKNOWN',
          first_seen: retrievedAt,
          last_seen: retrievedAt,
          description: `External Observation: ${tfData.threat_type_desc}`
        });
        
        const malwareEntity = db.addEntity({
          type: 'MALWARE' as any,
          value: tfData.malware_printable || tfData.malware || tfData.threat_type,
          source: 'ThreatFox',
          category: 'Threat',
          confidence: 'HIGH',
          first_seen: tfData.first_seen || retrievedAt,
          last_seen: tfData.last_seen || retrievedAt,
          description: `Identified by ThreatFox`
        });
        
        const tfEv = db.addEvidence({
          source: 'ThreatFox',
          description: `IOC matched external CTI record. Threat Type: ${tfData.threat_type}.`,
          timestamp: retrievedAt
        });
        
        db.addRelationship({
          source_id: matchingEntity.id,
          target_id: obsEntity.id,
          relationship_type: 'HAS_EXTERNAL_OBSERVATION',
          confidence: tfData.confidence_level ? `${tfData.confidence_level}%` : 'UNKNOWN',
          source: 'ThreatFox',
          first_seen: retrievedAt,
          last_seen: retrievedAt,
          evidence_id: tfEv.id
        });
        
        db.addRelationship({
          source_id: obsEntity.id,
          target_id: malwareEntity.id,
          relationship_type: 'INDICATES_MALWARE',
          confidence: tfData.confidence_level ? `${tfData.confidence_level}%` : 'UNKNOWN',
          source: 'ThreatFox',
          first_seen: retrievedAt,
          last_seen: retrievedAt,
          evidence_id: tfEv.id
        });
      }
    }

    if (!matchingEntity) {
      if (externalIntelligence) {
        return res.status(200).json({
          id: `CF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
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
          summary: `No local intelligence found for ${artifact}.`,
          externalIntelligence
        });
      }
      return res.status(404).json({ error: 'No intelligence found for artifact. Try "demo.onion" or "ShadowByte".' });
    }


    // BFS to find all connected entities and relationships
    const visitedEntities = new Set<string>();
    const visitedRelationships = new Set<string>();
    const queue = [matchingEntity.id];
    visitedEntities.add(matchingEntity.id);

    while (queue.length > 0) {
      const currentId = queue.shift();
      const rels = Array.from(db.relationships.values()).filter(r => 
        r.source_id === currentId || r.target_id === currentId
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
    
    // Gather Evidence
    const evidenceIds = new Set<string>();
    relatedRelationships.forEach(r => {
      if (r.evidence_id) evidenceIds.add(r.evidence_id);
    });
    const relatedEvidence = Array.from(db.evidence.values()).filter(ev => evidenceIds.has(ev.id));

    // Timeline events
    const timeline = [];
    relatedEntities.forEach(e => {
      timeline.push({
        id: `entity-${e.id}`,
        type: e.type,
        value: e.value,
        timestamp: e.first_seen,
        source: e.source,
        description: `${e.type.replace(/_/g, ' ')} OBSERVED`
      });
    });
    relatedRelationships.forEach(r => {
      timeline.push({
        id: `rel-${r.id}`,
        type: 'RELATIONSHIP',
        value: r.relationship_type,
        timestamp: r.first_seen,
        source: r.source,
        description: `RELATIONSHIP OBSERVED: ${r.relationship_type.replace(/_/g, ' ')}`
      });
    });
    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.json({
      id: `CF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      seed: matchingEntity,
      entities: relatedEntities,
      relationships: relatedRelationships,
      evidence: relatedEvidence,
      timeline: timeline,
      confidence: '86%', // Keep default confidence so we don't assume attribution from ThreatFox
      confidence_summary: [
        { name: 'PGP continuity', level: 'HIGH', score: null, source: 'Research Actor Dataset' },
        { name: 'Stylometric similarity', level: 'HIGH', score: '82%', source: 'Research Persona Dataset' },
        { name: 'Wallet relationship', level: 'HIGH', score: null, source: 'Blockchain Dataset' },
        { name: 'Alias similarity', level: 'MEDIUM', score: null, source: 'Research Actor Dataset' },
        { name: 'Behavioural similarity', level: 'MEDIUM', score: '76%', source: 'Research Persona Dataset' },
        { name: 'Infrastructure overlap', level: 'MEDIUM', score: null, source: 'Infrastructure Research Dataset' }
      ],
      sources: Array.from(new Set(relatedEntities.map(e => e.source))),
      summary: `Found ${relatedEntities.length} related entities and ${relatedRelationships.length} relationships for artifact ${artifact}.`,
      externalIntelligence
    });
  });


  app.post('/api/ingest', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    let imported = 0;
    let duplicates = 0;
    let invalid = 0;
    
    // Simulate updating source stats
    const sourceName = 'Manual Upload ' + new Date().toISOString().split('T')[0];
    db.addSource({
       name: sourceName,
       type: 'Investigator Dataset',
       description: `Uploaded file: ${req.file.originalname}`,
       record_count: 0,
       entity_count: 0,
       relationship_count: 0,
       last_imported: new Date().toISOString(),
       last_scanned: new Date().toISOString(),
       status: 'AVAILABLE'
    });

    const processRow = (row: any) => {
      if (!row.entity_value || !row.entity_type) {
        invalid++;
        return;
      }
      const existing = Array.from(db.entities.values()).find(e => e.type === row.entity_type.toUpperCase() && e.value === row.entity_value);
      if (existing) {
        duplicates++;
        return;
      }

      db.addEntity({
        type: (row.entity_type.toUpperCase() as EntityType) || 'ALIAS',
        value: row.entity_value,
        source: row.source || sourceName,
        category: row.category || 'Other',
        first_seen: row.first_seen || new Date().toISOString(),
        last_seen: row.last_seen || new Date().toISOString(),
        confidence: row.confidence || 'MEDIUM',
        description: row.description || 'Imported via file upload'
      });
      imported++;
    };
    
    if (req.file.originalname.endsWith('.csv')) {
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          results.data.forEach(processRow);
          res.json({
            success: true,
            records_received: results.data.length,
            valid_records: imported + duplicates,
            duplicates: duplicates,
            invalid_records: invalid,
            new_entities: imported,
            new_relationships: 0
          });
        }
      });
    } else if (req.file.originalname.endsWith('.json')) {
      try {
        const data = JSON.parse(fileContent);
        const rows = Array.isArray(data) ? data : (data.entities || []);
        rows.forEach(processRow);
        res.json({
            success: true,
            records_received: rows.length,
            valid_records: imported + duplicates,
            duplicates: duplicates,
            invalid_records: invalid,
            new_entities: imported,
            new_relationships: 0
        });
      } catch(e) {
        res.status(400).json({ error: 'Invalid JSON file' });
      }
    } else {
      res.status(400).json({ error: 'Unsupported file type. Please use CSV or JSON.' });
    }
  });

  const traverseGraph = (seedValue) => {
    const seed = Array.from(db.entities.values()).find(e => e.value.toLowerCase() === seedValue.toLowerCase() || e.value.toLowerCase().includes(seedValue.toLowerCase()));
    if (!seed) return { entities: [], relationships: [] };
    const visitedEntities = new Set();
    const visitedRelationships = new Set();
    const queue = [seed.id];
    visitedEntities.add(seed.id);
    while (queue.length > 0) {
      const currentId = queue.shift();
      const rels = Array.from(db.relationships.values()).filter(r => r.source_id === currentId || r.target_id === currentId);
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
  };

    app.get('/api/reports', (req, res) => {
    // Generate some mock reports based on actors
    const actors = Array.from(db.entities.values()).filter(e => e.type === 'ACTOR');
    const reports = actors.map((a, i) => {
       return {
          id: `REP-2026-${Math.floor(1000 + i)}`,
          investigation_id: `CF-2026-${Math.floor(1000 + i)}`,
          seed: a.value,
          created: new Date().toISOString(),
          entities_count: Math.floor(Math.random() * 50) + 10,
          relationships_count: Math.floor(Math.random() * 30) + 5,
          sources_count: 3,
          confidence: a.confidence,
          status: 'COMPLETED'
       };
    });
    // Add one for demo.onion
    reports.unshift({
        id: 'REP-2026-9999',
        investigation_id: 'CF-2026-0001',
        seed: 'demo.onion',
        created: new Date().toISOString(),
        entities_count: 12,
        relationships_count: 8,
        sources_count: 4,
        confidence: '86%',
        status: 'COMPLETED'
    });
    res.json(reports);
  });

app.get('/api/export/csv', (req, res) => {
    const seed = req.query.seed;
    let entities = [];
    if (seed) {
        entities = traverseGraph(seed).entities;
    } else {
        entities = Array.from(db.entities.values());
    }
    const csv = Papa.unparse(entities);
    res.header('Content-Type', 'text/csv');
    res.attachment('export.csv');
    res.send(csv);
  });

  app.get('/api/export/json', (req, res) => {
    const seed = req.query.seed;
    let data;
    if (seed) {
        data = traverseGraph(seed);
    } else {
        data = {
          entities: Array.from(db.entities.values()),
          relationships: Array.from(db.relationships.values()),
          evidence: Array.from(db.evidence.values())
        };
    }
    res.header('Content-Type', 'application/json');
    res.attachment('export.json');
    res.send(JSON.stringify(data, null, 2));
  });

  app.get('/api/export/report', (req, res) => {
    const seed = req.query.seed;
    let entities, relationships;
    if (seed) {
        const result = traverseGraph(seed);
        entities = result.entities;
        relationships = result.relationships;
    } else {
        entities = Array.from(db.entities.values());
        relationships = Array.from(db.relationships.values());
    }
    const actors = entities.filter(e => e.type === 'ACTOR');
    
    let report = `CIPHERFORGE INVESTIGATION REPORT
`;
    report += `Generated: ${new Date().toISOString()}
`;
    if (seed) {
       report += `Seed Artifact: ${seed}
`;
    }
    report += `=====================================

`;
    
    report += `SUMMARY:
`;
    report += `- Total Entities: ${entities.length}
`;
    report += `- Total Relationships: ${relationships.length}
`;
    report += `- Threat Actors Identified: ${actors.length}

`;
    
    actors.forEach(actor => {
      report += `ACTOR PROFILE: ${actor.value}
`;
      report += `Category: ${actor.category}
`;
      report += `Confidence: ${actor.confidence}
`;
      report += `First Seen: ${actor.first_seen}
`;
      report += `Last Seen: ${actor.last_seen}
`;
      report += `Sources: ${actor.source}

`;
      
      const relatedRels = relationships.filter(r => r.source_id === actor.id || r.target_id === actor.id);
      report += `ASSOCIATED INDICATORS (${relatedRels.length}):
`;
      relatedRels.forEach(rel => {
        const otherId = rel.source_id === actor.id ? rel.target_id : rel.source_id;
        const other = entities.find(e => e.id === otherId);
        if (other) {
          report += `- [${other.type}] ${other.value} (Confidence: ${rel.confidence}, Source: ${rel.source})
`;
        }
      });
      report += `
-------------------------------------

`;
    });
    
    res.header('Content-Type', 'text/plain');
    res.attachment('investigation_report.txt');
    res.send(report);
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
  });
}

startServer();
