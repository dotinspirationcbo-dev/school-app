#!/usr/bin/env node

/**
 * Mobile App Pre-Deployment Checklist
 * Verifies all requirements before building APK
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function checkFile(filepath, description) {
  const exists = fs.existsSync(filepath);
  if (exists) {
    log(`  ✅ ${description}`, 'green');
    return true;
  } else {
    log(`  ❌ ${description}`, 'red');
    return false;
  }
}

function checkFileContent(filepath, searchString, description) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    if (content.includes(searchString)) {
      log(`  ✅ ${description}`, 'green');
      return true;
    } else {
      log(`  ❌ ${description}`, 'red');
      return false;
    }
  } catch (err) {
    log(`  ❌ ${description} (Error reading file)`, 'red');
    return false;
  }
}

function runCheck(title, checks) {
  log(`\n${title}`, 'cyan');
  let passed = 0;
  let failed = 0;

  checks.forEach(check => {
    if (check()) {
      passed++;
    } else {
      failed++;
    }
  });

  return { passed, failed };
}

async function main() {
  log('📱 MOBILE APP PRE-DEPLOYMENT CHECKLIST', 'blue');
  log('=' + '='.repeat(50), 'cyan');

  const mobilePath = path.join(__dirname, '..');
  const appJsonPath = path.join(mobilePath, 'app.json');
  const packageJsonPath = path.join(mobilePath, 'package.json');
  const envPath = path.join(mobilePath, '.env');
  const assetPath = path.join(mobilePath, 'assets');

  let totalPassed = 0;
  let totalFailed = 0;

  // Check 1: Project Structure
  log('\n1️⃣  PROJECT STRUCTURE', 'yellow');
  const check1 = runCheck('Checking files:', [
    () => checkFile(appJsonPath, 'app.json exists'),
    () => checkFile(packageJsonPath, 'package.json exists'),
    () => checkFile(envPath, '.env exists'),
    () => checkFile(assetPath, 'assets folder exists'),
    () => checkFile(path.join(assetPath, 'splash.png'), 'splash.png exists'),
    () => checkFile(path.join(assetPath, 'images'), 'images folder exists'),
  ]);
  totalPassed += check1.passed;
  totalFailed += check1.failed;

  // Check 2: Configuration
  log('\n2️⃣  CONFIGURATION', 'yellow');
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    const appConfig = appJson.expo;

    const check2 = runCheck('Checking app.json:', [
      () => {
        if (appConfig.name && appConfig.name.length > 0) {
          log(`  ✅ App name configured: "${appConfig.name}"`, 'green');
          return true;
        } else {
          log('  ❌ App name not configured', 'red');
          return false;
        }
      },
      () => {
        if (appConfig.version && appConfig.version.length > 0) {
          log(`  ✅ Version configured: ${appConfig.version}`, 'green');
          return true;
        } else {
          log('  ❌ Version not configured', 'red');
          return false;
        }
      },
      () => {
        if (appConfig.icon) {
          log(`  ✅ Icon configured: ${appConfig.icon}`, 'green');
          return true;
        } else {
          log('  ❌ Icon not configured', 'red');
          return false;
        }
      },
      () => {
        if (appConfig.splash && appConfig.splash.image) {
          log(`  ✅ Splash screen configured: ${appConfig.splash.image}`, 'green');
          return true;
        } else {
          log('  ❌ Splash screen not configured', 'red');
          return false;
        }
      },
      () => {
        if (appConfig.android && appConfig.android.adaptiveIcon) {
          log(`  ✅ Android adaptive icon configured`, 'green');
          return true;
        } else {
          log('  ❌ Android adaptive icon not configured', 'red');
          return false;
        }
      },
    ]);
    totalPassed += check2.passed;
    totalFailed += check2.failed;
  } catch (err) {
    log('  ❌ Error reading app.json', 'red');
    totalFailed += 5;
  }

  // Check 3: Environment Variables
  log('\n3️⃣  ENVIRONMENT VARIABLES', 'yellow');
  const check3 = runCheck('Checking .env:', [
    () => checkFileContent(envPath, 'EXPO_PUBLIC_API_URL', 'API_URL configured'),
    () => {
      const content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('localhost') || content.includes('127.0.0.1')) {
        log('  ⚠️  WARNING: API_URL points to localhost (won\'t work on devices)', 'yellow');
        return false;
      } else {
        log('  ✅ API_URL points to remote server (not localhost)', 'green');
        return true;
      }
    },
  ]);
  totalPassed += check3.passed;
  totalFailed += check3.failed;

  // Check 4: Dependencies
  log('\n4️⃣  DEPENDENCIES', 'yellow');
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const check4 = runCheck('Checking dependencies:', [
      () => {
        if (packageJson.dependencies.expo) {
          log(`  ✅ Expo installed (${packageJson.dependencies.expo})`, 'green');
          return true;
        } else {
          log('  ❌ Expo not installed', 'red');
          return false;
        }
      },
      () => {
        if (packageJson.dependencies['expo-router']) {
          log(`  ✅ Expo Router installed`, 'green');
          return true;
        } else {
          log('  ❌ Expo Router not installed', 'red');
          return false;
        }
      },
      () => {
        if (packageJson.dependencies['react-native']) {
          log(`  ✅ React Native installed`, 'green');
          return true;
        } else {
          log('  ❌ React Native not installed', 'red');
          return false;
        }
      },
      () => {
        if (packageJson.scripts.start) {
          log(`  ✅ npm start script configured`, 'green');
          return true;
        } else {
          log('  ❌ npm start script not configured', 'red');
          return false;
        }
      },
    ]);
    totalPassed += check4.passed;
    totalFailed += check4.failed;
  } catch (err) {
    log('  ❌ Error reading package.json', 'red');
    totalFailed += 4;
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 SUMMARY', 'blue');
  log('='.repeat(60), 'cyan');
  log(`  ✅ Passed: ${totalPassed}`, 'green');
  log(`  ❌ Failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green');

  if (totalFailed === 0) {
    log('\n✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. npm start (to test the app)', 'blue');
    log('  2. npm install -g eas-cli (to install EAS CLI)', 'blue');
    log('  3. eas login (to login to Expo)', 'blue');
    log('  4. eas build:configure (to configure build)', 'blue');
    log('  5. eas build -p android --profile preview (to build APK)', 'blue');
    return 0;
  } else {
    log('\n❌ SOME CHECKS FAILED - FIX ISSUES BEFORE DEPLOYMENT', 'red');
    return 1;
  }
}

main().then(code => process.exit(code));
