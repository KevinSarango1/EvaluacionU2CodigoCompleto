import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'info' | 'warning' | 'danger';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'info',
}) => {
  if (!isOpen) return null;

  const bgColor = variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-yellow-50' : 'bg-blue-50';
  const borderColor = variant === 'danger' ? 'border-red-300' : variant === 'warning' ? 'border-yellow-300' : 'border-blue-300';
  const titleColor = variant === 'danger' ? 'text-red-800' : variant === 'warning' ? 'text-yellow-800' : 'text-blue-800';
  const iconColor = variant === 'danger' ? 'text-red-600' : variant === 'warning' ? 'text-yellow-600' : 'text-blue-600';
  const confirmBtnColor = variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  const icon = variant === 'danger' ? '⚠️' : variant === 'warning' ? '⚡' : 'ℹ️';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${bgColor} rounded-lg shadow-xl p-8 max-w-md w-full border-2 ${borderColor}`}>
        <div className="flex items-start gap-4 mb-4">
          <div className={`text-4xl ${iconColor}`}>{icon}</div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${titleColor} mb-2`}>{title}</h2>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 text-white rounded transition font-semibold ${confirmBtnColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
