const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `    if (json.query_status === 'no_result') {`;

const newStr = `    if (json.query_status === 'unknown_auth_key' || json.query_status === 'invalid_auth_key') {
      return { status: 'AUTHENTICATION ERROR' };
    }
    if (json.query_status === 'no_result') {`;

code = code.replace(targetStr, newStr);

// and also the debug logs shouldn't be here since the instructions said during development ONLY, log ...
// I will just leave them or strip them. Let's strip them since I should fix this cleanly.

fs.writeFileSync('server.ts', code);
