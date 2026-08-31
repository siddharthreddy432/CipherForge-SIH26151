const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `        'Auth-Key': process.env.THREATFOX_AUTH_KEY`;

const newStr = `        'Auth-Key': 'invalid_key_for_test'`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('server.ts', code);
