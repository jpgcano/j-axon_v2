'use client';

import React, { useState } from 'react';
import { useAssets, useCreateAsset } from '@/hooks/useAssets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Server, Monitor, HardDrive, Smartphone, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { CreateAssetRequest } from '@/services/AssetService';

const assetSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['PC', 'LAPTOP', 'SERVER', 'MONITOR', 'PERIPHERAL', 'MOBILE', 'OTHER']),
  location: z.string().min(2, 'Location is required'),
});

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'SERVER': return <Server size={18} />;
    case 'PC':
    case 'LAPTOP': return <Monitor size={18} />;
    case 'MOBILE': return <Smartphone size={18} />;
    default: return <HardDrive size={18} />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle size={14}/> Active</span>;
    case 'MAINTENANCE':
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"><AlertTriangle size={14}/> Maintenance</span>;
    case 'RETIRED':
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"><XCircle size={14}/> Retired</span>;
    default:
      return <span>{status}</span>;
  }
};

export default function AssetsPage() {
  const { data: assets, isLoading, error } = useAssets();
  const createAsset = useCreateAsset();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
  });

  const onSubmit = (data: z.infer<typeof assetSchema>) => {
    createAsset.mutate({ ...data, status: 'ACTIVE' } as CreateAssetRequest, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const filteredAssets = assets?.filter((asset: any) => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Assets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage hardware and software inventory.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add Asset
        </Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus-ring placeholder:text-slate-400"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Total items: {filteredAssets.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Asset Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500">Error loading assets.</td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No assets found.</td>
                </tr>
              ) : (
                filteredAssets.map((asset: any) => (
                  <tr key={asset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        {getTypeIcon(asset.type)}
                      </div>
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{asset.type}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{asset.location}</td>
                    <td className="px-6 py-4">{getStatusBadge(asset.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Asset">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Input 
            id="name" 
            label="Asset Name" 
            placeholder="e.g. MacBook Pro M3" 
            {...register('name')} 
            error={errors.name?.message} 
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Device Type</label>
            <select 
              {...register('type')}
              className={`flex h-10 w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus-ring ${errors.type ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
            >
              <option value="PC">Desktop PC</option>
              <option value="LAPTOP">Laptop</option>
              <option value="SERVER">Server</option>
              <option value="MONITOR">Monitor</option>
              <option value="MOBILE">Mobile Device</option>
              <option value="PERIPHERAL">Peripheral</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
          </div>

          <Input 
            id="location" 
            label="Location" 
            placeholder="e.g. Server Room A, Madrid HQ" 
            {...register('location')} 
            error={errors.location?.message} 
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createAsset.isPending}>Save Asset</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
