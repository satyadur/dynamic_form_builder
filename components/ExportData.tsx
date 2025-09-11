/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  FileCode2,
  FileType,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getSubmissionsByFormId } from "@/actions/form";

const ExportData = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState<
    "excel" | "pdf" | "csv" | "json" | "html" | "txt" | null
  >(null);

  // Helper: build headers + rows with labels
  const prepareData = async () => {
    const { form, submissions } = await getSubmissionsByFormId(id);
    if (!form || submissions.length === 0) {
      alert("No submissions found!");
      return null;
    }

    const fieldMap: Record<string, string> = {};
    form.forEach((f: any) => {
      fieldMap[f.id] = f.extraAttributes.label;
    });

    const columns = form.map((f: any) => fieldMap[f.id]);
    const rows = submissions.map((s: any) =>
      form.map((f: any) => s[f.id] ?? "")
    );

    return { columns, rows, form, submissions };
  };

  // Excel
  const handleExportExcel = async () => {
    setLoading("excel");
    try {
      const data = await prepareData();
      if (!data) return;

      const { columns, rows } = data;
      const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
      XLSX.writeFile(workbook, `form_${id}_submissions.xlsx`);
    } finally {
      setLoading(null);
    }
  };

  // PDF
  const handleExportPDF = async () => {
    setLoading("pdf");
    try {
      const data = await prepareData();
      if (!data) return;

      const { columns, rows } = data;
      const doc = new jsPDF();
      doc.text(`Form ${id} Submissions`, 14, 15);
      autoTable(doc, { head: [columns], body: rows, startY: 20 });
      doc.save(`form_${id}_submissions.pdf`);
    } finally {
      setLoading(null);
    }
  };

  // CSV
  const handleExportCSV = async () => {
    setLoading("csv");
    try {
      const data = await prepareData();
      if (!data) return;

      const { columns, rows } = data;
      const csv = [columns, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form_${id}_submissions.csv`;
      a.click();
    } finally {
      setLoading(null);
    }
  };

  // JSON
  const handleExportJSON = async () => {
    setLoading("json");
    try {
      const data = await prepareData();
      if (!data) return;

      const blob = new Blob(
        [
          JSON.stringify(
            { form: data.form, submissions: data.submissions },
            null,
            2
          ),
        ],
        { type: "application/json" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form_${id}_submissions.json`;
      a.click();
    } finally {
      setLoading(null);
    }
  };

  // HTML
  const handleExportHTML = async () => {
    setLoading("html");
    try {
      const data = await prepareData();
      if (!data) return;

      const { columns, rows } = data;
      const headers = columns.map((c: any) => `<th>${c}</th>`).join("");
      const body = rows
        .map(
          (r) => `<tr>${r.map((cell: any) => `<td>${cell}</td>`).join("")}</tr>`
        )
        .join("");

      const html = `
        <html><body>
          <table border="1" cellspacing="0" cellpadding="5">
            <thead><tr>${headers}</tr></thead>
            <tbody>${body}</tbody>
          </table>
        </body></html>
      `;

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form_${id}_submissions.html`;
      a.click();
    } finally {
      setLoading(null);
    }
  };

  // TXT
  const handleExportTXT = async () => {
    setLoading("txt");
    try {
      const data = await prepareData();
      if (!data) return;

      const { columns, rows } = data;
      const txt = [columns.join("\t"), ...rows.map((r) => r.join("\t"))].join(
        "\n"
      );
      const blob = new Blob([txt], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form_${id}_submissions.txt`;
      a.click();
    } finally {
      setLoading(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer"
          size="sm"
          disabled={loading !== null}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={handleExportExcel}
            disabled={loading === "excel"}
          >
            {loading === "excel" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-green-600" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
            )}
            Excel
          </Button>

          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={handleExportPDF}
            disabled={loading === "pdf"}
          >
            {loading === "pdf" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-600" />
            ) : (
              <FileText className="mr-2 h-4 w-4 text-red-600" />
            )}
            PDF
          </Button>

          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={handleExportCSV}
            disabled={loading === "csv"}
          >
            {loading === "csv" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <FileType className="mr-2 h-4 w-4 text-blue-600" />
            )}
            CSV
          </Button>

          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={handleExportJSON}
            disabled={loading === "json"}
          >
            {loading === "json" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-yellow-600" />
            ) : (
              <FileJson className="mr-2 h-4 w-4 text-yellow-600" />
            )}
            JSON
          </Button>

          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={handleExportHTML}
            disabled={loading === "html"}
          >
            {loading === "html" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600" />
            ) : (
              <FileCode2 className="mr-2 h-4 w-4 text-purple-600" />
            )}
            HTML
          </Button>

          <Button
            variant="ghost"
            className="justify-start cursor-pointer"
            onClick={handleExportTXT}
            disabled={loading === "txt"}
          >
            {loading === "txt" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-600" />
            ) : (
              <FileText className="mr-2 h-4 w-4 text-gray-600" />
            )}
            TXT
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExportData;
