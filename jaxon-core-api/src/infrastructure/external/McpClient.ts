import CircuitBreaker from 'opossum';

export interface AIResponse {
  prediction: string;
  confidence: number;
  recommendedDate: string | null;
}

export class McpClient {
  private readonly breaker: CircuitBreaker<[any], AIResponse>;
  private readonly baseUrl: string;

  constructor(baseUrl: string = process.env.MCP_SIDECAR_URL || process.env.AI_SIDECAR_URL || 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    
    const options = {
      timeout: 3000, // 3 seconds
      errorThresholdPercentage: 50,
      resetTimeout: 10000, // 10 seconds
    };

    this.breaker = new CircuitBreaker(this.callSidecar.bind(this), options);
    this.breaker.fallback(() => ({
      prediction: 'OPERATIONAL_FALLBACK: AI Sidecar Unavailable. Manual review recommended.',
      confidence: 0,
      recommendedDate: null,
    }));
  }

  private async callSidecar(payload: any): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/mcp/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`AI Sidecar error: ${response.statusText}`);
    }

    return await response.json() as AIResponse;
  }

  public async getPrediction(data: any): Promise<AIResponse> {
    return this.breaker.fire(data);
  }
}
