import { useState, useMemo } from 'react';
import { MilkRecord, Cow } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_MILK_RECORDS } from '../constants';
import { MilkRecordForm } from './MilkRecordForm';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calendar, ClipboardList, TrendingUp } from 'lucide-react';

interface MilkTrackingProps {
  cows: Cow[];
}

export function MilkTracking({ cows }: MilkTrackingProps) {
  const [records, setRecords] = useLocalStorage<MilkRecord[]>('milk_records', INITIAL_MILK_RECORDS);
  const [isAdding, setIsAdding] = useState(false);

  const averageYield = useMemo(() => {
    if (records.length === 0) return 0;
    const total = records.reduce((sum, r) => sum + r.totalYield, 0);
    return (total / records.length).toFixed(1);
  }, [records]);

  const cowAverages = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    records.forEach(r => {
      if (!stats[r.cowId]) stats[r.cowId] = { total: 0, count: 0 };
      stats[r.cowId].total += r.totalYield;
      stats[r.cowId].count += 1;
    });
    return Object.entries(stats).map(([id, s]) => ({
      id,
      avg: (s.total / s.count).toFixed(1),
      name: cows.find(c => c.id === id)?.name || 'Unknown'
    }));
  }, [records, cows]);

  const addRecord = (record: Omit<MilkRecord, 'id'>) => {
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    setRecords([newRecord, ...records]);
    setIsAdding(false);
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <TrendingUp size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">Overall Avg Yield</span>
          </div>
          <div className="text-4xl font-bold text-slate-800">{averageYield} L</div>
          <p className="text-slate-400 text-xs mt-1 font-medium">Daily average across all logged sessions</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <ClipboardList size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">Cow Performance</span>
          </div>
          <div className="space-y-3 mt-4 max-h-32 overflow-y-auto">
            {cowAverages.map(ca => (
              <div key={ca.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">{ca.name}</span>
                <span className="font-mono font-bold text-emerald-600">{ca.avg} L/day</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
          <Calendar size={18} className="text-emerald-600" />
          Production Logs
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} />
          {isAdding ? 'Cancel' : 'Add Recording'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50 p-6 rounded-2xl border border-slate-200"
          >
            <MilkRecordForm cows={cows} onSubmit={addRecord} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Animal</th>
                <th className="px-6 py-4 font-bold">Morning</th>
                <th className="px-6 py-4 font-bold">Afternoon</th>
                <th className="px-6 py-4 font-bold text-slate-600 italic">Total Yield</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map(record => (
                <motion.tr
                  layout
                  key={record.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{record.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 underline decoration-slate-100 underline-offset-4">
                    {cows.find(c => c.id === record.cowId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.morningYield} L</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.afternoonYield} L</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 bg-emerald-50/20">{record.totalYield} L</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-slate-200 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
