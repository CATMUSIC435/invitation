import { google } from 'googleapis';

const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

if (!rawKey) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_KEY env variable');
}

const parsedKey = JSON.parse(rawKey);

const auth = new google.auth.GoogleAuth({
    credentials: parsedKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function appendRow() {
    const client: any = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1undmS83dFese3e4Kf1slQ-Iju6MHAU8sfEnJLz5pH8Y'; // 📄 Lấy từ URL Sheet
    const range = 'Sheet1!A:B'; // 👉 Cột sẽ thêm vào

    const values = [
        ['Nguyễn Văn A', 'Sự kiện XYZ'], // ✅ Dữ liệu dòng mới
    ];

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values,
        },
    });

    console.log('✅ Đã thêm dòng mới vào sheet!');
}