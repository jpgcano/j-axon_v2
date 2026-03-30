import { AiSuggestionCard } from '../../components/organisms/AiSuggestionCard';
import { useMCPSuggestions } from '../../hooks/useMCPSuggestions';
import { useTicket } from '../../hooks/useTickets';

export const TicketDetail = ({ ticketId }: { ticketId: string }) => {
  const { data: ticket } = useTicket(ticketId);
  // Regla 03: Obtenemos sugerencia basada en el contexto del ticket
  const { data: aiResponse, loading } = useMCPSuggestions(ticket);

  const handleApplyAiSuggestion = async () => {
    if (!aiResponse) return;

    try {
      console.log("Aplicando recomendación de IA bajo validación humana...");
      await fetch(`/api/v1/tickets/${ticketId}/apply-suggestion`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation: aiResponse.recommendation,
          appliedAt: new Date().toISOString()
        })
      });
      alert('Sugerencia de IA aplicada y registrada en la bitácora forense.');
    } catch (error) {
      console.error('Error al aplicar la sugerencia de la IA:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{ticket?.description}</h1>
      {/* Si la IA tiene una respuesta y el circuito está CERRADO (no hay error) */}
      {aiResponse && (
        <div className="mt-6 max-w-md">
          <AiSuggestionCard 
            prediction={aiResponse.prediction}
            confidence={aiResponse.confidence}
            recommendation={aiResponse.recommendation}
            onAccept={handleApplyAiSuggestion}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
};