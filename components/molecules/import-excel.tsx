'use client';

import * as XLSX from 'xlsx';
import { useEffect, useRef, useState } from 'react';
import DataTableExcel from './data-table-excel';
import InvitationCardChild, { FormEvent } from '../atoms/invitation-card-child';
import html2canvas from 'html2canvas';

export default function ImportExcel() {
  const [data, setData] = useState<any[]>([]);
  const [isSend, setIsSend] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'e') {
      handleToggleFullscreen();
    }
    if (e.key.toLowerCase() === 'q') {
      if (cardRef.current) {
        const scale = 2;
        const canvas = await html2canvas(cardRef.current, {
          scale,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: null,
        })
        const resizedCanvas = document.createElement('canvas');
        const ctx = resizedCanvas.getContext('2d');

        const width = cardRef.current.offsetWidth;
        const height = cardRef.current.offsetHeight;

        resizedCanvas.width = width;
        resizedCanvas.height = height;

        ctx?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

        const base64 = resizedCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'invitation-card.png';
        // let base64 = canvas.toDataURL('image/png');
        link.href = base64;
        link.click();
      }
    }
  };


  useEffect(() => {

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFullscreen = () => {
    const elem = cardRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error('Error trying to enable fullscreen mode:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result as string;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      console.log(jsonData);
      
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="mx-auto">
      {!isSend ? (<div className='p-4 max-w-4xl mx-auto'>
        <h2 className="text-xl font-bold mb-4">📥 Import Excel</h2>

        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          className="block mb-4 border px-3 py-2 rounded"
        />
        {data.length !== 0 ? <button className='mx-auto max-w-sm w-full py-2 bg-cyan-100' onClick={() => setIsSend(true)}>Send</button> : null}
        <DataTableExcel data={data} />
      </div>) : null
      }
      <div ref={cardRef} className='py-2 bg-white grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {
          isSend && data.length !== 0 ? (
            data.map((item, index) => {
              return <InvitationCardChild key={index} dataForm={item} />
            })
          ) : null
        }
      </div>
    </div >
  );
}
