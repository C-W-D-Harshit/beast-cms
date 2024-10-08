import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, MoreVertical } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import DoubleClickLink from "@/components/DoubleClickLink";
import Header from "./Header";

export default async function Page() {
  const data = await Promise.all([
    prisma.folder.findMany({
      where: {
        parentId: null,
      },
    }),
    prisma.document.findMany({
      where: {
        folderId: null,
      },
    }),
  ]);
  const [folders, documents] = data;

  console.log(folders, documents);
  const foldersData = folders.map((folder) => ({
    type: "folder",
    name: folder.name,
    owner: folder.userId,
    lastModified: folder.updatedAt,
    size: "-",
    id: folder.id,
  }));

  const filesData = documents.map((document) => ({
    type: "file",
    name: document.title,
    owner: document.userId,
    lastModified: document.updatedAt,
    size: "-",
    id: document.id,
  }));

  const allData = [...foldersData, ...filesData];
  return (
    <div>
      <Header folder={null} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Last modified</TableHead>
            <TableHead>File size</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allData.map((file, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  {file.type === "folder" && (
                    <FolderIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                  {file.type === "file" && (
                    <FileIcon className="h-5 w-5 text-blue-500" />
                  )}
                  {file.type === "spreadsheet" && (
                    <FileIcon className="h-5 w-5 text-green-500" />
                  )}
                  {file.type === "form" && (
                    <FileIcon className="h-5 w-5 text-purple-500" />
                  )}
                  {file.type === "folder" ? (
                    <DoubleClickLink href={`/my-storage/${file.id}`}>
                      {file.name}
                    </DoubleClickLink>
                  ) : (
                    <span>{file.name}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <img
                    src="/placeholder.svg"
                    alt="User"
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{"Me"}</span>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(file.lastModified), "MM/dd/yyyy")}
              </TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
