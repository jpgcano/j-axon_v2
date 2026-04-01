/**
 * Interface for AI Prediction services
 */
export interface PredictionResult {
  prediction: string;
  confidence: number;
  recommendedDate: string | null;
}

export interface PredictorPort {
  predict(context: any): Promise<PredictionResult | null>;
}