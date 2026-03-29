'use client';

import React from 'react';
import { useMaintenances, useUpdateMaintenanceStatus } from '@/hooks/useMaintenance';
import { MaintenanceStatus, MaintenanceType } from '@/services/MaintenanceService';
import { format } from 'date-fns';
import { Wrench, Calendar, CheckCircle2, AlertCircle, PlayCircle, XCircle } from 'lucide-react';

export default function MaintenancePage() {
  const { data: maintenances, isLoading } = useMaintenances();
  const updateStatus = useUpdateMaintenanceStatus();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.SCHEDULED: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case MaintenanceStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case MaintenanceStatus.COMPLETED: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case MaintenanceStatus.CANCELLED: return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.SCHEDULED: return <Calendar className="h-4 w-4" />;
      case MaintenanceStatus.IN_PROGRESS: return <PlayCircle className="h-4 w-4" />;
      case MaintenanceStatus.COMPLETED: return <CheckCircle2 className="h-4 w-4" />;
      case MaintenanceStatus.CANCELLED: return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Management & Scheduling</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage asset maintenance cycles.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-medium flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Schedule Maintenance
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maintenances?.map((m: any) => (
          <div key={m.id} className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(m.status)}`}>
                {getStatusIcon(m.status)}
                {m.status}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${m.type === MaintenanceType.PREVENTIVE ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-rose-500/30 text-rose-500 bg-rose-500/10'}`}>
                {m.type}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{m.description}</h3>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(m.scheduledDate), 'PPP')}
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                Asset ID: <span className="font-mono text-xs">{m.assetId.slice(0, 8)}...</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {m.status === MaintenanceStatus.SCHEDULED && (
                <button 
                  onClick={() => updateStatus.mutate({ id: m.id, data: { status: MaintenanceStatus.IN_PROGRESS } })}
                  className="flex-1 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                >
                  Start Work
                </button>
              )}
              {m.status === MaintenanceStatus.IN_PROGRESS && (
                <button 
                  onClick={() => updateStatus.mutate({ id: m.id, data: { status: MaintenanceStatus.COMPLETED } })}
                  className="flex-1 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                >
                  Complete
                </button>
              )}
               {(m.status === MaintenanceStatus.SCHEDULED || m.status === MaintenanceStatus.IN_PROGRESS) && (
                <button 
                  onClick={() => updateStatus.mutate({ id: m.id, data: { status: MaintenanceStatus.CANCELLED } })}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg text-xs font-medium hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
