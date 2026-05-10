/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_COWS } from './constants';
import { Cow } from './types';
import { MilkTracking } from './components/MilkTracking';
import { FeedManagement } from './components/FeedManagement';
import { CowProfile } from './components/CowProfile';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Milk, 
  ShoppingBasket, 
  Users, 
  LayoutDashboard, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

type Tab = 'dashboard' | 'milk' | 'feed' | 'cows';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [cows, setCows] = useLocalStorage<Cow[]>('cows', INITIAL_COWS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCowId, setSelectedCowId] = useState<string | null>(null);

  const selectedCow = cows.find(c => c.id === selectedCowId);

  const stats = {
    totalCows: cows.length,
    activeCows: cows.filter(c => c.status === 'Active').length,
    totalProduction: 50.2, // Mock total for dashboard
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
        activeTab === tab 
          ? 'bg-emerald-50 text-emerald-700 font-medium' 
          : 'text-slate-500 hover:bg-slate-50 rounded-lg'
      }`}
    >
      <Icon size={18} className={activeTab === tab ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Milk size={20} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-slate-800 text-lg">DairySync</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || true) && (
          <motion.aside
            initial={isSidebarOpen ? { x: -256 } : false}
            animate={{ x: 0 }}
            className={`
              fixed md:sticky top-0 left-0 h-full w-64 bg-white border-r border-slate-200 p-6 z-30
              ${isSidebarOpen ? 'block shadow-2xl' : 'hidden md:flex flex-col justify-between'}
            `}
          >
            <div className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Milk size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800">DairySync</h1>
              </div>

              <nav className="space-y-1">
                <NavItem tab="dashboard" icon={LayoutDashboard} label="Overview" />
                <NavItem tab="milk" icon={Milk} label="Milk Production" />
                <NavItem tab="feed" icon={ShoppingBasket} label="Feed Management" />
                <NavItem tab="cows" icon={Users} label="Herd Management" />
              </nav>
            </div>

            <div className="pt-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Daily Quota</p>
                <div className="w-full bg-slate-200 h-2 rounded-full mb-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%] transition-all duration-1000"></div>
                </div>
                <p className="text-sm font-medium text-slate-700">12,400 / 15,000 L</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {activeTab === 'dashboard' && 'Morning Session Dashboard'}
              {activeTab === 'milk' && 'Milk Production Tracking'}
              {activeTab === 'feed' && 'Feed & Nutrition Sync'}
              {activeTab === 'cows' && 'Herd Inventory Management'}
            </h2>
            <p className="text-sm text-slate-400">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Station A-4
            </p>
          </div>
          <div className="flex gap-4">
            <button className="hidden sm:block px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Export Data</button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-emerald-700 transition-colors">
              {activeTab === 'milk' ? '+ Log Harvest' : activeTab === 'feed' ? '+ Log Feed' : '+ New Entry'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Active Herd</p>
                      <p className="text-3xl font-bold text-slate-800">{stats.totalCows}</p>
                      <p className="text-xs text-emerald-600 mt-2">+2 since last week</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Avg. Yield/Cow</p>
                      <p className="text-3xl font-bold text-slate-800">32.4L</p>
                      <p className="text-xs text-emerald-600 mt-2">+0.8L from target</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Protein Content</p>
                      <p className="text-3xl font-bold text-slate-800">3.82%</p>
                      <p className="text-xs text-slate-400 mt-2">Within optimal range</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Health Alerts</p>
                      <p className="text-3xl font-bold text-rose-500">00</p>
                      <p className="text-xs text-emerald-600 mt-2 font-medium">All systems normal</p>
                    </div>
                  </div>

                  {/* Lower Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Recent Milking Sessions</h3>
                        <button onClick={() => setActiveTab('milk')} className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-left">
                              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Animal ID</th>
                              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Yield</th>
                              <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {cows.slice(0, 4).map(cow => (
                              <tr key={cow.id}>
                                <td className="px-6 py-4 font-medium text-slate-700">
                                  {cow.name} <span className="ml-2 text-xs text-slate-300">#{cow.tagNumber}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">14.2 L</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] rounded-full font-bold uppercase">Healthy</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Weekly Production</h3>
                        <div className="flex items-end gap-2 h-32">
                          <div className="flex-1 bg-emerald-100 rounded-t-lg h-[60%]"></div>
                          <div className="flex-1 bg-emerald-100 rounded-t-lg h-[75%]"></div>
                          <div className="flex-1 bg-emerald-100 rounded-t-lg h-[65%]"></div>
                          <div className="flex-1 bg-emerald-600 rounded-t-lg h-[95%]"></div>
                          <div className="flex-1 bg-emerald-100 rounded-t-lg h-[80%]"></div>
                          <div className="flex-1 bg-emerald-100 rounded-t-lg h-[70%]"></div>
                          <div className="flex-1 bg-emerald-50 rounded-t-lg h-[40%]"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                      </div>

                      <div className="flex-1 bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden min-h-[160px]">
                        <div className="relative z-10">
                          <p className="text-xs font-bold text-emerald-400 uppercase mb-4 tracking-widest">System Status</p>
                          <p className="text-lg font-medium leading-tight text-slate-100">All cooling tanks operating at optimal efficiency.</p>
                          <div className="mt-6 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-slate-400 font-medium">Online & Connected</span>
                          </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 opacity-10 rounded-full blur-2xl"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

          {activeTab === 'milk' && (
            <motion.div
              key="milk"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Milk Production</h2>
                <p className="text-slate-500 font-medium italic">Tracking the flow of dairy gold.</p>
              </div>
              <MilkTracking cows={cows} />
            </motion.div>
          )}

          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Feed Management</h2>
                <p className="text-slate-500 font-medium italic">Balanced nutrition for health and yield.</p>
              </div>
              <FeedManagement cows={cows} />
            </motion.div>
          )}

          {activeTab === 'cows' && (
            <motion.div
              key="cows"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Herd Directory</h2>
                  <p className="text-slate-400 text-sm">Managing tracking and health status for all animals.</p>
                </div>
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  + Add New Cow
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cows.map(cow => (
                  <div 
                    key={cow.id} 
                    onClick={() => setSelectedCowId(cow.id)}
                    className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:border-emerald-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                        <Users size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cow.breed}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            cow.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {cow.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800">{cow.name}</h4>
                        <p className="text-xs font-mono text-slate-300">ID: {cow.tagNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedCow && (
            <CowProfile cow={selectedCow} onClose={() => setSelectedCowId(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  </main>
</div>
);
}
