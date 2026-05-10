import { useState, useMemo, FormEvent } from 'react';
import { Feed, FeedSchedule, Cow, FeedType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_FEEDS, INITIAL_SCHEDULES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Calendar, Plus, CheckCircle2, AlertTriangle, ListFilter } from 'lucide-react';

interface FeedManagementProps {
  cows: Cow[];
}

export function FeedManagement({ cows }: FeedManagementProps) {
  const [feeds, setFeeds] = useLocalStorage<Feed[]>('feeds', INITIAL_FEEDS);
  const [schedules, setSchedules] = useLocalStorage<FeedSchedule[]>('feed_schedules', INITIAL_SCHEDULES);
  const [isAddingFeed, setIsAddingFeed] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

  const lowStockFeeds = useMemo(() => feeds.filter(f => f.quantity <= f.reorderPoint), [feeds]);

  const addFeed = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFeed: Feed = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      type: formData.get('type') as FeedType,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      reorderPoint: Number(formData.get('reorderPoint')),
    };
    setFeeds([...feeds, newFeed]);
    setIsAddingFeed(false);
  };

  const addSchedule = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSchedule: FeedSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.get('date') as string,
      targetType: formData.get('targetType') as 'Individual' | 'Group',
      targetId: formData.get('targetId') as string,
      feedId: formData.get('feedId') as string,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      status: 'Scheduled',
    };
    setSchedules([newSchedule, ...schedules]);
    setIsAddingSchedule(false);
  };

  const completeSchedule = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;

    // Deduct from inventory
    const feed = feeds.find(f => f.id === schedule.feedId);
    if (feed) {
      setFeeds(feeds.map(f => f.id === feed.id ? { ...f, quantity: Math.max(0, f.quantity - schedule.quantity) } : f));
    }

    setSchedules(schedules.map(s => s.id === id ? { ...s, status: 'Completed' } : s));
  };

  return (
    <div className="space-y-8">
      {/* Inventory Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package size={24} className="text-emerald-600" />
            Inventory Stock
          </h2>
          <button
            onClick={() => setIsAddingFeed(!isAddingFeed)}
            className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {isAddingFeed ? 'Cancel' : '+ New Feed Type'}
          </button>
        </div>

        {lowStockFeeds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-700"
          >
            <AlertTriangle size={20} />
            <div className="text-sm">
              <span className="font-bold uppercase tracking-tight mr-2">Low Stock Alert:</span> 
              {lowStockFeeds.map(f => f.name).join(', ')} requires restocking soon.
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {isAddingFeed && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white p-6 rounded-2xl shadow-md border-2 border-dashed border-slate-200"
              >
                <form onSubmit={addFeed} className="space-y-4">
                  <input name="name" placeholder="Feed Name" required className="w-full p-2 border-b border-slate-100 outline-none focus:border-emerald-500 text-sm placeholder:text-slate-300" />
                  <select name="type" className="w-full p-2 border-b border-slate-100 outline-none text-sm bg-transparent text-slate-600">
                    {Object.values(FeedType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <input name="quantity" type="number" placeholder="Qty" className="w-1/2 p-2 border-b border-slate-100 outline-none text-sm placeholder:text-slate-300" />
                    <input name="unit" placeholder="Unit" className="w-1/2 p-2 border-b border-slate-100 outline-none text-sm placeholder:text-slate-300" />
                  </div>
                  <input name="reorderPoint" type="number" placeholder="Reorder point" className="w-full p-2 border-b border-slate-100 outline-none text-sm placeholder:text-slate-300" />
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors">Save Feed</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {feeds.map(feed => (
            <div key={feed.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-emerald-200 transition-all">
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-emerald-400 transition-colors bg-slate-50 px-2 py-0.5 rounded-full">
                  {feed.type}
                </span>
              </div>
              <h3 className="font-bold text-slate-700 mb-4">{feed.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{feed.quantity}</span>
                <span className="text-slate-400 text-sm font-medium">{feed.unit}</span>
              </div>
              <div className="mt-4 w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${feed.quantity <= feed.reorderPoint ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (feed.quantity / (feed.reorderPoint * 3)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scheduling Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={24} className="text-emerald-600" />
            Nutritional Schedule
          </h2>
          <button
            onClick={() => setIsAddingSchedule(!isAddingSchedule)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
          >
            {isAddingSchedule ? 'Close' : 'Schedule Feed'}
          </button>
        </div>

        <AnimatePresence>
          {isAddingSchedule && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl p-6"
            >
              <form onSubmit={addSchedule} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Date</label>
                  <input name="date" type="date" required className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 ring-emerald-500/10" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Target</label>
                  <select name="targetType" className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none">
                    <option value="Individual">Individual</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Animal/Group</label>
                  <input name="targetId" placeholder="ID or Group" required className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none placeholder:text-slate-200" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Feed Select</label>
                  <select name="feedId" className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none">
                    {feeds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Amount</label>
                    <input name="quantity" type="number" required className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none" />
                  </div>
                </div>
                <button type="submit" className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-bold text-sm shadow-sm hover:translate-y-[-1px] transition-all">
                  Add Task
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {schedules.map(task => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-center gap-4 ${
                task.status === 'Completed' ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-5 w-full">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.status === 'Completed' ? 'bg-slate-100 text-slate-300' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[11px] font-mono font-bold text-slate-400 tracking-tight">{task.date}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      task.targetType === 'Individual' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {task.targetType}
                    </span>
                  </div>
                  <div className="text-slate-800 text-sm font-medium">
                    Deliver <span className="font-bold text-emerald-700">{task.quantity}{task.unit}</span> of <span className="underline decoration-slate-100 underline-offset-4">{feeds.find(f => f.id === task.feedId)?.name || 'Feed'}</span> to <span className="font-bold">{task.targetId}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center shrink-0 w-full sm:w-auto">
                {task.status !== 'Completed' ? (
                  <button
                    onClick={() => completeSchedule(task.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-emerald-600 hover:text-white text-slate-600 px-6 py-2 rounded-xl font-bold text-xs border border-slate-200 hover:border-emerald-600 transition-all shadow-sm"
                  >
                    <CheckCircle2 size={16} />
                    Complete Task
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 size={16} />
                    Logged
                  </div>
                )}
              </div>
            </div>
          ))}
          {schedules.length === 0 && (
            <div className="py-16 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl font-medium italic">
              All feeding assignments have been cleared.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
