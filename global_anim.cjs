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

  // Staggering main containers (crudely add stagger to top level children if possible)
  // Dashboard specific stagger:
  if (file.includes('Dashboard.tsx')) {
    content = content.replace(/<div className="space-y-6 max-w-4xl">/, '<div className="space-y-6 max-w-4xl animate-fade-up stagger-1">');
    content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-3 gap-12">/, '<div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-up stagger-2">');
    content = content.replace(/<div className="grid grid-cols-1 xl:grid-cols-2 gap-16 border-t border-[#1A1C20] pt-16">/, '<div className="grid grid-cols-1 xl:grid-cols-2 gap-16 border-t border-[#1A1C20] pt-16 animate-fade-up stagger-3">');
    content = content.replace(/<div className="border-t border-[#1A1C20] pt-16">/, '<div className="border-t border-[#1A1C20] pt-16 animate-fade-up stagger-4">');
  }

  // Button hover motion: hover:-translate-y-px active:translate-y-0 transition-transform duration-200 ease-smooth
  // Look for generic buttons
  content = content.replace(/className="([^"]*bg-brand-accent[^"]*px-.*py-.*)"/g, 'className="$1 hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-smooth"');
  
  // Table rows hover motion
  content = content.replace(/className="([^"]*hover:bg-[#0A0C0E]\/80[^"]*)"/g, 'className="$1 transition-colors duration-200 ease-smooth"');

  fs.writeFileSync(file, content);
});

// Update standard layout CSS transitions
let css = fs.readFileSync('src/index.css', 'utf-8');
if (!css.includes('.btn-motion')) {
  css = css.replace(/@layer utilities \{/, `@layer utilities {
  .btn-motion {
    @apply hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 ease-smooth;
  }
  .row-motion {
    @apply transition-colors duration-200 ease-smooth;
  }
  `);
  fs.writeFileSync('src/index.css', css);
}

console.log("Global animation patterns applied");
