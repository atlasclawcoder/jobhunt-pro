#!/bin/bash

echo "🚀 Pre-deployment check..."
echo

# Check if we're in a git repo
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "❌ Not in a git repository"
  exit 1
fi

# 1. Dependency audit
echo "1. 📦 Auditing dependencies..."
if node scripts/audit-dependencies.js; then
  echo "   ✅ All dependencies declared"
else
  echo "   ❌ Missing dependencies found"
  exit 1
fi

# 2. Security audit
echo
echo "2. 🔒 Security audit..."
if npm audit --audit-level=moderate; then
  echo "   ✅ No security vulnerabilities"
else
  echo "   ⚠️  Security vulnerabilities found - run 'npm audit fix'"
  echo "   Continue? (y/N)"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# 3. TypeScript check
echo
echo "3. 📝 TypeScript check..."
if npx tsc --noEmit; then
  echo "   ✅ No TypeScript errors"
else
  echo "   ❌ TypeScript errors found"
  exit 1
fi

# 4. Local build test
echo
echo "4. 🔧 Testing local build..."
if npm run build >/tmp/build.log 2>&1; then
  echo "   ✅ Build successful"
else
  echo "   ❌ Build failed:"
  tail -20 /tmp/build.log
  exit 1
fi

# 5. Git status
echo
echo "5. 📋 Git status..."
if git diff-index --quiet HEAD --; then
  echo "   ✅ No uncommitted changes"
else
  echo "   ⚠️  Uncommitted changes found"
  git status --porcelain
fi

echo
echo "✅ Pre-deployment check passed!"
echo "Ready to deploy to Vercel.")echo "   ✅ Next.js version: $(node -e "console.log(require('./package.json').dependencies.next)")")echo "   ✅ React version: $(node -e "console.log(require('./package.json').dependencies.react)")"
echo

Example usage:
# Before every deployment:
./scripts/pre-deploy-check.sh && git push origin main