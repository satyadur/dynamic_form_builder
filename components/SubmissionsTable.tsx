/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GetFormWithSubmissions } from "@/actions/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { format, formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { ElementsType, FormElementInstance } from "./FormElements";
import { toast } from "sonner";
import DeleteSubmissionsButton from "./DeleteSubmissionsButton";
import { FormSubmission } from "@/lib/generated/prisma";
import RefreshButton from "./RefreshButton";
import ExportData from "./ExportData";

type Row = { [key: string]: string } & { submittedAt: Date; id: number };

export default function SubmissionsTable({ id }: { id: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const form = await GetFormWithSubmissions(id);
      if (!form) return;

      const formElements = JSON.parse(form.content) as FormElementInstance[];
      setColumns(
        formElements
          .filter((el) =>
            [
              "TextField",
              "NumberField",
              "TextAreaField",
              "DateField",
              "SelectField",
              "CheckboxField",
            ].includes(el.type)
          )
          .map((el) => ({
            id: el.id,
            label: el.extraAttributes?.label,
            type: el.type as ElementsType,
          }))
      );

      setRows(
        form.FormSubmission.map((submission: FormSubmission) => ({
          id: submission.id,
          ...JSON.parse(submission.content),
          submittedAt: submission.createdAt,
        }))
      );
    } catch {
      toast.error("Failed to load submissions");
    }
  }, [id]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const refreshTable = () => {
    setRows((prev) => prev.filter((row) => !selected.includes(row.id)));
    setSelected([]);
  };

  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center p-2">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <div className="flex gap-2">
          <RefreshButton onRefresh={fetchSubmissions} />
          <ExportData id={id} />
          <DeleteSubmissionsButton ids={selected} onDeleted={refreshTable} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selected.length === rows.length && rows.length > 0}
                onCheckedChange={(checked) =>
                  setSelected(checked ? rows.map((r) => r.id) : [])
                }
              />
            </TableHead>
            {columns.map((col) => (
              <TableHead key={col.id} className="uppercase">
                {col.label}
              </TableHead>
            ))}
            <TableHead className="text-right">Submitted At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(row.id)}
                  onCheckedChange={() => toggleSelect(row.id)}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {col.type === "DateField" && row[col.id] ? (
                    <Badge variant="outline">
                      {format(new Date(row[col.id]), "dd/MM/yyyy")}
                    </Badge>
                  ) : col.type === "CheckboxField" ? (
                    <Checkbox checked={row[col.id] === "true"} disabled />
                  ) : (
                    row[col.id]
                  )}
                </TableCell>
              ))}
              <TableCell className="text-right">
                {formatDistance(new Date(row.submittedAt), new Date(), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
