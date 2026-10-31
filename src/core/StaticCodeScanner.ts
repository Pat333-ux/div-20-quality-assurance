export interface VulnerabilityAlert {
  alertId: string;
  targetModule: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  recommendation: string;
  detectedAt: string;
}

export class StaticCodeScanner {
  private alerts: VulnerabilityAlert[] = [];

  /**
   * Scan a module or smart contract for vulnerabilities.
   */
  scanModule(
    targetModule: string,
    vulnerabilitiesFound: Array<{ severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; description: string; recommendation: string }>
  ): VulnerabilityAlert[] {
    const newAlerts: VulnerabilityAlert[] = vulnerabilitiesFound.map((v) => ({
      alertId: `SEC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      targetModule,
      severity: v.severity,
      description: v.description,
      recommendation: v.recommendation,
      detectedAt: new Date().toISOString(),
    }));

    this.alerts.push(...newAlerts);
    return newAlerts;
  }

  /**
   * Get all unresolved security vulnerabilities.
   */
  getAllAlerts(): VulnerabilityAlert[] {
    return this.alerts;
  }

  /**
   * Get alerts filtered by severity.
   */
  getBySeverity(severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"): VulnerabilityAlert[] {
    return this.alerts.filter((a) => a.severity === severity);
  }
}

export const staticCodeScanner = new StaticCodeScanner();
