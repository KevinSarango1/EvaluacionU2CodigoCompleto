import React, { useEffect } from 'react';

interface SuccessAlertProps {
  isOpen: boolean;
  message: string;
  title?: string;
  duration?: number;
  onClose: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  isOpen,
  message,
  title = 'Guardado con éxito',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className="bg-green-50 border-2 border-green-300 rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-start gap-4">
          <div className="text-4xl text-green-600">✓</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-800 mb-1">{title}</h3>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>
        <div className="mt-4 bg-green-600 h-1 rounded-full animate-progress" />
      </div>
    </div>
  );
};
