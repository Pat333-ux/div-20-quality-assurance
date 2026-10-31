import { testSuiteRunner } from "../core/TestSuiteRunner";
import { staticCodeScanner } from "../core/StaticCodeScanner";

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class QAAPIHandler {
  /**
   * Run a test suite for a division.
   * POST /api/qa/tests/run
   */
  static runTests(body: {
    divisionName: string;
    totalTests: number;
    failCount: number;
  }): APIResponse<any> {
    if (!body.divisionName || body.totalTests === undefined) {
      return {
        success: false,
        error: "Missing required fields: divisionName or totalTests.",
        timestamp: new Date().toISOString(),
      };
    }

    const result = testSuiteRunner.runTestSuite(
      body.divisionName,
      body.totalTests,
      body.failCount || 0
    );

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Scan module for security vulnerabilities.
   * POST /api/qa/security/scan
   */
  static scanModule(body: {
    targetModule: string;
    vulnerabilitiesFound: Array<{
      severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      description: string;
      recommendation: string;
    }>;
  }): APIResponse<any> {
    if (!body.targetModule) {
      return {
        success: false,
        error: "Missing required field: targetModule.",
        timestamp: new Date().toISOString(),
      };
    }

    const alerts = staticCodeScanner.scanModule(
      body.targetModule,
      body.vulnerabilitiesFound || []
    );

    return {
      success: true,
      data: {
        scannedModule: body.targetModule,
        issuesDetected: alerts.length,
        alerts,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
