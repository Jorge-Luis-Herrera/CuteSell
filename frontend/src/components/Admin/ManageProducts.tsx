'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, CheckCircle2, Image as ImageIcon, Edit2, X, ShoppingBag } from 'lucide-react';

import { API_URL, STATIC_URL } from '@/lib/config';

const ManageProducts = () => {
    const [shelves, setShelves] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const emptyProduct = {
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
        shelfId: 0,
        esExclusivo: false,
        esOferta: false,
        esDomicilio: false,
    };

    const [formData, setFormData] = useState(emptyProduct);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [shelvesRes, prodRes] = await Promise.all([
                fetch(`${API_URL}/inventory`),
                fetch(`${API_URL}/inventory/products`)
            ]);
            const shlvs = await shelvesRes.json();
            const prods = await prodRes.json();

            setShelves(Array.isArray(shlvs) ? shlvs : []);
            setProducts(Array.isArray(prods) ? prods : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Liberar URL previa si existe
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };


    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion || "",
            cantidad: product.cantidad,
            precio: product.precio,
            shelfId: product.shelfId || (product.estanteria?.id) || 0,
            esExclusivo: product.esExclusivo || false,
            esOferta: product.esOferta || false,
            esDomicilio: product.esDomicilio || false,
        });
        setSelectedFile(null);
        setPreviewUrl(product.imagenUrl ? (product.imagenUrl.startsWith('http') ? product.imagenUrl : `${STATIC_URL}${product.imagenUrl}`) : null);
        setError("");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        // Liberar URL de objeto al cancelar
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setEditingId(null);
        setFormData(emptyProduct);
        setSelectedFile(null);
        setPreviewUrl(null);
        setError("");
    };

    const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!formData.nombre.trim()) {
            setError("Nombre requerido");
            return;
        }

        try {
            setIsSubmitting(true);
            setUploadProgress(10);
            
            let base64Image = null;
            if (selectedFile) {
                setUploadProgress(30);
                base64Image = await fileToBase64(selectedFile);
                setUploadProgress(60);
            }

            const payload = {
                ...formData,
                imagenUrl: base64Image || (editingId ? products.find(p => p.id === editingId)?.imagenUrl : null)
            };

            setUploadProgress(80);
            const url = editingId ? `${API_URL}/inventory/product/${editingId}` : `${API_URL}/inventory/product`;
            const method = editingId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            setUploadProgress(100);

            if (res.ok) {
                if (previewUrl && previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                }
                setSuccess(editingId ? "Peluche actualizado" : "Peluche guardado");
                handleCancelEdit();
                fetchData();
            } else {
                throw new Error();
            }
        } catch (err) {
            setError("Error al procesar el peluche");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Eliminar este peluche?")) return;
        try {
            const res = await fetch(`${API_URL}/inventory/product/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
                setSuccess("Peluche eliminado");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStock = async (id: number, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        try {
            const res = await fetch(`${API_URL}/inventory/product/${id}/stock`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cantidad: newStock })
            });
            if (res.ok) fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black italic text-gradient-plush">GESTIÓN DE PELUCHES</h2>

            <form className="glass-panel p-8 space-y-6 relative overflow-hidden" onSubmit={handleSubmit}>
                {isSubmitting && (
                    <div className="absolute inset-0 z-50 bg-[var(--color-plush-dark)]/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                        <div className="w-20 h-20 mb-6 relative">
                            <div className="absolute inset-0 border-4 border-[var(--color-accent-pink)]/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-[var(--color-accent-pink)] rounded-full border-t-transparent animate-spin"></div>
                            <ImageIcon className="absolute inset-0 m-auto text-[var(--color-accent-pink)]" size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Procesando Peluche...</h4>
                        <p className="text-sm text-[var(--color-plush-soft)]/60 mb-8 max-w-[280px]">Estamos preparando la magia. Esto puede tardar unos segundos si la imagen es pesada.</p>
                        
                        <div className="w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                            <div 
                                className="h-full bg-gradient-to-r from-[var(--color-accent-pink)] to-purple-500 transition-all duration-500 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <span className="mt-2 text-[10px] font-black text-[var(--color-accent-pink)] uppercase tracking-widest">{uploadProgress}%</span>
                    </div>
                )}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                         {editingId ? <Edit2 size={20} className="text-[var(--color-accent-pink)]" /> : <Plus size={20} className="text-[var(--color-accent-pink)]" />}
                         {editingId ? `Editando Peluche #${editingId.toString().slice(-4)}` : 'Crear Nuevo Peluche'}
                    </h3>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="text-[var(--color-plush-soft)]/40 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {error && <div className="bg-red-400/10 border border-red-400/20 p-4 rounded-xl text-red-400 text-sm flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
                {success && <div className="bg-green-400/10 border border-green-400/20 p-4 rounded-xl text-green-400 text-sm flex items-center gap-2"><CheckCircle2 size={16}/> {success}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Nombre del Peluche</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full bg-[var(--color-plush-dark)]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-accent-pink)]"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Descripción</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                rows={3}
                                className="w-full bg-[var(--color-plush-dark)]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-accent-pink)] resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Stock Inicial</label>
                                <input
                                    type="number"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-[var(--color-plush-dark)]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Precio ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-[var(--color-plush-dark)]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Colección</label>
                             <select
                                value={formData.shelfId}
                                onChange={(e) => setFormData({ ...formData, shelfId: parseInt(e.target.value) })}
                                className="w-full bg-[var(--color-plush-dark)]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-accent-pink)] appearance-none"
                                required
                             >
                                <option value={0} disabled>Seleccionar colección...</option>
                                {shelves.map(shelf => (
                                    <option key={shelf.id} value={shelf.id}>{shelf.titulo}</option>
                                ))}
                             </select>
                             {shelves.length === 0 && <p className="text-xs text-[var(--color-plush-soft)]/30 italic">No hay colecciones creadas.</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'esExclusivo', label: 'Exclusivo', class: 'bg-purple-500/20 text-purple-300' },
                                { id: 'esOferta', label: 'Oferta', class: 'bg-pink-500/20 text-pink-300' },
                                { id: 'esDomicilio', label: 'Envío', class: 'bg-emerald-500/20 text-emerald-300' }
                            ].map(tag => (
                                <label key={tag.id} className={`cursor-pointer px-3 py-2 rounded-lg text-[10px] font-black uppercase text-center border transition-all ${formData[tag.id as keyof typeof formData] ? `${tag.class} border-white/20` : 'bg-white/5 border-white/5 text-[var(--color-plush-soft)]/30 hover:bg-white/10'}`}>
                                    <input type="checkbox" className="hidden" checked={!!formData[tag.id as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [tag.id]: e.target.checked })} />
                                    {tag.label}
                                </label>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                             <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-[var(--color-plush-soft)]/20" />}
                             </div>
                             <div className="flex-1 space-y-2">
                                <label className="block w-full cursor-pointer bg-white/5 border border-white/10 text-[10px] font-black uppercase rounded-xl py-3 text-center hover:bg-white/10 transition-colors">
                                    {selectedFile ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                </label>
                                 <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--color-accent-pink)] text-white font-black uppercase text-xs py-3 rounded-xl hover:bg-[#FF4081] transition-all transform active:scale-95 shadow-lg shadow-[var(--color-accent-pink)]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Guardando...' : (editingId ? 'Actualizar Peluche' : 'Crear Peluche')}
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </form>

            <div className="glass-panel overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-3xl">
                    <h3 className="font-bold flex items-center gap-2"><ShoppingBag size={18} className="text-[var(--color-accent-pink)]" /> Inventario de Peluches</h3>
                    <span className="text-xs text-[var(--color-plush-soft)]/40 uppercase font-bold tracking-widest">{products.length} peluches</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--color-plush-dark)]/40">
                             <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--color-plush-soft)]/50 uppercase tracking-widest">Previa</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--color-plush-soft)]/50 uppercase tracking-widest">Peluche</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--color-plush-soft)]/50 uppercase tracking-widest">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--color-plush-soft)]/50 uppercase tracking-widest">Precio</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--color-plush-soft)]/50 uppercase tracking-widest text-right">Acciones</th>
                             </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                             {products.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--color-plush-dark)] overflow-hidden border border-white/5 group-hover:border-[var(--color-accent-pink)]/30 transition-colors">
                                            {p.imagenUrl ? (
                                                <img 
                                                    src={p.imagenUrl.startsWith('http') ? p.imagenUrl : `${STATIC_URL}${p.imagenUrl}`} 
                                                    className="w-full h-full object-cover" 
                                                />
                                             ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg"></div>
                                             )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm">{p.nombre}</div>
                                        <div className="flex gap-1 mt-1">
                                            {p.esExclusivo && <span className="bg-purple-500/20 text-purple-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-purple-500/20">Exclusivo</span>}
                                            {p.esOferta && <span className="bg-pink-500/20 text-pink-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-pink-500/20">Oferta</span>}
                                            {p.esDomicilio && <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-emerald-500/20">Envío</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleUpdateStock(p.id, p.cantidad, -1)} className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-xs">-</button>
                                            <span className={`text-sm font-mono w-4 text-center ${p.cantidad < 5 ? 'text-red-400' : 'text-white'}`}>{p.cantidad}</span>
                                            <button onClick={() => handleUpdateStock(p.id, p.cantidad, 1)} className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-xs">+</button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[var(--color-accent-pink)] text-sm font-mono">${p.precio}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(p)} className="p-2 text-[var(--color-plush-soft)]/60 hover:text-[var(--color-accent-pink)] transition-colors"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-[var(--color-plush-soft)]/60 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                             ))}
                             {products.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-plush-soft)]/20 italic">No hay peluches en el inventario.</td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
