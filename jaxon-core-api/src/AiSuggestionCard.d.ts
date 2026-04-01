import React from 'react';
interface AiSuggestionProps {
    prediction: string;
    confidence: number;
    recommendation: string;
    onAccept: () => void;
    isLoading?: boolean;
}
/**
 * Componente de Sugerencia de IA (Organismo)
 * Cumple con la premisa "Human-in-the-loop" del BRD.
 */
export declare const AiSuggestionCard: React.FC<AiSuggestionProps>;
export {};
//# sourceMappingURL=AiSuggestionCard.d.ts.map