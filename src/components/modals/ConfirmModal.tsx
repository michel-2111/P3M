// src/components/modals/ConfirmModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/common/Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ title, message, onConfirm, onCancel }: ConfirmModalProps) => {
    return (
        <Modal onClose={onCancel} size="md">
            <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
                <div className="mt-8 flex justify-center space-x-4">
                    <button onClick={onCancel} type="button" className="btn-secondary">
                        Batal
                    </button>
                    <button onClick={onConfirm} type="button" className="btn-primary bg-red-600 hover:bg-red-700">
                        Hapus
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
