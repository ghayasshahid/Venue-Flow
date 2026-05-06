import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Users, Maximize } from 'lucide-react'
import {
  getHalls, createHall, updateHall, deleteHall,
  getMenuPackages, createMenuPackage, updateMenuPackage, deleteMenuPackage,
  getDecorPackages, createDecorPackage, updateDecorPackage, deleteDecorPackage,
} from '../lib/api'

const tabs = ['Hall Management', 'Menu Packages', 'Décor Packages', 'Pricing']

const emptyHall = { name: '', capacity: '', area: '', price: '', description: '' }
const emptyMenu = { name: '', price: '', itemsStr: '' }
const emptyDecor = { name: '', price: '', description: '' }

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0)
  const [savedMsg, setSavedMsg] = useState('')
  const showSaved = (msg = 'Changes saved!') => { setSavedMsg(msg); setTimeout(() => setSavedMsg(''), 2500) }

  // ── Halls ─────────────────────────────────────────────
  const [hallList, setHallList] = useState([])
  const [hallsLoading, setHallsLoading] = useState(true)
  const [editingHallId, setEditingHallId] = useState(null)
  const [hallForm, setHallForm] = useState({})
  const [addingHall, setAddingHall] = useState(false)
  const [newHallForm, setNewHallForm] = useState(emptyHall)
  const [hallSaving, setHallSaving] = useState(false)

  useEffect(() => {
    getHalls()
      .then(r => setHallList(r.data))
      .catch(() => {})
      .finally(() => setHallsLoading(false))
  }, [])

  const startEditHall = (hall) => { setEditingHallId(hall._id); setHallForm({ ...hall }); setAddingHall(false) }
  const cancelEditHall = () => { setEditingHallId(null); setHallForm({}) }

  const saveHall = async () => {
    setHallSaving(true)
    try {
      const res = await updateHall(editingHallId, {
        name: hallForm.name, capacity: Number(hallForm.capacity),
        area: hallForm.area, price: Number(hallForm.price),
        description: hallForm.description, status: hallForm.status || 'active',
      })
      setHallList(hs => hs.map(h => h._id === editingHallId ? res.data : h))
      cancelEditHall(); showSaved()
    } catch { showSaved('Failed to save hall.') }
    finally { setHallSaving(false) }
  }

  const handleDeleteHall = async (id) => {
    if (!window.confirm('Delete this hall? This cannot be undone.')) return
    try {
      await deleteHall(id)
      setHallList(hs => hs.filter(h => h._id !== id))
      showSaved('Hall deleted.')
    } catch (err) { showSaved(err.message || 'Failed to delete hall.') }
  }

  const addHall = async () => {
    if (!newHallForm.name.trim()) return
    setHallSaving(true)
    try {
      const res = await createHall({
        name: newHallForm.name, capacity: Number(newHallForm.capacity),
        area: newHallForm.area, price: Number(newHallForm.price),
        description: newHallForm.description,
      })
      setHallList(hs => [...hs, res.data])
      setNewHallForm(emptyHall); setAddingHall(false); showSaved('Hall added!')
    } catch { showSaved('Failed to add hall.') }
    finally { setHallSaving(false) }
  }

  // ── Menu Packages ──────────────────────────────────────
  const [menuList, setMenuList] = useState([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [editingMenuId, setEditingMenuId] = useState(null)
  const [menuForm, setMenuForm] = useState({})
  const [addingMenu, setAddingMenu] = useState(false)
  const [newMenuForm, setNewMenuForm] = useState(emptyMenu)
  const [menuSaving, setMenuSaving] = useState(false)

  useEffect(() => {
    getMenuPackages()
      .then(r => setMenuList(r.data))
      .catch(() => {})
      .finally(() => setMenuLoading(false))
  }, [])

  const startEditMenu = (m) => { setEditingMenuId(m._id); setMenuForm({ ...m, itemsStr: (m.items || []).join(', ') }); setAddingMenu(false) }
  const cancelEditMenu = () => { setEditingMenuId(null); setMenuForm({}) }

  const saveMenu = async () => {
    setMenuSaving(true)
    try {
      const res = await updateMenuPackage(editingMenuId, {
        name: menuForm.name, price: Number(menuForm.price),
        items: menuForm.itemsStr ? menuForm.itemsStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      })
      setMenuList(ms => ms.map(m => m._id === editingMenuId ? res.data : m))
      cancelEditMenu(); showSaved()
    } catch { showSaved('Failed to save package.') }
    finally { setMenuSaving(false) }
  }

  const deleteMenu = async (id) => {
    if (!window.confirm('Delete this menu package?')) return
    try {
      await deleteMenuPackage(id)
      setMenuList(ms => ms.filter(m => m._id !== id))
      showSaved('Package deleted.')
    } catch { showSaved('Failed to delete.') }
  }

  const addMenu = async () => {
    if (!newMenuForm.name.trim()) return
    setMenuSaving(true)
    try {
      const res = await createMenuPackage({
        name: newMenuForm.name, price: Number(newMenuForm.price),
        items: newMenuForm.itemsStr ? newMenuForm.itemsStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      })
      setMenuList(ms => [...ms, res.data])
      setNewMenuForm(emptyMenu); setAddingMenu(false); showSaved('Package added!')
    } catch { showSaved('Failed to add package.') }
    finally { setMenuSaving(false) }
  }

  // ── Décor Packages ─────────────────────────────────────
  const [decorList, setDecorList] = useState([])
  const [decorLoading, setDecorLoading] = useState(true)
  const [editingDecorId, setEditingDecorId] = useState(null)
  const [decorForm, setDecorForm] = useState({})
  const [addingDecor, setAddingDecor] = useState(false)
  const [newDecorForm, setNewDecorForm] = useState(emptyDecor)
  const [decorSaving, setDecorSaving] = useState(false)

  useEffect(() => {
    getDecorPackages()
      .then(r => setDecorList(r.data))
      .catch(() => {})
      .finally(() => setDecorLoading(false))
  }, [])

  const startEditDecor = (d) => { setEditingDecorId(d._id); setDecorForm({ ...d }); setAddingDecor(false) }
  const cancelEditDecor = () => { setEditingDecorId(null); setDecorForm({}) }

  const saveDecor = async () => {
    setDecorSaving(true)
    try {
      const res = await updateDecorPackage(editingDecorId, {
        name: decorForm.name, price: Number(decorForm.price),
        description: decorForm.description,
      })
      setDecorList(ds => ds.map(d => d._id === editingDecorId ? res.data : d))
      cancelEditDecor(); showSaved()
    } catch { showSaved('Failed to save package.') }
    finally { setDecorSaving(false) }
  }

  const deleteDecor = async (id) => {
    if (!window.confirm('Delete this décor package?')) return
    try {
      await deleteDecorPackage(id)
      setDecorList(ds => ds.filter(d => d._id !== id))
      showSaved('Package deleted.')
    } catch { showSaved('Failed to delete.') }
  }

  const addDecor = async () => {
    if (!newDecorForm.name.trim()) return
    setDecorSaving(true)
    try {
      const res = await createDecorPackage({
        name: newDecorForm.name, price: Number(newDecorForm.price),
        description: newDecorForm.description,
      })
      setDecorList(ds => [...ds, res.data])
      setNewDecorForm(emptyDecor); setAddingDecor(false); showSaved('Package added!')
    } catch { showSaved('Failed to add package.') }
    finally { setDecorSaving(false) }
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="card p-1 flex gap-1">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === i ? 'bg-sidebar text-white' : 'text-text-muted hover:text-text-primary hover:bg-cream'}`}>
            {t}
          </button>
        ))}
      </div>

      {savedMsg && (
        <div className={`border text-sm px-4 py-3 rounded-xl flex items-center justify-between ${savedMsg.includes('Failed') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {savedMsg}
          <button onClick={() => setSavedMsg('')}><X size={14} /></button>
        </div>
      )}

      {/* ── Hall Management ── */}
      {activeTab === 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-text-primary">Venues</p>
            <button onClick={() => { setAddingHall(true); setEditingHallId(null) }} className="btn-primary flex items-center gap-1.5 text-sm">
              <Plus size={14} /> Add Hall
            </button>
          </div>

          {addingHall && (
            <div className="card border-2 border-accent/40 space-y-3">
              <p className="font-semibold text-text-primary text-sm">New Hall</p>
              <div><label className="label">Hall Name</label><input value={newHallForm.name} onChange={e => setNewHallForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="e.g. Emerald Banquet Hall" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Capacity</label><input type="number" value={newHallForm.capacity} onChange={e => setNewHallForm(f => ({ ...f, capacity: e.target.value }))} className="input" placeholder="800" /></div>
                <div><label className="label">Area</label><input value={newHallForm.area} onChange={e => setNewHallForm(f => ({ ...f, area: e.target.value }))} className="input" placeholder="10,000 sq ft" /></div>
                <div><label className="label">Price (PKR)</label><input type="number" value={newHallForm.price} onChange={e => setNewHallForm(f => ({ ...f, price: e.target.value }))} className="input" placeholder="350000" /></div>
              </div>
              <div><label className="label">Description</label><textarea value={newHallForm.description} onChange={e => setNewHallForm(f => ({ ...f, description: e.target.value }))} className="input" rows={2} /></div>
              <div className="flex gap-2">
                <button onClick={addHall} disabled={hallSaving} className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-60"><Save size={13} /> {hallSaving ? 'Saving…' : 'Save Hall'}</button>
                <button onClick={() => setAddingHall(false)} className="btn-secondary text-xs">Cancel</button>
              </div>
            </div>
          )}

          {hallsLoading ? <p className="text-sm text-text-muted">Loading halls…</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hallList.map(hall => (
                <div key={hall._id} className="card space-y-4">
                  {editingHallId === hall._id ? (
                    <div className="space-y-3">
                      <div><label className="label">Hall Name</label><input value={hallForm.name || ''} onChange={e => setHallForm(f => ({ ...f, name: e.target.value }))} className="input" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Capacity</label><input type="number" value={hallForm.capacity || ''} onChange={e => setHallForm(f => ({ ...f, capacity: e.target.value }))} className="input" /></div>
                        <div><label className="label">Area</label><input value={hallForm.area || ''} onChange={e => setHallForm(f => ({ ...f, area: e.target.value }))} className="input" /></div>
                        <div><label className="label">Price (PKR)</label><input type="number" value={hallForm.price || ''} onChange={e => setHallForm(f => ({ ...f, price: e.target.value }))} className="input" /></div>
                        <div>
                          <label className="label">Status</label>
                          <select value={hallForm.status || 'active'} onChange={e => setHallForm(f => ({ ...f, status: e.target.value }))} className="input">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>
                      </div>
                      <div><label className="label">Description</label><textarea value={hallForm.description || ''} onChange={e => setHallForm(f => ({ ...f, description: e.target.value }))} className="input" rows={2} /></div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={saveHall} disabled={hallSaving} className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-60"><Save size={13} /> {hallSaving ? 'Saving…' : 'Save'}</button>
                        <button onClick={cancelEditHall} className="btn-secondary text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="h-32 bg-sidebar rounded-xl flex items-center justify-center relative">
                        <p className="text-white/30 text-sm">No image</p>
                        {hall.status !== 'active' && (
                          <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${hall.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{hall.status}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{hall.name}</p>
                        <p className="text-xs text-text-muted mt-1">{hall.description}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted"><Users size={13} /> {hall.capacity} guests</div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted"><Maximize size={13} /> {hall.area}</div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-border">
                        <p className="text-sm font-semibold text-accent">PKR {Number(hall.price).toLocaleString()}</p>
                        <div className="flex gap-2">
                          <button onClick={() => startEditHall(hall)} className="btn-secondary text-xs py-1.5 flex items-center gap-1"><Edit size={12} /> Edit</button>
                          <button onClick={() => handleDeleteHall(hall._id)} className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Menu Packages ── */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-text-primary">Menu Packages</p>
            <button onClick={() => { setAddingMenu(true); setEditingMenuId(null) }} className="btn-primary flex items-center gap-1.5 text-sm"><Plus size={14} /> Add Package</button>
          </div>

          {addingMenu && (
            <div className="card border-2 border-accent/40 space-y-3">
              <p className="font-semibold text-text-primary text-sm">New Menu Package</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Package Name</label><input value={newMenuForm.name} onChange={e => setNewMenuForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="e.g. Gold" /></div>
                <div><label className="label">Price per Head (PKR)</label><input type="number" value={newMenuForm.price} onChange={e => setNewMenuForm(f => ({ ...f, price: e.target.value }))} className="input" placeholder="3500" /></div>
              </div>
              <div><label className="label">Menu Items (comma separated)</label><textarea value={newMenuForm.itemsStr || ''} onChange={e => setNewMenuForm(f => ({ ...f, itemsStr: e.target.value }))} className="input" rows={2} placeholder="Biryani, Karahi, Naan…" /></div>
              <div className="flex gap-2">
                <button onClick={addMenu} disabled={menuSaving} className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-60"><Save size={13} /> {menuSaving ? 'Saving…' : 'Save Package'}</button>
                <button onClick={() => setAddingMenu(false)} className="btn-secondary text-xs">Cancel</button>
              </div>
            </div>
          )}

          {menuLoading ? <p className="text-sm text-text-muted">Loading packages…</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuList.map(m => (
                <div key={m._id} className="card">
                  {editingMenuId === m._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Name</label><input value={menuForm.name || ''} onChange={e => setMenuForm(f => ({ ...f, name: e.target.value }))} className="input" /></div>
                        <div><label className="label">Price/head</label><input type="number" value={menuForm.price || ''} onChange={e => setMenuForm(f => ({ ...f, price: e.target.value }))} className="input" /></div>
                      </div>
                      <div><label className="label">Items (comma separated)</label><textarea value={menuForm.itemsStr || ''} onChange={e => setMenuForm(f => ({ ...f, itemsStr: e.target.value }))} className="input" rows={2} /></div>
                      <div className="flex gap-2">
                        <button onClick={saveMenu} disabled={menuSaving} className="btn-primary text-xs flex items-center gap-1 disabled:opacity-60"><Save size={12} /> {menuSaving ? 'Saving…' : 'Save'}</button>
                        <button onClick={cancelEditMenu} className="btn-secondary text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-text-primary">{m.name}</p>
                          <p className="text-sm text-accent font-medium">{m.price > 0 ? `PKR ${m.price.toLocaleString()}/head` : 'Custom pricing'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditMenu(m)} className="p-1.5 hover:bg-cream rounded-lg transition-colors"><Edit size={14} className="text-text-muted" /></button>
                          <button onClick={() => deleteMenu(m._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                        </div>
                      </div>
                      {m.items && m.items.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {m.items.map(item => <span key={item} className="text-xs bg-cream px-2.5 py-1 rounded-full text-text-primary">{item}</span>)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Décor Packages ── */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-text-primary">Décor Packages</p>
            <button onClick={() => { setAddingDecor(true); setEditingDecorId(null) }} className="btn-primary flex items-center gap-1.5 text-sm"><Plus size={14} /> Add Package</button>
          </div>

          {addingDecor && (
            <div className="card border-2 border-accent/40 space-y-3">
              <p className="font-semibold text-text-primary text-sm">New Décor Package</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Package Name</label><input value={newDecorForm.name} onChange={e => setNewDecorForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="e.g. Rustic Bloom" /></div>
                <div><label className="label">Price (PKR)</label><input type="number" value={newDecorForm.price} onChange={e => setNewDecorForm(f => ({ ...f, price: e.target.value }))} className="input" placeholder="110000" /></div>
              </div>
              <div><label className="label">Description</label><textarea value={newDecorForm.description} onChange={e => setNewDecorForm(f => ({ ...f, description: e.target.value }))} className="input" rows={2} /></div>
              <div className="flex gap-2">
                <button onClick={addDecor} disabled={decorSaving} className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-60"><Save size={13} /> {decorSaving ? 'Saving…' : 'Save Package'}</button>
                <button onClick={() => setAddingDecor(false)} className="btn-secondary text-xs">Cancel</button>
              </div>
            </div>
          )}

          {decorLoading ? <p className="text-sm text-text-muted">Loading packages…</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decorList.map(d => (
                <div key={d._id} className="card">
                  {editingDecorId === d._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Name</label><input value={decorForm.name || ''} onChange={e => setDecorForm(f => ({ ...f, name: e.target.value }))} className="input" /></div>
                        <div><label className="label">Price (PKR)</label><input type="number" value={decorForm.price || ''} onChange={e => setDecorForm(f => ({ ...f, price: e.target.value }))} className="input" /></div>
                      </div>
                      <div><label className="label">Description</label><textarea value={decorForm.description || ''} onChange={e => setDecorForm(f => ({ ...f, description: e.target.value }))} className="input" rows={2} /></div>
                      <div className="flex gap-2">
                        <button onClick={saveDecor} disabled={decorSaving} className="btn-primary text-xs flex items-center gap-1 disabled:opacity-60"><Save size={12} /> {decorSaving ? 'Saving…' : 'Save'}</button>
                        <button onClick={cancelEditDecor} className="btn-secondary text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-text-primary">{d.name}</p>
                        <div className="flex gap-2">
                          <button onClick={() => startEditDecor(d)} className="p-1.5 hover:bg-cream rounded-lg transition-colors"><Edit size={14} className="text-text-muted" /></button>
                          <button onClick={() => deleteDecor(d._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted">{d.description}</p>
                      <p className="text-sm font-semibold text-accent mt-2">{d.price > 0 ? `PKR ${d.price.toLocaleString()}` : 'Custom pricing'}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Pricing ── */}
      {activeTab === 3 && (
        <div className="space-y-4">
          <p className="font-semibold text-text-primary">Pricing Configuration</p>
          <div className="card space-y-4 max-w-xl">
            <p className="text-sm font-medium text-text-muted">Default booking rules</p>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Advance Required (%)</label><input type="number" defaultValue={25} className="input" /></div>
              <div><label className="label">Tax Rate (%)</label><input type="number" defaultValue={0} className="input" /></div>
              <div><label className="label">Cancellation Fee (PKR)</label><input type="number" defaultValue={50000} className="input" /></div>
              <div><label className="label">Booking Validity (days)</label><input type="number" defaultValue={7} className="input" /></div>
            </div>
            <button onClick={() => showSaved()} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> Save Pricing Rules
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
