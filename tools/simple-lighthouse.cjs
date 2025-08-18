#!/usr/bin/env node

/**
 * Enhanced Lighthouse Audit
 * 
 * Comprehensive lighthouse audit for performance testing with detailed reporting
 */

const { navigation } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runEnhancedLighthouseAudit(url, options = {}) {
  console.log(`🚀 Starting Enhanced Lighthouse audit for: ${url}`);
  
  const {
    saveReport = false,
    outputDir = './reports/lighthouse-reports',
    minScores = { performance: 90, accessibility: 90, 'best-practices': 90, seo: 90 }
  } = options;

  // Launch Chrome with optimized flags
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
    // Enhanced Lighthouse configuration
    const config = {
      port: chrome.port,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      settings: {
        // Simulate mobile device for more realistic testing
        formFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        },
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2
        },
        // Enable additional audits
        skipAudits: null,
        // Collect additional metrics
        gatherMode: false,
        disableStorageReset: false
      }
    };

    // Run Lighthouse
    const runnerResult = await navigation(url, config);

    if (!runnerResult || !runnerResult.lhr) {
      throw new Error('No lighthouse results returned');
    }

    const { lhr } = runnerResult;
    
    // Enhanced results display
    console.log('\n📊 ENHANCED LIGHTHOUSE RESULTS');
    console.log('================================');
    
    const categories = lhr.categories;
    const results = {};
    let allPassed = true;

    Object.entries(categories).forEach(([key, category]) => {
      const score = Math.round(category.score * 100);
      const minScore = minScores[key] || 90;
      const passed = score >= minScore;
      const emoji = passed ? '✅' : score >= 70 ? '⚠️' : '❌';
      
      console.log(`${emoji} ${key.toUpperCase()}: ${score}/100 (min: ${minScore})`);
      
      results[key] = { score, passed, minScore };
      if (!passed) allPassed = false;
    });

    // Enhanced Core Web Vitals with thresholds
    console.log('\n⚡ CORE WEB VITALS:');
    const audits = lhr.audits;
    const vitals = {};
    
    if (audits['first-contentful-paint']) {
      const fcp = Math.round(audits['first-contentful-paint'].numericValue);
      const fcpGood = fcp <= 1800;
      console.log(`FCP: ${fcp}ms ${fcpGood ? '✅' : '⚠️'} (target: ≤1800ms)`);
      vitals.fcp = { value: fcp, good: fcpGood };
    }
    
    if (audits['largest-contentful-paint']) {
      const lcp = Math.round(audits['largest-contentful-paint'].numericValue);
      const lcpGood = lcp <= 2500;
      console.log(`LCP: ${lcp}ms ${lcpGood ? '✅' : '⚠️'} (target: ≤2500ms)`);
      vitals.lcp = { value: lcp, good: lcpGood };
    }
    
    if (audits['cumulative-layout-shift']) {
      const cls = audits['cumulative-layout-shift'].numericValue;
      const clsGood = cls <= 0.1;
      console.log(`CLS: ${cls.toFixed(3)} ${clsGood ? '✅' : '⚠️'} (target: ≤0.1)`);
      vitals.cls = { value: cls, good: clsGood };
    }

    if (audits['first-input-delay']) {
      const fid = Math.round(audits['first-input-delay'].numericValue);
      const fidGood = fid <= 100;
      console.log(`FID: ${fid}ms ${fidGood ? '✅' : '⚠️'} (target: ≤100ms)`);
      vitals.fid = { value: fid, good: fidGood };
    }

    // Performance insights
    console.log('\n🔍 PERFORMANCE INSIGHTS:');
    
    if (audits['speed-index']) {
      const si = Math.round(audits['speed-index'].numericValue);
      console.log(`Speed Index: ${si}ms`);
    }
    
    if (audits['interactive']) {
      const tti = Math.round(audits['interactive'].numericValue);
      console.log(`Time to Interactive: ${tti}ms`);
    }

    if (audits['total-blocking-time']) {
      const tbt = Math.round(audits['total-blocking-time'].numericValue);
      console.log(`Total Blocking Time: ${tbt}ms`);
    }

    // Resource analysis
    console.log('\n📦 RESOURCE ANALYSIS:');
    
    if (audits['resource-summary']) {
      const resources = audits['resource-summary'].details.items;
      resources.forEach(resource => {
        const size = Math.round(resource.size / 1024);
        console.log(`${resource.resourceType}: ${resource.requestCount} requests, ${size}KB`);
      });
    }

    // Opportunities for improvement
    console.log('\n🚀 OPTIMIZATION OPPORTUNITIES:');
    const opportunities = Object.values(audits).filter(audit => 
      audit.details && audit.details.type === 'opportunity' && audit.numericValue > 0
    );

    if (opportunities.length > 0) {
      opportunities
        .sort((a, b) => b.numericValue - a.numericValue)
        .slice(0, 5)
        .forEach(opportunity => {
          const savings = Math.round(opportunity.numericValue);
          console.log(`• ${opportunity.title}: ${savings}ms potential savings`);
        });
    } else {
      console.log('No major optimization opportunities found! 🎉');
    }

    // Save detailed report if requested
    if (saveReport) {
      await saveDetailedReport(lhr, outputDir, url);
    }

    const performanceScore = Math.round(categories.performance.score * 100);
    
    console.log(`\n${allPassed ? '✅' : '❌'} Overall Result: ${allPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`Performance Score: ${performanceScore}/100`);
    
    return { 
      passed: allPassed, 
      score: performanceScore, 
      results, 
      vitals,
      lhr: saveReport ? null : lhr // Don't return full LHR unless needed
    };

  } finally {
    await chrome.kill();
  }
}

// Save detailed HTML and JSON reports
async function saveDetailedReport(lhr, outputDir, url) {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const urlSlug = url.replace(/[^a-zA-Z0-9]/g, '-');
    
    // Save JSON report
    const jsonPath = path.join(outputDir, `lighthouse-${urlSlug}-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(lhr, null, 2));
    
    // Generate HTML report
    const ReportGenerator = require('lighthouse/report/generator/report-generator');
    const html = ReportGenerator.generateReport(lhr, 'html');
    
    const htmlPath = path.join(outputDir, `lighthouse-${urlSlug}-${timestamp}.html`);
    fs.writeFileSync(htmlPath, html);
    
    console.log(`\n📄 Reports saved:`);
    console.log(`JSON: ${jsonPath}`);
    console.log(`HTML: ${htmlPath}`);
    
  } catch (error) {
    console.warn('Failed to save detailed report:', error.message);
  }
}

// CLI execution with enhanced options
async function main() {
  const args = process.argv.slice(2);
  const url = args[0] || 'http://localhost:4173';
  
  // Parse CLI options
  const options = {
    saveReport: args.includes('--save-report'),
    outputDir: args.includes('--output-dir') ? 
      args[args.indexOf('--output-dir') + 1] : './reports/lighthouse-reports',
    minScores: {
      performance: parseInt(args[args.indexOf('--min-performance') + 1]) || 90,
      accessibility: parseInt(args[args.indexOf('--min-accessibility') + 1]) || 90,
      'best-practices': parseInt(args[args.indexOf('--min-best-practices') + 1]) || 90,
      seo: parseInt(args[args.indexOf('--min-seo') + 1]) || 90
    }
  };

  // Show help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Enhanced Lighthouse Audit Tool

Usage: node simple-lighthouse.cjs [url] [options]

Options:
  --save-report              Save detailed HTML and JSON reports
  --output-dir <dir>         Directory to save reports (default: ./reports/lighthouse-reports)
  --min-performance <score>  Minimum performance score (default: 90)
  --min-accessibility <score> Minimum accessibility score (default: 90)
  --min-best-practices <score> Minimum best practices score (default: 90)
  --min-seo <score>          Minimum SEO score (default: 90)
  --help, -h                 Show this help message

Examples:
  node simple-lighthouse.cjs http://localhost:4173
  node simple-lighthouse.cjs http://localhost:4173 --save-report
  node simple-lighthouse.cjs http://localhost:4173 --min-performance 85 --save-report
    `);
    process.exit(0);
  }
  
  try {
    const { passed, score, results } = await runEnhancedLighthouseAudit(url, options);
    
    // Exit with appropriate code
    if (passed) {
      console.log('\n🎉 All audits passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some audits failed. Check the results above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  }
}

// Batch audit function for CI/CD
async function runBatchAudit(urls, options = {}) {
  const results = [];
  
  for (const url of urls) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      const result = await runEnhancedLighthouseAudit(url, options);
      results.push({ url, ...result });
    } catch (error) {
      console.error(`Failed to audit ${url}:`, error.message);
      results.push({ url, passed: false, error: error.message });
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('BATCH AUDIT SUMMARY');
  console.log(`${'='.repeat(60)}`);
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    const score = result.score || 'N/A';
    console.log(`${status} ${result.url} - Score: ${score}`);
  });
  
  console.log(`\nTotal: ${passed}/${total} passed`);
  
  return results;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { 
  runEnhancedLighthouseAudit, 
  runBatchAudit,
  // Keep backward compatibility
  runSimpleLighthouseAudit: runEnhancedLighthouseAudit
};