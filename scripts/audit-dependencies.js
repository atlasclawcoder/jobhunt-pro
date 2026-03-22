#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

// Find all import statements in source files
function findImports(dir) {
  const imports = new Set();
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !['node_modules', '.next', '.git'].includes(file.name)) {
      findImports(fullPath).forEach(imp => imports.add(imp));
    } else if (file.name.match(/\.(ts|tsx|js|jsx)$/)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Match import statements
      const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        
        // Skip relative imports, Node.js built-ins, and path aliases
        if (!importPath.startsWith('.') && !importPath.startsWith('node:') && !importPath.startsWith('@/')) {
          // Extract package name (handle scoped packages)
          const packageName = importPath.startsWith('@') 
            ? importPath.split('/').slice(0, 2).join('/')
            : importPath.split('/')[0];
          
          imports.add(packageName);
        }
      }
    }
  }
  
  return imports;
}

console.log('🔍 Auditing dependencies...\n');

const usedPackages = findImports('src');
const missingPackages = [];

console.log('📦 Used packages:');
usedPackages.forEach(pkg => {
  const isInstalled = allDependencies.hasOwnProperty(pkg);
  console.log(`  ${isInstalled ? '✅' : '❌'} ${pkg}`);
  
  if (!isInstalled) {
    missingPackages.push(pkg);
  }
});

console.log('\n📋 Package.json dependencies:');
Object.keys(allDependencies).forEach(pkg => {
  const isUsed = usedPackages.has(pkg);
  console.log(`  ${isUsed ? '✅' : '⚠️ '} ${pkg} - ${allDependencies[pkg]}`);
});

if (missingPackages.length > 0) {
  console.log('\n❌ MISSING DEPENDENCIES:');
  missingPackages.forEach(pkg => console.log(`  - ${pkg}`));
  
  console.log('\n💡 Install missing packages:');
  console.log(`npm install ${missingPackages.join(' ')}`);
  
  process.exit(1);
} else {
  console.log('\n✅ All dependencies are properly declared!');
}