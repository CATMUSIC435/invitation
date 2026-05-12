import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS avatar_templates (
      id SERIAL PRIMARY KEY,
      slug VARCHAR UNIQUE NOT NULL,
      title VARCHAR NOT NULL,
      content TEXT,
      image_url VARCHAR,
      start_date TIMESTAMP WITH TIME ZONE,
      end_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  
  await db.execute(sql`
    INSERT INTO avatar_templates (slug, title, content, image_url)
    VALUES (
      'symlife',
      'Symlife – Căn hộ 4 Mặt View Sông, Mặt Tiền Quốc Lộ 13',
      'Vị trí đắc địa: Mặt tiền QL13, liền kề Metro, kết nối dễ dàng đến TP.HCM. \nTiện ích nội khu đẳng cấp: 50+ tiện ích 5 sao với hồ bơi vô cực, gym, công viên xanh. \nThiết kế tối ưu: Đa dạng diện tích từ 50-100m2, tối đa hóa không gian sống. \nGiá trị đầu tư: Tiềm năng tăng giá cao với hạ tầng phát triển xung quanh.',
      '/bg/symlife.png'
    ) ON CONFLICT (slug) DO NOTHING;
  `);

  console.log("Table created and data inserted");
  process.exit(0);
}
main();
