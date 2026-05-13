import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { InvitationFormData } from '@/lib/store/useInvitationStore';
import { InvitationTemplate } from '@/lib/db/schema';
import { saveInvitation, getProxyImage } from '@/app/actions';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

function toUppercaseValues(obj: InvitationFormData): InvitationFormData {
  return {
    name: obj.name.toUpperCase(),
    title: obj.title?.toUpperCase(),
  };
}

export function useInvitationCard(template: InvitationTemplate) {
  const [dataForm, setDataForm] = useState<InvitationFormData>({ name: '', title: '' });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [zoomValue, setZoomValue] = useState<number>(1);
  const [isAllow, setIsAllow] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef<boolean>(false);

  useEffect(() => {
    // Tải ảnh proxy dạng base64 để html2canvas không bị dính lỗi CORS
    async function loadProxy() {
      if (template.background_url) {
        const base64Url = await getProxyImage(template.background_url);
        setBgImage(base64Url);
      } else {
        setBgImage('/frame.png');
      }
    }
    loadProxy();
  }, [template.background_url]);

  const imageStyle = {
    transform: `scale(${zoomValue})`,
    transformOrigin: 'center center',
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        alert('Vui lòng chọn file hình ảnh nhỏ hơn 5MB');
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDownload = async () => {
    if (!cardRef.current || isProcessingRef.current || !isAllow) return;
    
    if (template.has_avatar && !avatarUrl) {
      alert("Vui lòng tải lên ảnh đại diện của bạn!");
      return;
    }

    try {
      isProcessingRef.current = true;
      setIsPending(true);

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#0a1520',
        onclone: (doc, el) => {
          if (el) {
            el.style.transform = 'none';
          }
        }
      });

      const base64 = canvas.toDataURL('image/jpeg', 0.95);

      // Chuyển base64 sang Blob để tránh lỗi Chrome tải file không có đuôi mở rộng khi chuỗi base64 quá lớn
      const fetchRes = await fetch(base64);
      const blob = await fetchRes.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `invitation-${dataForm.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      link.href = blobUrl;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      if (template.save_user_info !== false) {
        const result = await saveInvitation(dataForm.name, dataForm.title, base64);
        if (result.success && result.slug) {
          window.location.href = `/share/${result.slug}`;
        }
      } else {
        alert('Tải ảnh thư mời thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi tải thư mời xuống:', error);
      alert('Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.');
    } finally {
      isProcessingRef.current = false;
      setIsPending(false);
      setIsAllow(false);
    }
  };

  const changeValueEvent = (value: InvitationFormData) => {
    const upperValue = toUppercaseValues(value);
    setDataForm(upperValue);
    setIsAllow(true);
  };

  return {
    state: {
      dataForm,
      avatarUrl,
      zoomValue,
      isAllow,
      isPending,
      bgImage,
      imageStyle
    },
    refs: {
      cardRef,
      transformRef,
      inputRef
    },
    actions: {
      handleUpload,
      handleClick,
      handleDownload,
      changeValueEvent,
      setZoomValue
    }
  };
}
