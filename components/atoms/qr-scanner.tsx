'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import AnimatedModal from './animated-modal';
import LoadingModal from './loading-modal';
let inter = 1;

const QrScanner = () => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<{
    error?: string;
    success?: string;
  }>({error: '', success: ''});
  const [isPending, setIsPending] = useState(false);

  const handleChange = async (email = '') => {
    if (!isPending && inter === 1) {
      inter = 2;
      setIsPending(true)
      const res = await fetch('/api/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log('✅ Transition done');
      console.log('Result:', data); 
      setResult(data);    
      setIsPending(false)
      setOpen(true);
      inter = 1;
    }

  }

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scanner.start(
      { facingMode: "environment" }, // Use back camera if available
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText, decodedResult) => {
        if (decodedText && !open && !isPending) {
          handleChange(decodedText)
        }
        // Optionally: scanner.stop();
      },
      (errorMessage) => {
        // console.warn(`QR Code no match: ${errorMessage}`);
      }
    ).catch((err) => {
      // console.error("Error starting scanner", err);
    });

    return () => {
      scanner.stop().catch(() => { });
    };
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <div id="reader" className={isPending ? 'hidden' : ''} style={{ width: "300px" }}></div>
      <AnimatedModal isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-semibold mb-2">🎉 Welcome!</h2>
        <p className="text-gray-600 mb-4">Đây là modal chứa tên người dùng.</p>
        <p className='text-gray-600 text-xl font-bold mb-4'>{result.success ? result.success : result.error}</p>
        {result.success ?
          <p className='text-blue-300 text-2xl font-bold mb-4'>Checkin thành công</p> :
          <p className='text-red-300 text-2xl font-bold mb-4'>Vui lòng kiểm tra lại</p>}
        <button
          onClick={() => setOpen(false)}
          className="bg-red-500 text-white px-3 py-1 rounded w-full"
        >
          Đóng
        </button>
      </AnimatedModal>
      <LoadingModal isOpen={isPending} />
    </div>
  );
};

export default QrScanner;
