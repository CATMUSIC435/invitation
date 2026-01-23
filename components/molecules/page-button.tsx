'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

type PageButtonProps = {
  href: string;
  label: string;
  bgColor?: string;
  textColor?: string;
  useRouterPush?: boolean;
  disabled?: boolean;
};

export default function PageButton({
  href,
  label,
  bgColor = 'bg-[#844d15]',
  textColor = 'text-white',
  useRouterPush = false,
  disabled = false,
}: PageButtonProps) {
  const router = useRouter();

    const baseClass = `
    relative top-2 inline-flex items-center justify-center
    px-4 py-1 rounded-sm font-bold
    overflow-hidden
    transition-all duration-200
    shadow-md
    text-xs
    before:absolute
    before:top-0
    before:-left-full
    before:w-full
    before:h-full
    before:bg-gradient-to-r
    before:from-transparent
    before:via-white/60
    before:to-transparent
    before:skew-x-12
    before:transition-all
    before:duration-500

    hover:before:left-full
    `;

  const finalClass = `
    ${baseClass}
    ${bgColor}
    ${textColor}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
  `;

  if (useRouterPush) {
    return (
      <button
        disabled={disabled}
        onClick={() => !disabled && router.push(href)}
        className={finalClass}
      >
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={finalClass}>
      {label}
    </Link>
  );
}
