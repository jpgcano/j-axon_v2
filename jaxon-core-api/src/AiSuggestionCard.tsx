import React from 'react';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
export const AiSuggestionCard: React.FC<AiSuggestionProps> = ({
  prediction,
  confidence,
  recommendation,
  onAccept,
  isLoading = false
}) => {
  const confidencePercent = (confidence * 100).toFixed(0);

  return (
    <div className="border-2 border-purple-500 bg-purple-50 rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="h-5 w-5 text-purple-600" />
        <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">
          Sugerencia de IA (MCP)
        </h3>
        <span className="ml-auto text-xs font-medium bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
          Confianza: {confidencePercent}%
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700">Predicción: {prediction}</p>
        <p className="text-sm text-gray-600 mt-1 italic italic">
          "{recommendation}"
        </p>
      </div>

      <button
        onClick={onAccept}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
          ${isLoading 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
      >
        <CheckIcon className="h-4 w-4" />
        {isLoading ? 'Procesando...' : 'Aplicar Recomendación'}
      </button>
      
      <p className="mt-2 text-[10px] text-purple-400 text-center uppercase font-bold">
        Validación humana obligatoria según Regla 03
      </p>
    </div>
  );
};