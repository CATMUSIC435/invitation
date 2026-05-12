import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Bảng Xếp Hạng | CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”',
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://neutral-husky-121097.upstash.io';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAdkJAAIgcDJkOTdiNjkyM2RjYWU0N2JlYmNiOTZmYTk1ZDY3NTA3Mw';

async function fetchRankings() {
  try {
    const headers = {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    };
    let cursor = '0';
    let keys: string[] = [];

    do {
      const res = await fetch(UPSTASH_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(["SCAN", cursor, "MATCH", "scraped_data:*", "COUNT", "100"]),
        cache: 'no-store'
      });
      if (!res.ok) {
        console.error('Upstash scan error', res.statusText);
        break;
      }
      const data = await res.json();
      if (data.result && data.result.length === 2) {
        cursor = data.result[0];
        keys.push(...data.result[1]);
      } else {
        break;
      }
    } while (cursor !== '0');

    if (keys.length === 0) return [];

    // MGET
    const mgetRes = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(["MGET", ...keys]),
      cache: 'no-store'
    });

    if (!mgetRes.ok) return [];
    const mgetData = await mgetRes.json();
    const values = mgetData.result || [];

    const parsed = values.map((val: string) => {
      if (!val) return null;
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Parse stats and sort by views -> likes
    const ranked = parsed.map((item: any) => {
      const data = item?.result?.data || {};
      return {
        url: item.url || '',
        platform: item?.result?.platform || 'unknown',
        username: data.username || data.nickname || 'Không rõ',
        caption: data.caption || '',
        views: parseInt(data.views) || 0,
        likes: parseInt(data.likes) || 0,
        comments: parseInt(data.comments) || 0,
        shares: parseInt(data.shares) || 0,
        cover: data.cover || '',
      };
    });

    ranked.sort((a: any, b: any) => b.views - a.views || b.likes - a.likes);
    return ranked;
  } catch (error) {
    console.error('Failed to fetch rankings', error);
    return [];
  }
}

import { Trophy, Eye, Heart, MessageCircle, Share2, Medal } from 'lucide-react';
import { Suspense } from 'react';

async function RankingContent() {
  const data = await fetchRankings();

  return (
    <>
      {data.length === 0 ? (
        <div className="py-20 text-center text-gray-500 italic bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
          Chưa có dữ liệu xếp hạng nào từ Hệ thống cào dữ liệu.
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
          <div className='py-4'>
            <ul className="flex flex-col gap-3">
              {data.map((item: any, index: number) => {
                const actualRank = index + 1;
                let rankColor = "text-gray-500 group-hover:text-[#c19d68]";
                let ringColor = "ring-white/10 group-hover:ring-[#c19d68]/50";
                let bgStyle = "bg-[#0e1e2e]/60 hover:bg-[#162a40]";

                if (actualRank === 1) {
                  rankColor = "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]";
                  ringColor = "ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]";
                  bgStyle = "bg-gradient-to-r from-yellow-500/10 to-[#0e1e2e]/60 border-yellow-500/30 hover:from-yellow-500/20";
                } else if (actualRank === 2) {
                  rankColor = "text-gray-300 drop-shadow-[0_0_5px_rgba(209,213,219,0.5)]";
                  ringColor = "ring-gray-300";
                  bgStyle = "bg-gradient-to-r from-gray-400/10 to-[#0e1e2e]/60 border-gray-400/30 hover:from-gray-400/20";
                } else if (actualRank === 3) {
                  rankColor = "text-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.5)]";
                  ringColor = "ring-amber-600";
                  bgStyle = "bg-gradient-to-r from-amber-600/10 to-[#0e1e2e]/60 border-amber-600/30 hover:from-amber-600/20";
                }

                return (
                  <li
                    key={index}
                    className={`flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 transition-all duration-300 p-3 sm:p-4 rounded-2xl border ${actualRank > 3 ? 'border-white/5' : ''} ${bgStyle} group`}
                  >
                    <div className={`flex-shrink-0 w-8 sm:w-12 text-center font-black text-lg sm:text-xl md:text-2xl transition-colors ${rankColor}`}>
                      #{actualRank}
                    </div>

                    <div className="flex-shrink-0 relative">
                      {actualRank === 1 && <Trophy className="absolute -top-3 -right-3 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)] z-10" size={16} />}
                      {item.cover ? (
                        <img src={item.cover} alt={item.username} className={`w-10 h-10 md:w-12 md:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 transition-all ${ringColor}`} />
                      ) : (
                        <div className={`w-10 h-10 md:w-12 md:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-800 flex items-center justify-center ring-2 ${ringColor}`}>
                          <span className="text-gray-500 text-[10px] sm:text-xs">No img</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0 ml-1 sm:ml-2">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white text-base sm:text-lg md:text-xl hover:text-[#c19d68] transition-colors truncate block">
                        @{item.username}
                      </a>
                      <p className="text-xs sm:text-sm text-gray-400 capitalize flex items-center gap-2 mt-0.5">
                        <span className={`inline-block w-2 h-2 rounded-full ${item.platform === 'tiktok' ? 'bg-cyan-400' : 'bg-blue-600'}`}></span>
                        {item.platform}
                      </p>
                    </div>

                    <div className="flex-shrink-0 w-full sm:w-auto text-left sm:text-right mt-2 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-none border-white/10 pt-2 sm:pt-0">
                      <div className={`text-lg sm:text-xl md:text-2xl font-black ${actualRank === 1 ? 'text-yellow-400' : actualRank === 2 ? 'text-gray-200' : actualRank === 3 ? 'text-amber-500' : 'text-white'}`}>
                        <Eye size={16} className="inline mr-1.5 opacity-60 mb-0.5" />
                        {new Intl.NumberFormat('vi-VN').format(item.views)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 flex flex-wrap items-center justify-end gap-2 sm:gap-3 mt-1 font-medium">
                        <span className="flex items-center gap-1"><Heart size={12} className={actualRank === 1 ? "text-yellow-500/80" : ""} /> {new Intl.NumberFormat('vi-VN').format(item.likes)}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} className={actualRank === 1 ? "text-yellow-500/80" : ""} /> {new Intl.NumberFormat('vi-VN').format(item.comments)}</span>
                        <span className="flex items-center gap-1"><Share2 size={12} className={actualRank === 1 ? "text-yellow-500/80" : ""} /> {new Intl.NumberFormat('vi-VN').format(item.shares || 0)}</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default function RankingPage() {
  return (
    <section className="flex-1 flex flex-col p-4 lg:p-8 max-w-6xl mx-auto w-full relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-[#c19d68] text-4xl md:text-5xl font-bold tracking-widest uppercase drop-shadow-[0_0_15px_rgba(193,157,104,0.5)] font-avo-bold">
          Top User Thịnh Hành
        </h2>
        <p className="text-gray-400 mt-3 text-lg font-light">Bảng xếp hạng mức độ tương tác trên mạng xã hội</p>
      </div>

      <Suspense fallback={
        <div className="py-32 flex flex-col items-center justify-center text-[#c19d68]">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#c19d68] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg animate-pulse font-medium">Đang tải bảng xếp hạng...</p>
        </div>
      }>
        <RankingContent />
      </Suspense>
    </section>
  );
}
