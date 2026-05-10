import { Cow } from '../types';
import { motion } from 'motion/react';
import { X, Calendar, Syringe, Activity, Brain, Beef } from 'lucide-react';

interface CowProfileProps {
  cow: Cow;
  onClose: () => void;
}

export function CowProfile({ cow, onClose }: CowProfileProps) {
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-200">
          <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
            <span className="text-3xl font-black">{cow.name.charAt(0)}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">{cow.name}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-6">{cow.tagNumber}</p>
          
          <div className="w-full space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Breed</span>
              <span className="text-slate-800 font-bold">{cow.breed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Age</span>
              <span className="text-slate-800 font-bold">{calculateAge(cow.birthDate)} Years</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                cow.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {cow.status}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-auto w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <X size={14} /> Close
          </button>
        </div>

        {/* Details Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar size={14} className="text-emerald-500" /> Date of Birth
            </h3>
            <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block">
              {new Date(cow.birthDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Syringe size={14} className="text-emerald-500" /> Vaccination History
            </h3>
            <div className="space-y-3">
              {cow.vaccinations.length > 0 ? cow.vaccinations.map((v, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-slate-700">{v.type}</p>
                    {v.notes && <p className="text-[10px] text-slate-400">{v.notes}</p>}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{v.date}</span>
                </div>
              )) : (
                <p className="text-sm text-slate-300 italic">No records found.</p>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" /> Health
              </h3>
              <ul className="space-y-2">
                {cow.healthConditions.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                    {h}
                  </li>
                ))}
                {cow.healthConditions.length === 0 && <li className="text-sm text-slate-300">Perfect Health</li>}
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Brain size={14} className="text-emerald-500" /> Behavior
              </h3>
              <div className="flex flex-wrap gap-2">
                {cow.behaviors.map((b, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {b}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Beef size={14} className="text-emerald-500" /> Nutritional Profile
            </h3>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 italic text-sm text-emerald-800 leading-relaxed">
              "{cow.dietaryNotes}"
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
