'use client'
import { useEffect } from 'react';
import { useToast, useToastUpdate } from '../../_context/ToastProvider';

const colorClasses = {
  error: 'bg-red-100 border-red-400 text-red-800',
  success: 'bg-green-100 border-green-400 text-green-800',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
};

const ToastNotification = () => {
  const toastInfo = useToast();
  const setToast = useToastUpdate();

  useEffect(() => {
    if (setToast === undefined) {
      return;
    }

    if (toastInfo) {
      setTimeout(() => {
        setToast(null);
      }, 10000);
    }
  }, [toastInfo]);

  const color = toastInfo ? colorClasses[toastInfo.type] : '';

  return (
    <>
      {toastInfo && (
        <div
          className={`animate-flash font-bold fixed top-6 translate-x-1/2 right-4 sm:translate-x-0 z-30 w-fit max-w-[90%] sm:max-w-1/2 py-4 px-6 flex justify-center items-center shadow-lg border-l-4 ${color}`}
        >
          {toastInfo.message}
        </div>
      )}
    </>
  )
}

export default ToastNotification
