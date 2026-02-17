'use client';

import { useState, useEffect } from 'react';
import { listFiles } from '@/lib/storage';

export default function DebugStoragePage() {
    const [files, setFiles] = useState<any[]>([]);
    const [path, setPath] = useState('clients');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFiles(path);
    }, []);

    const fetchFiles = async (p: string) => {
        setLoading(true);
        setError('');
        try {
            const { files } = await listFiles(p);
            setFiles(files);
            setPath(p);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Storage Debugger</h1>

            <div className="flex gap-2 mb-4">
                <input
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="bg-white/10 px-4 py-2 rounded flex-1"
                />
                <button
                    onClick={() => fetchFiles(path)}
                    className="bg-flo-orange px-4 py-2 rounded"
                >
                    Load
                </button>
                <button
                    onClick={() => {
                        const parent = path.split('/').slice(0, -1).join('/');
                        if (parent) fetchFiles(parent);
                        else fetchFiles('');
                    }}
                    className="bg-white/10 px-4 py-2 rounded"
                >
                    Up
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid gap-2">
                {files.map(file => (
                    <div
                        key={file.id}
                        className="p-2 bg-white/5 rounded hover:bg-white/10 cursor-pointer flex justify-between"
                        onClick={() => {
                            // verify if it looks like a folder (no extension, or by convention)
                            // listFiles helper might not distinguish folders well if they are just prefixes
                            // but usually supabase list returns folders ?
                            // checking if name has no dot might be a heuristic
                            fetchFiles(file.name ? `${path}/${file.name}` : file.path);
                        }}
                    >
                        <span>{file.name}</span>
                        <span className="text-white/30">{file.size} bytes</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
