'use server';

import { revalidatePath } from 'next/cache';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://neutral-husky-121097.upstash.io';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAdkJAAIgcDJkOTdiNjkyM2RjYWU0N2JlYmNiOTZmYTk1ZDY3NTA3Mw';

export async function fetchSocialData() {
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
      if (!res.ok) break;
      const data = await res.json();
      if (data.result && data.result.length === 2) {
        cursor = data.result[0];
        keys.push(...data.result[1]);
      } else {
        break;
      }
    } while (cursor !== '0');

    if (keys.length === 0) return [];

    const mgetRes = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(["MGET", ...keys]),
      cache: 'no-store'
    });
    
    if (!mgetRes.ok) return [];
    const mgetData = await mgetRes.json();
    const values = mgetData.result || [];

    return keys.map((key, i) => {
      let parsed = null;
      try {
        parsed = typeof values[i] === 'string' ? JSON.parse(values[i]) : values[i];
      } catch (e) {}
      
      return {
        key,
        data: parsed
      };
    }).filter(item => item.data);

  } catch (error) {
    console.error('Failed to fetch social data', error);
    return [];
  }
}

export async function saveSocialDataAction(key: string, data: any) {
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(["SET", key, JSON.stringify(data)]),
    });
    
    if (!res.ok) throw new Error('Upstash error');
    
    revalidatePath('/dashboard/social');
    revalidatePath('/ranking');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to save' };
  }
}

export async function deleteSocialDataAction(key: string) {
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(["DEL", key]),
    });
    
    if (!res.ok) throw new Error('Upstash error');
    
    revalidatePath('/dashboard/social');
    revalidatePath('/ranking');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete' };
  }
}
