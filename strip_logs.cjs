const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/    fs\.appendFileSync\([^;]+;\n/g, '');
code = code.replace(/    console\.log\([^;]+;\n/g, '');
fs.writeFileSync('server.ts', code);
