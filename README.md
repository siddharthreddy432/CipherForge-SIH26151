# CipherForge

An end-to-end threat-actor intelligence and correlation platform that takes an investigative digital artifact as a starting point, collects authorized/public/research intelligence, normalizes it, correlates identifiers and infrastructure, discovers potentially related digital personas, calculates explainable correlation confidence, and presents the intelligence through dashboards, investigation graphs and exportable reports.

This is a prototype built for **Smart India Hackathon 2026** (Problem Statement ID: 26151 - NTRO).

## Architecture
The system consists of:
- **Frontend**: React + Tailwind CSS with Lucide Icons and D3.js for visual correlation graphs.
- **Backend**: Express + Node.js with an in-memory graph-oriented database simulation.
- **Data Model**: Entities (Actors, PGP, Wallets, Hidden Services, etc.) and Relationships (with explainable confidence and evidence).

## Key Capabilities
- **Dashboard Querying**: High-level statistical overview of ingested threat indicators.
- **Investigation Pipeline**: Enter an artifact (e.g., \`demo.onion\`) to automatically detect entity type and trigger persona correlation.
- **Explainable Confidence**: Confidence scores are backed by immutable evidence entries in the Evidence Ledger.
- **Exporting**: Export entire investigations or datasets in JSON and CSV formats.
- **Research / Demo Mode**: Secure sandbox mode operating on synthetic or imported research data. **CipherForge does not perform unauthorized deanonymization attacks or active exploitation.**

## Ethical & Legal Boundaries
- Operates strictly on authorized public information or research datasets.
- Does not interact with private PGP keys or attempt cryptographic breakage.
- Employs terms like "Potentially linked persona" rather than asserting definitive real-world identity proof.
