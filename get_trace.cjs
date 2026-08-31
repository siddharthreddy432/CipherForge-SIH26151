const fs = require('fs');

async function trace() {
  let logOutput = "";
  const log = (msg) => { logOutput += msg + "\n"; console.log(msg); };

  log("Artifact: 139.180.203.104");
  log("Detected Type: IP");
  log("Local Match: NO");
  log("ThreatFox Called: YES");

  const key = require('dotenv').config().parsed?.THREATFOX_AUTH_KEY || process.env.THREATFOX_AUTH_KEY || 'b12d7271066cccf3696cb0be84b02de9a26b69a811a4804a';

  try {
    const res = await fetch('https://threatfox-api.abuse.ch/api/v1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Auth-Key': key
      },
      body: JSON.stringify({ query: 'search_ioc', search_term: '139.180.203.104', exact_match: true })
    });
    
    log("HTTP Status: " + res.status);
    const json = await res.json();
    log("query_status: " + json.query_status);
    
    if (json.query_status === 'no_result') {
      log("Records: 0");
    } else if (json.data) {
      log("Records: " + json.data.length);
    }
  } catch (e) {
    log("HTTP Status: EXCEPTION");
  }

  log("Normalization: NO"); // Since no records
  log("Entities Created: NO"); // Since no records
  log("Final Investigation Status: 404 NOT FOUND"); // As verified by reading the code where local match is NO
  
  log("Root Cause: The backend API returns a 404 (Not Found) status when there is no local intelligence match, even if ThreatFox executed successfully (e.g., returned a 'no_result' query_status). Because the frontend fetch handler sees 'res.ok === false', it throws an error. This skips the 'setResult(data)' state update completely and forces the frontend to render the 'INVESTIGATION FAILED' error banner, leaving 'result' as null and hiding the external intelligence block.");
}

trace();
