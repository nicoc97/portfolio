#!/usr/bin/env node

/**
 * Lighthouse Audit Automation
 * 
 * Runs Lighthouse audits and generates performance reports
 * Usage: node scripts/lighthouse-audit.js [url]
 */

const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'interactive',
      'cumulative-layout-shift',
      'total-blocking-time',
      'unused-javascript',
      'unused-css-rules',
      'render-blocking-resources',
      'uses-webp-images',
      'uses-optimized-images',
      'uses-responsive-images',
      'efficient-animated-content',
      'preload-lcp-image',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'critical-request-chains',
      'user-timings',
      'bootup-time',
      'mainthread-work-breakdown',
      'dom-size',
      'uses-passive-event-listeners',
      'no-document-write',
      'uses-http2',
      'uses-long-cache-ttl',
      'total-byte-weight'
    ]
  }
};

// Enhanced performance thresholds
const thresholds = {
  performance: 90,
  accessibility: 95,
  'best-practices': 90,
  seo: 95,
  'first-contentful-paint': 1200,
  'largest-contentful-paint': 2000,
  'cumulative-layout-shift': 0.05,
  'total-blocking-time': 200,
  'speed-index': 2000,
  'interactive': 3000,
  'first-meaningful-paint': 1500
};

async function runLighthouseAudit(url) {
  console.log(`🚀 Starting comprehensive Lighthouse audit for: ${url}`);
  
  const results = {};
  
  // Test both desktop and mobile
  const formFactors = ['desktop', 'mobile'];
  
  for (const formFactor of formFactors) {
    console.log(`\n📱 Running ${formFactor} audit...`);
    
    // Launch Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows'
      ]
    });

    try {
      // Run Lighthouse with form factor specific settings
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        disableDeviceEmulation: formFactor === 'desktop',
        emulatedFormFactor: formFactor,
        throttling: formFactor === 'mobile' ? {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        } : {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }, config);

      // Generate reports
      const { lhr } = runnerResult;
      const reportHtml = runnerResult.report;

      // Create reports directory
      const reportsDir = path.join(process.cwd(), 'lighthouse-reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      // Save HTML report
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const htmlPath = path.join(reportsDir, `lighthouse-${formFactor}-${timestamp}.html`);
      fs.writeFileSync(htmlPath, reportHtml);

      // Save JSON report
      const jsonPath = path.join(reportsDir, `lighthouse-${formFactor}-${timestamp}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(lhr, null, 2));

      // Analyze results
      const formFactorResults = analyzeResults(lhr);
      results[formFactor] = {
        ...formFactorResults,
        htmlPath,
        jsonPath
      };

    } finally {
      await chrome.kill();
    }
  }
  
  // Print comprehensive summary
  printComprehensiveSummary(results);
  
  // Check if both audits passed
  const passed = Object.values(results).every(result => checkThresholds(result));
  
  return { passed, results };
}

function analyzeResults(lhr) {
  const categories = lhr.categories;
  const audits = lhr.audits;

  return {
    scores: {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      'best-practices': Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100)
    },
    metrics: {
      'first-contentful-paint': audits['first-contentful-paint'].numericValue,
      'largest-contentful-paint': audits['largest-contentful-paint'].numericValue,
      'cumulative-layout-shift': audits['cumulative-layout-shift'].numericValue,
      'total-blocking-time': audits['total-blocking-time'].numericValue,
      'speed-index': audits['speed-index'].numericValue,
      'interactive': audits['interactive'].numericValue
    },
    opportunities: Object.keys(audits)
      .filter(key => audits[key].details && audits[key].details.type === 'opportunity')
      .map(key => ({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        savings: audits[key].details.overallSavingsMs || 0
      }))
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5),
    diagnostics: Object.keys(audits)
      .filter(key => audits[key].details && audits[key].scoreDisplayMode === 'informative')
      .map(key => ({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        value: audits[key].displayValue
      }))
      .slice(0, 5)
  };
}

function printSummary(results, htmlPath) {
  console.log('\n📊 LIGHTHOUSE AUDIT RESULTS');
  console.log('================================');
  
  // Scores
  console.log('\n🎯 SCORES:');
  Object.entries(results.scores).forEach(([category, score]) => {
    const emoji = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
    const threshold = thresholds[category] || 90;
    const status = score >= threshold ? 'PASS' : 'FAIL';
    console.log(`${emoji} ${category.toUpperCase()}: ${score}/100 (${status})`);
  });

  // Core Web Vitals
  console.log('\n⚡ CORE WEB VITALS:');
  const vitals = [
    { key: 'first-contentful-paint', name: 'First Contentful Paint', unit: 'ms' },
    { key: 'largest-contentful-paint', name: 'Largest Contentful Paint', unit: 'ms' },
    { key: 'cumulative-layout-shift', name: 'Cumulative Layout Shift', unit: '' },
    { key: 'total-blocking-time', name: 'Total Blocking Time', unit: 'ms' }
  ];

  vitals.forEach(({ key, name, unit }) => {
    const value = results.metrics[key];
    const threshold = thresholds[key];
    const passed = key === 'cumulative-layout-shift' ? value <= threshold : value <= threshold;
    const emoji = passed ? '✅' : '❌';
    const displayValue = unit === 'ms' ? `${Math.round(value)}${unit}` : value.toFixed(3);
    console.log(`${emoji} ${name}: ${displayValue}`);
  });

  // Top opportunities
  if (results.opportunities.length > 0) {
    console.log('\n🚀 TOP OPTIMIZATION OPPORTUNITIES:');
    results.opportunities.forEach((opp, index) => {
      const savings = opp.savings > 0 ? ` (${Math.round(opp.savings)}ms savings)` : '';
      console.log(`${index + 1}. ${opp.title}${savings}`);
    });
  }

  console.log(`\n📄 Full report saved to: ${htmlPath}`);
}

function checkThresholds(results) {
  const failures = [];

  // Check score thresholds
  Object.entries(results.scores).forEach(([category, score]) => {
    const threshold = thresholds[category] || 90;
    if (score < threshold) {
      failures.push(`${category} score ${score} below threshold ${threshold}`);
    }
  });

  // Check metric thresholds
  Object.entries(results.metrics).forEach(([metric, value]) => {
    const threshold = thresholds[metric];
    if (threshold !== undefined) {
      const passed = metric === 'cumulative-layout-shift' ? value <= threshold : value <= threshold;
      if (!passed) {
        failures.push(`${metric} ${value} exceeds threshold ${threshold}`);
      }
    }
  });

  if (failures.length > 0) {
    console.log('\n❌ AUDIT FAILURES:');
    failures.forEach(failure => console.log(`  - ${failure}`));
    return false;
  }

  console.log('\n✅ All thresholds passed!');
  return true;
}

// CLI execution
async function main() {
  const url = process.argv[2] || 'http://localhost:4173';
  
  try {
    const { passed } = await runLighthouseAudit(url);
    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  }
}

function printComprehensiveSummary(results) {
  console.log('\n📊 COMPREHENSIVE LIGHTHOUSE AUDIT RESULTS');
  console.log('==========================================');
  
  Object.entries(results).forEach(([formFactor, result]) => {
    console.log(`\n🎯 ${formFactor.toUpperCase()} RESULTS:`);
    console.log('------------------------');
    
    // Scores
    Object.entries(result.scores).forEach(([category, score]) => {
      const emoji = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
      const threshold = thresholds[category] || 90;
      const status = score >= threshold ? 'PASS' : 'FAIL';
      console.log(`${emoji} ${category.toUpperCase()}: ${score}/100 (${status})`);
    });

    // Core Web Vitals
    console.log('\n⚡ CORE WEB VITALS:');
    const vitals = [
      { key: 'first-contentful-paint', name: 'First Contentful Paint', unit: 'ms' },
      { key: 'largest-contentful-paint', name: 'Largest Contentful Paint', unit: 'ms' },
      { key: 'cumulative-layout-shift', name: 'Cumulative Layout Shift', unit: '' },
      { key: 'total-blocking-time', name: 'Total Blocking Time', unit: 'ms' }
    ];

    vitals.forEach(({ key, name, unit }) => {
      const value = result.metrics[key];
      const threshold = thresholds[key];
      const passed = key === 'cumulative-layout-shift' ? value <= threshold : value <= threshold;
      const emoji = passed ? '✅' : '❌';
      const displayValue = unit === 'ms' ? `${Math.round(value)}${unit}` : value.toFixed(3);
      console.log(`${emoji} ${name}: ${displayValue}`);
    });

    console.log(`\n📄 Report: ${result.htmlPath}`);
  });
  
  // Performance comparison
  if (results.desktop && results.mobile) {
    console.log('\n📈 PERFORMANCE COMPARISON:');
    console.log('Desktop vs Mobile Performance Scores:');
    console.log(`Desktop: ${results.desktop.scores.performance}/100`);
    console.log(`Mobile: ${results.mobile.scores.performance}/100`);
    
    const perfDiff = results.desktop.scores.performance - results.mobile.scores.performance;
    if (perfDiff > 10) {
      console.log('⚠️  Large performance gap between desktop and mobile');
    } else {
      console.log('✅ Good performance consistency across devices');
    }
  }
}

// Export for programmatic use
module.exports = {
  runLighthouseAudit,
  analyzeResults,
  checkThresholds,
  printComprehensiveSummary
};

// Run if called directly
if (require.main === module) {
  main();
}