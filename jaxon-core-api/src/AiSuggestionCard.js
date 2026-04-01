import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
/**
 * Componente de Sugerencia de IA (Organismo)
 * Cumple con la premisa "Human-in-the-loop" del BRD.
 */
export const AiSuggestionCard = ({ prediction, confidence, recommendation, onAccept, isLoading = false }) => {
    const confidencePercent = (confidence * 100).toFixed(0);
    return (_jsxs("div", { className: "border-2 border-purple-500 bg-purple-50 rounded-lg p-4 shadow-sm transition-all hover:shadow-md", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(SparklesIcon, { className: "h-5 w-5 text-purple-600" }), _jsx("h3", { className: "text-sm font-bold text-purple-900 uppercase tracking-wider", children: "Sugerencia de IA (MCP)" }), _jsxs("span", { className: "ml-auto text-xs font-medium bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full", children: ["Confianza: ", confidencePercent, "%"] })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-sm font-semibold text-gray-700", children: ["Predicci\u00F3n: ", prediction] }), _jsxs("p", { className: "text-sm text-gray-600 mt-1 italic italic", children: ["\"", recommendation, "\""] })] }), _jsxs("button", { onClick: onAccept, disabled: isLoading, className: `w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
          ${isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'}`, children: [_jsx(CheckIcon, { className: "h-4 w-4" }), isLoading ? 'Procesando...' : 'Aplicar Recomendación'] }), _jsx("p", { className: "mt-2 text-[10px] text-purple-400 text-center uppercase font-bold", children: "Validaci\u00F3n humana obligatoria seg\u00FAn Regla 03" })] }));
};
//# sourceMappingURL=AiSuggestionCard.js.map