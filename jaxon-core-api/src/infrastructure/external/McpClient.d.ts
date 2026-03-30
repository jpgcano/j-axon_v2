export interface AIResponse {
    prediction: string;
    confidence: number;
    recommendedDate: string | null;
}
export declare class McpClient {
    private readonly breaker;
    private readonly baseUrl;
    constructor(baseUrl?: string);
    private callSidecar;
    getPrediction(data: any): Promise<AIResponse>;
}
//# sourceMappingURL=McpClient.d.ts.map