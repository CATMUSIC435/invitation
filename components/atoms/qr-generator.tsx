'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function QrGenerator() {
    return (
        <div className="flex flex-col items-center gap-4 p-6 relative">
            <div className="relative w-[200px] h-[200px]">
                <QRCodeCanvas
                    value='https://example.com'
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin
                />
                
                <img
                    src="/avatar.png"
                    alt="Avatar"
                    className="w-12 h-12 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-md"
                />
            </div>
        </div>
    );
}
