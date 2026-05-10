import { useState, FormEvent } from 'react';
import { Cow, MilkRecord } from '../types';

interface MilkRecordFormProps {
  cows: Cow[];
  onSubmit: (record: Omit<MilkRecord, 'id'>) => void;
}

export function MilkRecordForm({ cows, onSubmit }: MilkRecordFormProps) {
  const [formData, setFormData] = useState({
    cowId: cows[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    morningYield: 0,
    afternoonYield: 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalYield: Number(formData.morningYield) + Number(formData.afternoonYield),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Animal Select</label>
        <select
          value={formData.cowId}
          onChange={e => setFormData({ ...formData, cowId: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 ring-emerald-500/10 transition-shadow appearance-none cursor-pointer"
        >
          {cows.map(cow => (
            <option key={cow.id} value={cow.id}>{cow.tagNumber} - {cow.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Recording Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 ring-emerald-500/10 transition-shadow"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Morning Yield (L)</label>
        <input
          type="number"
          step="0.1"
          placeholder="0.0"
          value={formData.morningYield || ''}
          onChange={e => setFormData({ ...formData, morningYield: Number(e.target.value) })}
          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 ring-emerald-500/10 transition-shadow"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Afternoon (L)</label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={formData.afternoonYield || ''}
            onChange={e => setFormData({ ...formData, afternoonYield: Number(e.target.value) })}
            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 ring-emerald-500/10 transition-shadow"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 text-white rounded-lg px-6 h-[42px] hover:bg-emerald-700 transition-all font-bold text-xs uppercase tracking-widest shadow-sm active:scale-95"
        >
          Save
        </button>
      </div>
    </form>
  );
}
