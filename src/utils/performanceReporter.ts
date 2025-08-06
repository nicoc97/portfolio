/**
 * Performance Reporter
 * 
 * Collects and reports performance metrics from the application
 * Integrates with service worker for comprehensive monitoring
 */

interface PerformanceReport {
  timestamp: number;
  url: string;
  metrics: {
    // Core Web Vitals
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    cls?: number; // Cumulative Layout Shift
    fid?: number; // First Input Delay
    ttfb?: number; // Time to First Byte
    
    // Custom metrics
    componentLoadTime?: number;
    imageLoadTime?: number;
    animationFrameRate?: number;
    memoryUsage?: number;
    
    // Service Worker metrics
    cacheHitRate?: number;
    networkRequests?: number;
  };
  userAgent: string;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

class PerformanceReporter {
  private static instance: PerformanceReporter;
  private reports: PerformanceReport[] = [];
  private observer?: PerformanceObserver;

  static getInstance(): PerformanceReporter {
    if (!PerformanceReporter.instance) {
      PerformanceReporter.instance = new PerformanceReporter();
    }
    return PerformanceReporter.instance;
  }

  constructor() {
    this.initializeObservers();
    this.collectInitialMetrics();
  }

  private initializeObservers(): void {
    // Web Vitals observer
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.processPerformanceEntry(entry);
          }
        });

        // Observe different types of performance entries
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }

    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.collectMemoryMetrics();
      }, 30000); // Every 30 seconds
    }
  }

  private collectInitialMetrics(): void {
    // Collect initial page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectPageLoadMetrics();
      }, 0);
    });

    // Collect FID when it occurs
    this.observeFirstInputDelay();
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    const report = this.getCurrentReport();

    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          report.metrics.fcp = entry.startTime;
        }
        break;
      
      case 'largest-contentful-paint':
        report.metrics.lcp = entry.startTime;
        break;
      
      case 'layout-shift':
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          report.metrics.cls = (report.metrics.cls || 0) + layoutShiftEntry.value;
        }
        break;
      
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        report.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
        break;
    }
  }

  private observeFirstInputDelay(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any;
        if (fidEntry.processingStart && fidEntry.startTime) {
          const report = this.getCurrentReport();
          report.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
        }
      }
    });

    try {
      observer.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.warn('First Input Delay observation not supported:', error);
    }
  }

  private collectPageLoadMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const report = this.getCurrentReport();
      report.metrics.ttfb = navigation.responseStart - navigation.requestStart;
    }
  }

  private collectMemoryMetrics(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const report = this.getCurrentReport();
      report.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
  }

  private getCurrentReport(): PerformanceReport {
    const now = Date.now();
    let currentReport = this.reports.find(r => now - r.timestamp < 60000); // Within last minute

    if (!currentReport) {
      currentReport = {
        timestamp: now,
        url: window.location.href,
        metrics: {},
        userAgent: navigator.userAgent,
        connection: this.getConnectionInfo()
      };
      this.reports.push(currentReport);
    }

    return currentReport;
  }

  private getConnectionInfo() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    }
    
    return undefined;
  }

  // Public methods for custom metrics
  public recordComponentLoadTime(componentName: string, loadTime: number): void {
    const report = this.getCurrentReport();
    report.metrics.componentLoadTime = (report.metrics.componentLoadTime || 0) + loadTime;
  }

  public recordImageLoadTime(imageUrl: string, loadTime: number): void {
    const report = this.getCurrentReport();
    report.metrics.imageLoadTime = (report.metrics.imageLoadTime || 0) + loadTime;
  }

  public recordAnimationFrameRate(fps: number): void {
    const report = this.getCurrentReport();
    report.metrics.animationFrameRate = fps;
  }

  // Get service worker performance metrics
  public async getServiceWorkerMetrics(): Promise<any> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'PERFORMANCE_METRICS') {
            const report = this.getCurrentReport();
            report.metrics.cacheHitRate = event.data.data.cacheHitRate;
            report.metrics.networkRequests = event.data.data.networkRequests;
            resolve(event.data.data);
          }
        };

        navigator.serviceWorker.controller!.postMessage(
          { type: 'GET_PERFORMANCE_METRICS' },
          [messageChannel.port2]
        );
      });
    }
    
    return null;
  }

  // Generate performance report
  public generateReport(): PerformanceReport[] {
    return [...this.reports];
  }

  // Send report to analytics (placeholder)
  public async sendReport(): Promise<void> {
    const reports = this.generateReport();
    
    // In a real application, you would send this to your analytics service
    // Example: Send to analytics service
    // await fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(reports)
    // });
  }

  // Clear old reports
  public clearOldReports(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.reports = this.reports.filter(report => report.timestamp > oneHourAgo);
  }

  // Get performance summary
  public getPerformanceSummary(): {
    averageFCP: number;
    averageLCP: number;
    totalCLS: number;
    averageFID: number;
    cacheHitRate: number;
  } {
    const validReports = this.reports.filter(r => Object.keys(r.metrics).length > 0);
    
    if (validReports.length === 0) {
      return {
        averageFCP: 0,
        averageLCP: 0,
        totalCLS: 0,
        averageFID: 0,
        cacheHitRate: 0
      };
    }

    const sum = validReports.reduce((acc, report) => ({
      fcp: acc.fcp + (report.metrics.fcp || 0),
      lcp: acc.lcp + (report.metrics.lcp || 0),
      cls: acc.cls + (report.metrics.cls || 0),
      fid: acc.fid + (report.metrics.fid || 0),
      cacheHitRate: acc.cacheHitRate + (report.metrics.cacheHitRate || 0)
    }), { fcp: 0, lcp: 0, cls: 0, fid: 0, cacheHitRate: 0 });

    return {
      averageFCP: sum.fcp / validReports.length,
      averageLCP: sum.lcp / validReports.length,
      totalCLS: sum.cls,
      averageFID: sum.fid / validReports.length,
      cacheHitRate: sum.cacheHitRate / validReports.length
    };
  }
}

// Export singleton instance
export const performanceReporter = PerformanceReporter.getInstance();

// Auto-start reporting
if (typeof window !== 'undefined') {
  // Send report every 5 minutes
  setInterval(() => {
    performanceReporter.sendReport();
    performanceReporter.clearOldReports();
  }, 5 * 60 * 1000);
}