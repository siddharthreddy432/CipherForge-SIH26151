const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
};

const files = walk('src/pages');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // We want to add animate-fade-up to major sections. We can find headers or standard containers.
  // A generic way is just to add animate-fade-up to the outermost div's children, but React doesn't let us easily do that via regex.
  // We can just add `.btn-motion` to anything that looks like a button
  content = content.replace(/className="([^"]*)bg-brand-accent([^"]*)"/g, (match, p1, p2) => {
    if (!match.includes('btn-motion')) return `className="${p1}bg-brand-accent${p2} btn-motion"`;
    return match;
  });

  // Table rows hover motion
  content = content.replace(/className="([^"]*)hover:bg-brand-border\/10([^"]*)"/g, (match, p1, p2) => {
    if (!match.includes('row-motion')) return `className="${p1}hover:bg-brand-border/10${p2} row-motion"`;
    return match;
  });

  fs.writeFileSync(file, content);
});

console.log("Stagger script applied.");
