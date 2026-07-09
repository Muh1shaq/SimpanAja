import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { Printer, X } from 'lucide-react';

interface BarcodeGeneratorProps {
  value: string;
  title: string;
  subtitle?: string;
  type?: 'qr' | 'barcode';
  onClose: () => void;
}

export function BarcodeGenerator({ value, title, subtitle, type = 'qr', onClose }: BarcodeGeneratorProps) {
  
  const handlePrint = () => {
    const printContent = document.getElementById('printable-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Quick reset after print
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
          <h3 className="font-semibold text-white">Generate Label</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center bg-white" id="printable-area">
           <div className="text-center mb-4">
             <h2 className="text-xl font-bold text-black">{title}</h2>
             {subtitle && <p className="text-sm text-gray-600 font-mono">{subtitle}</p>}
           </div>

           <div className="bg-white p-4">
             {type === 'qr' ? (
               <QRCodeSVG value={value} size={180} level="M" />
             ) : (
               <Barcode value={value} width={2} height={80} displayValue={false} />
             )}
           </div>
           <p className="mt-2 text-sm text-black font-mono font-bold tracking-widest">{value}</p>
        </div>

        <div className="p-4 flex gap-3 bg-slate-800/50 border-t border-slate-700/50">
          <button onClick={onClose} className="flex-1 py-2 px-4 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">
            Tutup
          </button>
          <button onClick={handlePrint} className="flex-1 py-2 px-4 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
            <Printer size={16} /> Cetak
          </button>
        </div>

      </div>
    </div>
  );
}
