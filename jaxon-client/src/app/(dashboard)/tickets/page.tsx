'use client';

import React, { useState } from 'react';
import { useTickets, useCreateTicket, useUpdateTicketStatus } from '@/hooks/useTickets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, AlertCircle, Clock, CheckCircle2, XOctagon, Tag } from 'lucide-react';
import type { CreateTicketRequest, TicketStatus, RiskLevel } from '@/services/TicketService';

const ticketSchema = z.object({
  issueDescription: z.string().min(5, 'Description is too short'),
  assetId: z.string().uuid('Must be a valid UUID'),
  inherentRiskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'OPEN':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"><AlertCircle size={14}/> OPEN</span>;
    case 'IN_PROGRESS':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><Clock size={14}/> IN PROGRESS</span>;
    case 'RESOLVED':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><CheckCircle2 size={14}/> RESOLVED</span>;
    case 'CLOSED':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"><XOctagon size={14}/> CLOSED</span>;
    default:
      return <span>{status}</span>;
  }
};

const getRiskcolor = (risk: string) => {
  switch (risk) {
    case 'LOW': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    case 'MEDIUM': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    case 'HIGH': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
    case 'CRITICAL': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 ring-1 ring-red-500/50';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export default function TicketsPage() {
  const { data: tickets, isLoading, error } = useTickets();
  const createTicket = useCreateTicket();
  const updateStatus = useUpdateTicketStatus();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { inherentRiskLevel: 'LOW' }
  });

  const onSubmit = (data: z.infer<typeof ticketSchema>) => {
    createTicket.mutate(data as CreateTicketRequest, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const handleStatusChange = (id: string, newStatus: TicketStatus) => {
    updateStatus.mutate({ id, data: { status: newStatus } });
  };

  const filteredTickets = tickets?.filter((t: any) => 
    t.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assetId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Track and manage hardware & software incidents.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> New Ticket
        </Button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by description or Asset ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-sm focus-ring placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl">Error loading tickets.</div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Tag size={48} className="mb-4 opacity-20" />
          <p>No tickets found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map((ticket: any) => (
            <GlassCard key={ticket.id} interactive className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full w-fit ${getRiskcolor(ticket.inherentRiskLevel)}`}>
                    {ticket.inherentRiskLevel} PRIORITY
                  </span>
                  <p className="text-xs text-slate-500 font-mono">ID: {ticket.id.split('-')[0]}</p>
                </div>
                {getStatusBadge(ticket.status)}
              </div>
              
              <h3 className="text-slate-900 dark:text-slate-100 font-medium line-clamp-2 leading-snug">
                {ticket.issueDescription}
              </h3>
              
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
                  <span>Asset: <span className="font-mono text-slate-700 dark:text-slate-300">{ticket.assetId.split('-')[0]}</span></span>
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                
                {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(ticket.id, ticket.status === 'OPEN' ? 'IN_PROGRESS' as any : 'RESOLVED' as any);
                    }}
                    isLoading={updateStatus.isPending && updateStatus.variables?.id === ticket.id}
                  >
                    {ticket.status === 'OPEN' ? 'Start Work' : 'Resolve'}
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report New Incident">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Issue Description</label>
            <textarea
              {...register('issueDescription')}
              rows={4}
              placeholder="Describe the problem in detail..."
              className={`flex w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus-ring resize-none ${errors.issueDescription ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
            />
            {errors.issueDescription && <p className="text-xs text-red-500">{errors.issueDescription.message}</p>}
          </div>

          <Input 
            id="assetId" 
            label="Target Asset ID (UUID)" 
            placeholder="00000000-0000-0000-0000-000000000000" 
            {...register('assetId')} 
            error={errors.assetId?.message} 
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Risk / Priority Level</label>
            <select 
              {...register('inherentRiskLevel')}
              className={`flex h-10 w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus-ring ${errors.inherentRiskLevel ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            {errors.inherentRiskLevel && <p className="text-xs text-red-500">{errors.inherentRiskLevel.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createTicket.isPending}>Submit Ticket</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
