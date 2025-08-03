// src/components/common/Modal.tsx
"use client";

import { X } from 'lucide-react';
import React from 'react';

const Modal = ({ children, onClose, size = '3xl' }: { children: React.ReactNode, onClose: () => void, size?: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className={`bg-gray-50 rounded-lg shadow-xl w-full max-w-${size} max-h-[95vh] overflow-y-auto relative animate-fade-in-down`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10"><X className="w-7 h-7" /></button>
            {children}
        </div>
    </div>
);

export default Modal;
