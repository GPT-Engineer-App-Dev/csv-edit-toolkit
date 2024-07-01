import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Index() {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setHeaders(result.data[0]);
          setCsvData(result.data.slice(1));
        },
      });
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, Array(headers.length).fill('')]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const newData = csvData.map((row, i) => 
      i === rowIndex ? row.map((cell, j) => j === cellIndex ? value : cell) : row
    );
    setCsvData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse([headers, ...csvData]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>CSV Upload, Edit, and Download Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
            <Button onClick={handleAddRow} className="ml-2">Add Row</Button>
            <Button onClick={handleDownload} className="ml-2">Download CSV</Button>
          </div>
          {csvData.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Input 
                          value={cell} 
                          onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)} 
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Index;