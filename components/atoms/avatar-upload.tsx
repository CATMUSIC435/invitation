'use client';

import { useState } from 'react';

export default function AvatarUpload() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        const res = await fetch('/api/upload-avatar', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        setUploading(false);

        if (data.result?.secure_url) {
            setPreviewUrl(data.result.secure_url);
        } else {
            alert('Upload thất bại');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <input type="file" accept="image/*" onChange={handleChange} />
            {uploading && <p>Đang tải ảnh lên...</p>}
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border shadow"
                />
            )}
        </div>
    );
}
