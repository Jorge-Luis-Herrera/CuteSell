'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

import { API_URL } from '@/lib/config';

const ManageShelves = () => {
    const [shelves, setShelves] = useState<any[]>([]);
    const [newShelfTitle, setNewShelfTitle] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchShelves();
    }, []);

    const fetchShelves = async () => {
        try {
            const res = await fetch(`${API_URL}/inventory`);
            if (!res.ok) throw new Error("Error en servidor");
            const data = await res.json();
            setShelves(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error cargando colecciones", err);
            setShelves([]);
        }
    };

    const handleCreateShelf = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const trimmed = newShelfTitle.trim();
        if (!trimmed) {
            setError("El nombre de la colección no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/inventory/shelf`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titulo: trimmed })
            });
            if (res.ok) {
                setNewShelfTitle("");
                setSuccess("Colección creada con éxito");
                fetchShelves();
            } else {
                throw new Error("Error al crear");
            }
        } catch (err) {
            setError("Error al crear la colección");
            console.error(err);
        }
    };

    const handleDeleteShelf = async (id: number) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta colección? Se borrarán todos sus peluches asociados.")) return;

        try {
            const res = await fetch(`${API_URL}/inventory/shelf/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchShelves();
                setSuccess("Colección eliminada");
            }
        } catch (err) {
            console.error("Error eliminando colección", err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic text-gradient-plush">GESTIÓN DE COLECCIONES</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="lg:col-span-1">
                    <form className="glass-panel p-6 space-y-4" onSubmit={handleCreateShelf}>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Plus size={18} className="text-[var(--color-accent-pink)]" /> Nueva Colección
                        </h3>
                        
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                                <CheckCircle2 size={14} /> {success}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej: Edición Navidad 2026"
                                value={newShelfTitle}
                                onChange={(e) => { setNewShelfTitle(e.target.value); setError(""); }}
                                className="w-full bg-[var(--color-plush-dark)]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-accent-pink)] outline-none transition-colors"
                            />
                        </div>

                        <button type="submit" className="w-full bg-[var(--color-accent-pink)] text-white font-bold py-3 rounded-xl hover:bg-[#FF4081] transition-all transform active:scale-95 shadow-lg shadow-[var(--color-accent-pink)]/20">
                            Crear Colección
                        </button>
                    </form>
                </div>

                {/* Tabla */}
                <div className="lg:col-span-2">
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider">Peluches</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-plush-soft)]/50 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {shelves.map((shelf) => (
                                    <tr key={shelf.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-[var(--color-plush-soft)]/40 font-mono">{shelf.id.toString().slice(-6)}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-white">{shelf.titulo}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="bg-[var(--color-plush-dark)]/50 px-2 py-1 rounded-md text-[var(--color-accent-pink)] border border-[var(--color-accent-pink)]/20 text-xs">
                                                {shelf.productos?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteShelf(shelf.id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {shelves.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-[var(--color-plush-soft)]/20 italic">
                                            No hay colecciones creadas todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageShelves;
