'use client';

import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ImagePan } from './image-pan';

export type FormEvent = {
    name: string;
    event: string;
    email: string;
    image?: string;
}

export const event: FormEvent = {
    name: '',
    event: '',
    email: '',
    image: ''
}

export function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

type InvitationCardChildProps = {
    dataForm: FormEvent
}
export default function InvitationCardChild({ dataForm }: InvitationCardChildProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(dataForm.image ?? null);
    const cardRef = useRef<HTMLDivElement>(null);


    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div
            ref={cardRef}
            className="h-[400px] bg-gradient-to-br from-pink-200 to-yellow-100 shadow-lg rounded-xl text-center py-4 px-2 flex flex-col items-center justify-center gap-2"
        >
            <div className='relative'>
                <div className='w-44 h-full object-cover rounded-full shadow overflow-hidden'>
                    <div className='w-44 h-44'>
                        {avatarUrl ? (
                            <ImagePan src={avatarUrl} />
                        ) : (<label className="w-full h-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                            />
                        </label>)}
                    </div>
                </div>
                <div className="w-12 h-12 absolute -bottom-4 right-0">
                    <div className='rounded-sm overflow-hidden bg-white'>
                        <QRCodeCanvas
                            value={`DXMD-${dataForm.name}`}
                            size={46}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                            includeMargin
                        />
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-bold">{dataForm.name}</h2>
            <p className="text-lg text-gray-700">You're invited to</p>
            <h3 className="text-2xl font-semibold text-purple-600">{dataForm.event}</h3>
            <p className="text-sm text-gray-500 mt-4">Save the date!</p>
        </div>
    );
}
