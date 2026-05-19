'use client';
import { Download } from 'lucide-react';
import ExcelJS from 'exceljs';

export default function ExportButton({ data }: { data: any[] }) {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ranking');

    // Define columns with custom widths
    worksheet.columns = [
      { header: 'Dấu thời gian', key: 'timestamp', width: 22 },
      { header: 'Họ và tên', key: 'fullName', width: 35 },
      { header: 'Số điện thoại (Chỉ nhập 4 số cuối)', key: 'phone', width: 18 },
      { header: 'Đơn vị', key: 'unit', width: 25 },
      { header: 'Số lượng VIEW', key: 'views', width: 18 },
      { header: 'Số lượng TIM', key: 'likes', width: 18 },
      { header: 'Số lượng SHARE', key: 'shares', width: 18 },
      { header: 'ĐIỂM', key: 'score', width: 15 },
      { header: 'Hình ảnh chụp màn hình', key: 'cover', width: 45 },
      { header: 'Link tiktok/facebook', key: 'url', width: 45 },
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC19D68' } // Brand color #c19d68
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    headerRow.height = 30;

    // Add data
    data.forEach((item) => {
      const usernameStr = item.username || '';
      
      // Split by hyphen `-`
      const parts = usernameStr.split('-');
      
      let fullName = usernameStr.trim();
      let unit = '';
      if (parts.length > 1) {
        unit = parts.pop()?.trim() || '';
        fullName = parts.join('-').trim();
      }

      const row = worksheet.addRow({
        timestamp: item.timestamp || '',
        fullName: fullName,
        phone: '',
        unit: unit,
        views: item.views || 0,
        likes: item.likes || 0,
        shares: item.shares || 0,
        score: item.score || 0,
        cover: item.cover ? { text: item.cover, hyperlink: item.cover, tooltip: 'Nhấp để xem ảnh' } : '',
        url: item.url ? { text: item.url, hyperlink: item.url, tooltip: 'Nhấp để mở link' } : ''
      });

      // Style data row
      row.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 11 };
        
        // Add blue underline for hyperlinks
        if (cell.value && typeof cell.value === 'object' && 'hyperlink' in cell.value) {
          cell.font = { name: 'Arial', size: 11, color: { argb: 'FF0563C1' }, underline: true };
        }

        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
        };
      });
      
      // Center align specific numeric columns
      ['E', 'F', 'G', 'H'].forEach((col) => {
        const cell = row.getCell(col);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = "BaoCao_Ranking_Fenica.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleExport} 
      className="flex flex-row items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c19d68] to-[#9a7b4f] text-white rounded-full hover:from-[#a58455] hover:to-[#7f633d] transition-all text-sm font-semibold shadow-lg shadow-[#c19d68]/20 hover:shadow-[#c19d68]/40"
    >
      <Download size={18} />
      <span>Xuất báo cáo Excel</span>
    </button>
  );
}
