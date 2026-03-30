import type { PredictionResult, PredictorPort } from './PredictorPort.js';

export class McpPredictorAdapter implements PredictorPort {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private readonly failureThreshold = 3;
  private readonly resetTimeout = 30000; // 30 segundos
  private lastFailureTime?: number;

  constructor(private readonly baseUrl: string) {}

  async predict(context: any): Promise<PredictionResult | null> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        console.warn('[CircuitBreaker] MCP Sidecar is OPEN. Skipping request.');
        return null;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/mcp/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
        signal: AbortSignal.timeout(3000), // Timeout de 3s según Runbook
      });

      if (!response.ok) throw new Error('MCP_RESPONSE_NOT_OK');

      const data = await response.json();
      this.onSuccess();
      return data;
    } catch (error) {
      this.onFailure();
      console.error(`[McpPredictorAdapter] Connection failed: ${(error as Error).message}`);
      return null; // El Circuit Breaker captura el error y permite que la app siga
    }
  }

  private shouldTrip(): boolean {
    return this.state === 'CLOSED' && this.failureCount >= this.failureThreshold;
  }

  private shouldAttemptReset(): boolean {
    return !!(this.lastFailureTime && Date.now() - this.lastFailureTime > this.resetTimeout);
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.lastFailureTime = Date.now();
    }
  }

  getStatus() {
    return this.state;
  }
}
