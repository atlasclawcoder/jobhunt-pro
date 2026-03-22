# Deployment Audit System

## Pre-Deployment Checklist

Before every deployment, run:
```bash
./scripts/pre-deploy-check.sh
```

This checks:
1. **Dependencies** - All imports have matching package.json entries
2. **Security** - No known vulnerabilities 
3. **TypeScript** - No type errors
4. **Build** - Local build succeeds
5. **Git** - Clean working directory

## Manual Checks

### 1. Dependency Audit
```bash
node scripts/audit-dependencies.js
```

### 2. Security Scan
```bash
npm audit --audit-level=moderate
npm audit fix  # if needed
```

### 3. Build Test
```bash
npm run build  # Should complete without errors
```

### 4. Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'module'` | Import without dependency | Add to package.json |
| `Type error` | TypeScript mismatch | Check @types packages |
| `Vulnerable version` | Security issue | Update vulnerable packages |
| `Invalid version` | Malformed package-lock.json | Delete and regenerate |

## Emergency Fix Commands

```bash
# Missing dependencies
npm install --save package-name

# Security issues  
npm audit fix --force

# Clean restart
rm -rf node_modules package-lock.json
npm install

# Prisma issues
npx prisma generate
npx prisma db push
```

## Version Compatibility Matrix

| Next.js | React | Node.js | Prisma | TypeScript |
|---------|-------|---------|--------|------------|
| 15.1.11 | 18.3.1+ | 18.17+ | 5.22.0 | 5.7+ |
| 15.2.0+ | 19.0.0+ | 18.17+ | 5.22.0+ | 5.8+ |

## Automated Fixes

```bash
# Add to package.json scripts:
"audit": "node scripts/audit-dependencies.js",
"check": "npm run audit && npm audit && npx tsc --noEmit",
"predeploy": "./scripts/pre-deploy-check.sh"
```