// src/components/admin/ProductImportModal.tsx
'use client';

import { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  details: {
    productCode: string;
    productName: string;
    action: 'created' | 'updated' | 'skipped' | 'error';
    message?: string;
  }[];
}

interface ProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export function ProductImportModal({ isOpen, onClose, onImportComplete }: ProductImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith('.xlsx') || droppedFile.name.toLowerCase().endsWith('.xls')) {
        setFile(droppedFile);
      } else {
        toast.error('Prosím nahrajte soubor Excel (.xlsx nebo .xls)');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Prosím vyberte soubor');
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import selhal');
      }

      setImportResult(result);
      
      if (result.errors.length === 0) {
        toast.success(`Import dokončen: ${result.created} vytvořeno, ${result.updated} aktualizováno, ${result.skipped} přeskočeno`);
      } else {
        toast.error(`Import dokončen s chybami: ${result.errors.length} chyb`);
      }
    } catch (error) {
      toast.error(`Chyba při importu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (importResult && (importResult.created > 0 || importResult.updated > 0)) {
      onImportComplete();
    }
    setFile(null);
    setImportResult(null);
    onClose();
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/api/admin/products/export?template=true';
    link.download = 'produkty-template.xlsx';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Import produktů</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {!importResult ? (
          <>
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Info className="text-blue-600 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Jak funguje import:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Kód produktu je povinný</strong> - používá se pro identifikaci produktů</li>
                      <li>Pokud produkt s daným kódem existuje, <strong>aktualizují se pouze pole obsažená v importu</strong></li>
                      <li>Pokud produkt neexistuje, vytvoří se nový (musí obsahovat všechna povinná pole)</li>
                      <li>Prázdné buňky nebo chybějící sloupce neovlivní existující data</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Nahrajte Excel soubor (.xlsx nebo .xls) s produkty. Dostupné sloupce:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div>
                  <p className="font-semibold">Povinné pro nové produkty:</p>
                  <ul className="list-disc list-inside">
                    <li>Kód - unikátní identifikátor</li>
                    <li>Název</li>
                    <li>Cena</li>
                    <li>Skladem</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Volitelné:</p>
                  <ul className="list-disc list-inside">
                    <li>Kategorie</li>
                    <li>Značka</li>
                    <li>Běžná cena</li>
                    <li>Krátký popis</li>
                    <li>Detailní popis</li>
                    <li>Záruka</li>
                    <li>Hlavní obrázek</li>
                    <li>Slug (URL adresa)</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={downloadTemplate}
                className="text-blue-600 hover:underline text-sm"
              >
                Stáhnout prázdnou šablonu
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="text-green-600" size={24} />
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600 mb-2">
                    Přetáhněte soubor sem nebo
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:underline">vyberte soubor</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Zrušit
              </button>
              <button
                onClick={handleImport}
                disabled={!file || isImporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? 'Importování...' : 'Importovat'}
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Výsledky importu:</h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Vytvořeno</p>
                  <p className="text-2xl font-bold text-green-600">{importResult.created}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Aktualizováno</p>
                  <p className="text-2xl font-bold text-blue-600">{importResult.updated}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Přeskočeno</p>
                  <p className="text-2xl font-bold text-gray-600">{importResult.skipped}</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Chyby</p>
                  <p className="text-2xl font-bold text-red-600">{importResult.errors.length}</p>
                </div>
              </div>
            </div>

            {importResult.details.length > 0 && (
              <div className="mb-4 max-h-64 overflow-y-auto border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Kód</th>
                      <th className="px-3 py-2 text-left">Produkt</th>
                      <th className="px-3 py-2 text-left">Akce</th>
                      <th className="px-3 py-2 text-left">Zpráva</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {importResult.details.map((detail, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 font-mono text-xs">{detail.productCode}</td>
                        <td className="px-3 py-2">{detail.productName}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center gap-1 ${
                            detail.action === 'created' ? 'text-green-600' :
                            detail.action === 'updated' ? 'text-blue-600' :
                            detail.action === 'skipped' ? 'text-gray-600' :
                            'text-red-600'
                          }`}>
                            {detail.action === 'created' && <CheckCircle size={16} />}
                            {detail.action === 'updated' && <AlertCircle size={16} />}
                            {detail.action === 'skipped' && <AlertCircle size={16} />}
                            {detail.action === 'error' && <XCircle size={16} />}
                            {detail.action === 'created' ? 'Vytvořeno' :
                             detail.action === 'updated' ? 'Aktualizováno' :
                             detail.action === 'skipped' ? 'Přeskočeno' :
                             'Chyba'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {detail.message || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {importResult.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-red-600">Chyby:</h4>
                <ul className="text-sm text-red-600 list-disc list-inside max-h-32 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Zavřít
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}