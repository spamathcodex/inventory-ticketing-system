import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Plus, Trash2, RefreshCw, X, AlertTriangle, ClipboardList, LayoutDashboard } from 'lucide-react';

function App() {
  const [items, setItems] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'tickets'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({ name: '', sku: '', category_id: 1, stock: 0 });
  const [ticketData, setTicketData] = useState({ issue: '', priority: 'medium' });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resItems, resTickets] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/items'),
        axios.get('http://127.0.0.1:8000/api/tickets')
      ]);
      setItems(resItems.data.data || resItems.data);
      setTickets(resTickets.data.data || resTickets.data);
      setLoading(false);
    } catch (error) {
      console.error("Sync Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    await axios.post('http://127.0.0.1:8000/api/items', formData);
    setIsModalOpen(false);
    fetchAll();
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    await axios.post('http://127.0.0.1:8000/api/tickets', {
      item_id: selectedItem.id,
      issue: ticketData.issue,
      priority: ticketData.priority
    });
    setIsTicketModalOpen(false);
    setActiveTab('tickets'); // Pindah ke tab tiket setelah lapor
    fetchAll();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Hapus data ini?")) {
      await axios.delete(`http://127.0.0.1:8000/api/items/${id}`);
      fetchAll();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar / Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold flex items-center gap-2 text-blue-600">
              <Package size={28} /> Goodeva Inventory
            </h1>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'inventory' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutDashboard size={18} /> Inventaris
              </button>
              <button 
                onClick={() => setActiveTab('tickets')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'tickets' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                <ClipboardList size={18} /> Tiket Laporan
              </button>
            </div>
          </div>
          {activeTab === 'inventory' && (
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:bg-blue-700">
              <Plus size={18} /> Tambah Barang
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <RefreshCw className="animate-spin mb-2" size={32} />
            <p>Sinkronisasi sistem...</p>
          </div>
        ) : activeTab === 'inventory' ? (
          /* TAB INVENTARIS */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Nama Barang</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Stok</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {item.stock} Unit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedItem(item); setIsTicketModalOpen(true); }}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg title='Lapor Kerusakan'">
                        <AlertTriangle size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB TIKET */
          <div className="grid gap-4">
            {tickets.length > 0 ? tickets.map(ticket => (
              <div key={ticket.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${ticket.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                    <h3 className="font-bold text-slate-800">Laporan Kerusakan: {ticket.item?.name}</h3>
                  </div>
                  <p className="text-slate-600 text-sm">{ticket.issue_description}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {ticket.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-400">Belum ada laporan kerusakan.</div>
            )}
          </div>
        )}
      </main>

      {/* MODAL TAMBAH BARANG (Seperti sebelumnya) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-bold text-xl text-slate-800">Barang Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <input required placeholder="Nama Barang" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="SKU" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, sku: e.target.value})} />
                <input required type="number" placeholder="Stok" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Simpan Inventaris</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LAPOR KERUSAKAN */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-orange-50">
              <h2 className="font-bold text-xl text-orange-800 flex items-center gap-2">
                <AlertTriangle size={20}/> Lapor Masalah
              </h2>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-orange-400 hover:text-orange-600"><X /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 italic">Melaporkan masalah untuk: <span className="font-bold text-slate-700">{selectedItem?.name}</span></p>
              <textarea required placeholder="Deskripsikan masalahnya..." className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-orange-500 outline-none" onChange={e => setTicketData({...ticketData, issue: e.target.value})} />
              <select className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" onChange={e => setTicketData({...ticketData, priority: e.target.value})}>
                <option value="medium">Prioritas: Sedang</option>
                <option value="high">Prioritas: Mendesak</option>
              </select>
              <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition">Kirim Laporan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;