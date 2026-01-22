'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTableExcel({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p className="text-gray-500">Không có dữ liệu</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto border rounded shadow mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((key) => (
              <TableHead key={key} className="capitalize">
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {headers.map((key) => (
                <TableCell key={key}>{row[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
