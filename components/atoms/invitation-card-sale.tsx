'use client';

import { useActionState, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import FormExample from './form-example';
import { signUp } from '@/app/(login)/actions';
import { ActionState } from '@/lib/auth/middleware';
import LoadingModal from './loading-modal';
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';
import { UploadCloud } from 'lucide-react';
import './index.css';

export type FormEvent = {
  name: string;
  field_one: string;
  field_two: string;
  field_three: string;
  email: string;
}
export const event: FormEvent = {
  name: '',
  field_one: '',
  field_two: '',
  field_three: '',
  email: '',
}

function toUppercaseValues(obj: FormEvent): FormEvent {
  const uppercased = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value.toUpperCase()])
  ) as FormEvent;

  return uppercased;
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

export default function InvitationCard() {
  const [zoomValue, setZoomValue] = useState(1);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAllow, setIsAllow] = useState<boolean>(false);
  const [dataForm, setDataForm] = useState<FormEvent>(event);
  const [link, setLink] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUp, { error: '' }
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleDownload = async () => {
    setIsPending(true)

    if (cardRef.current) {
      const scale = 4;
      const canvas = await html2canvas(cardRef.current, {
        scale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: null,
        removeContainer: true,
      })
      const resizedCanvas = document.createElement('canvas');
      const ctx = resizedCanvas.getContext('2d');

      const width = cardRef.current.offsetWidth;
      const height = cardRef.current.offsetHeight;

      resizedCanvas.width = width;
      resizedCanvas.height = height;

      ctx?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

      const base64 = resizedCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'invitation-card.png';
      link.href = base64;
      const file = base64ToFile(base64, 'avatar.png');
      const formData = new FormData();
      formData.append('avatar', file);
      console.log(dataForm);

      Object.entries(dataForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('role', '');
      // startTransition(() => {
      //   formAction(formData)
      // })
      try {
        const res = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
        });
        const data: any = await res.json();
        setLink(data?.success ?? '')      
      } catch (error) {

      }
      link.click();
      setIsAllow(false);
    }
    setIsPending(false)
  };

  const changeValueEvent = (value: FormEvent) => {
    value = toUppercaseValues(value);
    setDataForm(value);
    setIsAllow(true);
  }


  return (

    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      minScale={0.5}
      maxScale={100}
      onZoomStop={(ref) => setZoomValue(ref.state.scale)}
    >
      {() => (
        <div className='mx-auto'>
          <div className='md:w-[fit-content] mx-auto'>
            <div className='flex flex-col md:flex-row items-center gap-4 justify-center'>
              <div className='h-full py-4 md:py-0 md:h-[500px] max-w-[282px] flex flex-col items-center justify-center rounded-xl w-full md:w-md px-6 bg-gradient-to-br from-pink-200 via-pink-50 to-pink-100'>
                <div
                  className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl bg-[url('data:image/svg+xml;utf8,<svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path fill=\\'%23eeeeee\\' d=\\'M0 0h40v1H0zm0 20h40v1H0zm0 20h40v1H0z\\'/></svg>')] bg-repeat bg-[length:40px_40px] flex flex-col items-center justify-center text-center cursor-pointer transition hover:bg-gray-50"
                  onClick={handleClick}
                >
                  <UploadCloud className="w-10 h-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">
                    Kéo thả hoặc <span className="text-blue-600 font-semibold">Bấm vào đây</span><br />
                    để đăng tải hình ảnh
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-2 my-2">
                  <Controls />
                </div>
                <FormExample onCallBack={changeValueEvent} />
              </div>
              <div className='h-[500px] w-[300px] overflow-hidden'>
                <div
                  ref={cardRef}
                  className='bg-gradient-to-br from-pink-200 to-yellow-100 shadow-lg rounded-xl text-center pt-[203px] px-2 flex flex-col items-center gap-4 bg-center bg-cover'
                  style={{
                    width: '900px',
                    height: '1500px',
                    transform: 'scale(0.33)',
                    transformOrigin: 'top left',
                    backgroundImage: 'url(/frame-sale.png)',
                  }}>
                  <div className='relative'>
                    <div className='w-[282px] h-full object-cover rounded-full shadow overflow-hidden'>
                      <div className='w-[282px] h-[282px] relative'>
                        <TransformComponent wrapperClass="transform-component">
                          <div className="h-[282px] w-[282px] overflow-hidden relative z-0">
                            {avatarUrl ? <img
                              src={avatarUrl ?? ''}
                              className="h-full w-auto object-cover"
                              alt=""
                            /> : null}
                          </div>
                        </TransformComponent>
                        <div className='absolute h-[283px] w-[283px] rounded-full z-20 top-0  pointer-events-none'>
                          <img
                            src='/frame-cut.png'
                            className="h-full w-full object-contain"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='relative z-20 -top-14'>
                    <h2 className='text-4xl font-bold text-white -mb-2' style={{ margin: 0, padding: 0, letterSpacing: '3px', color: 'rgba(255,255,255,0.7)', fontFamily: 'SVN Gotham', fontWeight: 400 }}>{dataForm.name}</h2>
                    <div>
                      <h3 className='text-xl text-white mt-0 font-normal small-text'>{dataForm.field_one}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isAllow ? <form action={handleDownload}>
              <button
                className='mt-4 bg-cyan-200 text-black font-bold mx-2 py-2 rounded hover:bg-cyan-300 w-full'
              >
                Tải thẻ mời xuống
              </button>
            </form> : null}
             {link ? 
              <a href={`${link}`}><button
                className='mt-4 bg-cyan-300 text-black font-bold mx-2 py-2 rounded hover:bg-cyan-400 w-full'
              >
                Nếu ảnh không tải vui lòng nhấn vào đây
              </button></a> : null}
          </div>
          <LoadingModal isOpen={isPending} />
        </div>)}
    </TransformWrapper>
  );
}

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="relative left-1/2 -translate-x-1/2 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg flex gap-3 z-50 border border-gray-200">
      <button
        onClick={() => zoomIn()}
        className="w-8 h-8 rounded-md bg-blue-500 text-white text-xl font-semibold hover:bg-blue-600 transition"
        title="Zoom In"
      >
        +
      </button>
      <button
        onClick={() => zoomOut()}
        className="w-8 h-8 rounded-md bg-blue-500 text-white text-xl font-semibold hover:bg-blue-600 transition"
        title="Zoom Out"
      >
        −
      </button>
      <button
        onClick={() => resetTransform()}
        className="w-8 h-8 rounded-md bg-gray-500 text-white text-xl font-semibold hover:bg-gray-600 transition"
        title="Reset Zoom"
      >
        ⟳
      </button>
    </div>

  );
};

