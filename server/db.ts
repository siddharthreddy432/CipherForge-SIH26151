import { v4 as uuidv4 } from 'uuid';

export type EntityType = 'ACTOR' | 'ALIAS' | 'PGP_FINGERPRINT' | 'WALLET' | 'TRANSACTION' | 'DOMAIN' | 'ONION' | 'IP' | 'ACCOUNT' | 'FORUM' | 'MARKETPLACE' | 'EMAIL' | 'INFRASTRUCTURE' | 'HASH' | 'CERTIFICATE' | 'OBSERVATION' | 'MALWARE';

export interface Entity {
  id: string;
  type: EntityType;
  value: string;
  source: string;
  first_seen: string;
  last_seen: string;
  last_scanned: string;
  category: string;
  confidence: string;
  description: string;
}

export interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  confidence: string;
  source: string;
  evidence_id?: string;
  first_seen: string;
  last_seen: string;
}

export interface Evidence {
  id: string;
  description: string;
  timestamp: string;
  source: string;
  hash: string;
  previous_hash?: string;
}

export interface Alert {
  id: string;
  message: string;
  timestamp: string;
  evidence_id?: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  read: boolean;
}

export interface Source {
  id: string;
  name: string;
  type: string;
  description: string;
  record_count: number;
  entity_count: number;
  relationship_count: number;
  last_imported: string;
  last_scanned: string;
  status: string;
}

class InMemoryDB {
  entities: Map<string, Entity> = new Map();
  relationships: Map<string, Relationship> = new Map();
  evidence: Map<string, Evidence> = new Map();
  alerts: Map<string, Alert> = new Map();
  sources: Map<string, Source> = new Map();

  addSource(source: Omit<Source, 'id'>): Source {
    const id = uuidv4();
    const newSource = { ...source, id };
    this.sources.set(id, newSource);
    return newSource;
  }

  addEntity(entity: Omit<Entity, 'id' | 'last_scanned'>): Entity {
    const existing = Array.from(this.entities.values()).find(e => e.type === entity.type && e.value === entity.value);
    if (existing) {
      // Update timestamps if needed
      if (new Date(entity.last_seen) > new Date(existing.last_seen)) {
        existing.last_seen = entity.last_seen;
        existing.last_scanned = new Date().toISOString();
      }
      return existing;
    }
    const id = uuidv4();
    const newEntity = { ...entity, id, last_scanned: new Date().toISOString() };
    this.entities.set(id, newEntity);
    return newEntity;
  }

  addRelationship(rel: Omit<Relationship, 'id'>): Relationship {
    const id = uuidv4();
    const newRel = { ...rel, id };
    this.relationships.set(id, newRel);
    return newRel;
  }

  addEvidence(ev: Omit<Evidence, 'id' | 'hash'>): Evidence {
    const id = uuidv4();
    // Simple mock hash
    const hash = `ev_hash_${id.substring(0, 8)}`; 
    const newEv = { ...ev, id, hash };
    this.evidence.set(id, newEv);
    return newEv;
  }

  addAlert(alert: Omit<Alert, 'id' | 'read'>): Alert {
    const id = uuidv4();
    const newAlert = { ...alert, id, read: false };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  clear() {
    this.entities.clear();
    this.relationships.clear();
    this.evidence.clear();
    this.alerts.clear();
    this.sources.clear();
  }
}

export const db = new InMemoryDB();

// Initialize Demo Data
export function initDemoData() {
  db.clear();
  
  const source1 = db.addSource({ name: 'Research Actor Dataset', type: 'Research Dataset', description: 'Curated intelligence regarding known threat actors and aliases.', record_count: 1842, entity_count: 723, relationship_count: 341, last_imported: '2026-08-30T10:00:00Z', last_scanned: '2026-08-30T10:00:00Z', status: 'AVAILABLE' });
  const source2 = db.addSource({ name: 'Blockchain Dataset', type: 'Blockchain Dataset', description: 'Financial transactions and wallet relationships.', record_count: 59302, entity_count: 12400, relationship_count: 45000, last_imported: '2026-08-29T14:30:00Z', last_scanned: '2026-08-29T14:30:00Z', status: 'AVAILABLE' });
  const source3 = db.addSource({ name: 'OSINT', type: 'Investigator Dataset', description: 'Open-source intelligence manually collected.', record_count: 340, entity_count: 150, relationship_count: 112, last_imported: '2026-08-28T09:15:00Z', last_scanned: '2026-08-28T09:15:00Z', status: 'AVAILABLE' });

  const actor = db.addEntity({ type: 'ACTOR', value: 'ShadowByte', source: 'Research Actor Dataset', first_seen: '2026-01-12', last_seen: '2026-08-29', category: 'Data Leak', confidence: '86%', description: 'Known threat actor specializing in data leaks.' });
  const alias = db.addEntity({ type: 'ALIAS', value: 'Shadow_Byte', source: 'Research Actor Dataset', first_seen: '2026-01-15', last_seen: '2026-08-29', category: 'Data Leak', confidence: '90%', description: 'Alternate spelling of primary alias.' });
  const pgp = db.addEntity({ type: 'PGP_FINGERPRINT', value: 'A1B2-C3D4-E5F6-7890', source: 'Research Actor Dataset', first_seen: '2026-02-01', last_seen: '2026-08-29', category: 'Data Leak', confidence: 'HIGH', description: 'PGP key associated with ShadowByte.' });
  const wallet = db.addEntity({ type: 'WALLET', value: 'bc1qxyzexample987', source: 'Blockchain Dataset', first_seen: '2026-03-02', last_seen: '2026-08-29', category: 'Financial', confidence: 'HIGH', description: 'Wallet used for leak purchases.' });
  const onion = db.addEntity({ type: 'ONION', value: 'demo.onion', source: 'Research Actor Dataset', first_seen: '2026-05-10', last_seen: '2026-08-29', category: 'Data Leak', confidence: 'MEDIUM', description: 'Hidden service hosting leaks.' });
  const account = db.addEntity({ type: 'ACCOUNT', value: 'ShadowByte@ExploitForum', source: 'OSINT', first_seen: '2026-06-09', last_seen: '2026-08-29', category: 'Data Leak', confidence: 'HIGH', description: 'Forum account.' });

  const ev1 = db.addEvidence({ description: 'PGP continuity detected on exploit forum profile', timestamp: '2026-02-14', source: 'Research Actor Dataset' });
  const ev2 = db.addEvidence({ description: 'Wallet address found on hidden service donation page', timestamp: '2026-03-02', source: 'Blockchain Dataset', previous_hash: ev1.hash });

  db.addRelationship({ source_id: actor.id, target_id: alias.id, relationship_type: 'ALIAS_OF', confidence: '90%', source: 'Research Actor Dataset', first_seen: '2026-01-15', last_seen: '2026-08-29' });
  db.addRelationship({ source_id: actor.id, target_id: pgp.id, relationship_type: 'USES_PGP', confidence: '95%', source: 'Research Actor Dataset', evidence_id: ev1.id, first_seen: '2026-02-01', last_seen: '2026-08-29' });
  db.addRelationship({ source_id: actor.id, target_id: wallet.id, relationship_type: 'USES_WALLET', confidence: '85%', source: 'Blockchain Dataset', evidence_id: ev2.id, first_seen: '2026-03-02', last_seen: '2026-08-29' });
  db.addRelationship({ source_id: onion.id, target_id: actor.id, relationship_type: 'HOSTED_BY', confidence: '70%', source: 'Research Actor Dataset', first_seen: '2026-05-10', last_seen: '2026-08-29' });
  db.addRelationship({ source_id: account.id, target_id: actor.id, relationship_type: 'ACCOUNT_OF', confidence: '90%', source: 'OSINT', first_seen: '2026-06-09', last_seen: '2026-08-29' });

  db.addAlert({ message: 'NEW PGP CONTINUITY SIGNAL DETECTED FOR ShadowByte', timestamp: '2026-02-14', severity: 'HIGH', evidence_id: ev1.id });
  db.addAlert({ message: 'NEW WALLET RELATIONSHIP OBSERVED ON demo.onion', timestamp: '2026-03-02', severity: 'HIGH', evidence_id: ev2.id });

  // Phase 3 Data: Blockchain
  const walletB = db.addEntity({ type: 'WALLET', value: 'bc1qtestrecipient456', source: 'Blockchain Dataset', first_seen: '2026-03-15', last_seen: '2026-08-20', category: 'Financial', confidence: 'HIGH', description: 'Known recipient wallet.' });
  const transaction = db.addEntity({ type: 'TRANSACTION', value: 'tx_987654321abcdef', source: 'Blockchain Dataset', first_seen: '2026-03-15', last_seen: '2026-03-15', category: 'Financial', confidence: 'HIGH', description: 'Transaction between demo wallet and recipient.' });
  db.addRelationship({ source_id: wallet.id, target_id: transaction.id, relationship_type: 'SENT_TRANSACTION', confidence: 'HIGH', source: 'Blockchain Dataset', first_seen: '2026-03-15', last_seen: '2026-03-15' });
  db.addRelationship({ source_id: transaction.id, target_id: walletB.id, relationship_type: 'RECEIVED_TRANSACTION', confidence: 'HIGH', source: 'Blockchain Dataset', first_seen: '2026-03-15', last_seen: '2026-03-15' });

  // Phase 3 Data: Infrastructure
  const cert = db.addEntity({ type: 'CERTIFICATE', value: 'SHA256:XX:YY:ZZ', source: 'Infrastructure Research Dataset', first_seen: '2026-05-03', last_seen: '2026-08-25', category: 'Infrastructure', confidence: 'MEDIUM', description: 'Observed certificate metadata.' });
  const clearnetDomain = db.addEntity({ type: 'DOMAIN', value: 'demo-example.invalid', source: 'Infrastructure Research Dataset', first_seen: '2026-05-03', last_seen: '2026-08-25', category: 'Infrastructure', confidence: 'MEDIUM', description: 'Clearnet domain associated with certificate.' });
  const ipIndicator = db.addEntity({ type: 'IP', value: '198.51.100.42', source: 'Infrastructure Research Dataset', first_seen: '2026-05-05', last_seen: '2026-08-20', category: 'Infrastructure', confidence: 'LOW', description: 'Hosting IP observation.' });
  
  db.addRelationship({ source_id: onion.id, target_id: cert.id, relationship_type: 'USES_CERTIFICATE', confidence: 'MEDIUM', source: 'Infrastructure Research Dataset', first_seen: '2026-05-03', last_seen: '2026-08-25' });
  db.addRelationship({ source_id: cert.id, target_id: clearnetDomain.id, relationship_type: 'ASSOCIATED_WITH', confidence: 'MEDIUM', source: 'Infrastructure Research Dataset', first_seen: '2026-05-03', last_seen: '2026-08-25' });
  db.addRelationship({ source_id: clearnetDomain.id, target_id: ipIndicator.id, relationship_type: 'RESOLVES_TO', confidence: 'LOW', source: 'Infrastructure Research Dataset', first_seen: '2026-05-05', last_seen: '2026-08-20' });

  // Phase 3 Data: Persona
  const candidateAlias = db.addEntity({ type: 'ALIAS', value: 'Shadow_Byte', source: 'Research Persona Dataset', first_seen: '2026-08-20', last_seen: '2026-08-29', category: 'Data Leak', confidence: 'HIGH', description: 'Candidate persona for stylometric analysis.' });
  db.addRelationship({ source_id: actor.id, target_id: candidateAlias.id, relationship_type: 'POTENTIALLY_LINKED', confidence: '86%', source: 'Research Persona Dataset', first_seen: '2026-08-20', last_seen: '2026-08-29' });
}
