// src/components/admin/ProductImportModal.tsx
'use client';

import { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Info, Package, Palette, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

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
  variants?: {
    created: number;
    updated: number;
    errors: number;
    details: {
      productCode: string;
      variant: string;
      action: 'created' | 'updated' | 'error';
      message?: string;
    }[];
  };
}

interface ProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const CHUNK_SIZE = 20; // Process 10 products at a time

export function ProductImportModal({ isOpen, onClose, onImportComplete }: ProductImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'variants'>('products');
  
  // Progress tracking
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

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
    
    try {
      // Read and parse the Excel file on the client side
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const products = XLSX.utils.sheet_to_json(worksheet);
      
      // Check for variants sheet
      let variants: any[] = [];
      const hasVariantsSheet = workbook.SheetNames.includes('Varianty');
      if (hasVariantsSheet) {
        const variantsSheet = workbook.Sheets['Varianty'];
        variants = XLSX.utils.sheet_to_json(variantsSheet);
        console.log(`Found ${variants.length} variants to import`);
      }
      
      // Calculate chunks
      const totalProducts = products.length;
      const chunks = Math.ceil(totalProducts / CHUNK_SIZE);
      
      setTotalCount(totalProducts);
      setTotalChunks(chunks);
      setProcessedCount(0);
      
      // Initialize aggregated results
      const aggregatedResult: ImportResult = {
        success: true,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
        details: [],
        variants: hasVariantsSheet ? {
          created: 0,
          updated: 0,
          errors: 0,
          details: []
        } : undefined
      };
      
      // Process products in chunks
      for (let i = 0; i < chunks; i++) {
        setCurrentChunk(i + 1);
        
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, totalProducts);
        const chunk = products.slice(start, end);
        
        // Send chunk to API
        const formData = new FormData();
        const chunkWorkbook = XLSX.utils.book_new();
        const chunkSheet = XLSX.utils.json_to_sheet(chunk);
        XLSX.utils.book_append_sheet(chunkWorkbook, chunkSheet, 'Products');
        
        // Include variants only in the last chunk
        if (i === chunks - 1 && variants.length > 0) {
          const variantsSheet = XLSX.utils.json_to_sheet(variants);
          XLSX.utils.book_append_sheet(chunkWorkbook, variantsSheet, 'Varianty');
        }
        
        const chunkBuffer = XLSX.write(chunkWorkbook, { type: 'array', bookType: 'xlsx' });
        const chunkBlob = new Blob([chunkBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const chunkFile = new File([chunkBlob], `chunk-${i + 1}.xlsx`, { type: chunkBlob.type });
        
        formData.append('file', chunkFile);
        formData.append('chunkInfo', JSON.stringify({
          currentChunk: i + 1,
          totalChunks: chunks,
          isLastChunk: i === chunks - 1
        }));
        
        const response = await fetch('/api/admin/products/import', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Import chunk failed');
        }
        
        // Aggregate results
        aggregatedResult.created += result.created;
        aggregatedResult.updated += result.updated;
        aggregatedResult.skipped += result.skipped;
        aggregatedResult.errors.push(...result.errors);
        aggregatedResult.details.push(...result.details);
        
        // Aggregate variant results if present
        if (result.variants && aggregatedResult.variants) {
          aggregatedResult.variants.created += result.variants.created;
          aggregatedResult.variants.updated += result.variants.updated;
          aggregatedResult.variants.errors += result.variants.errors;
          aggregatedResult.variants.details.push(...result.variants.details);
        }
        
        setProcessedCount(end);
        
        // Small delay between chunks to avoid overwhelming the server
        if (i < chunks - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setImportResult(aggregatedResult);
      
      let message = `Import dokončen: ${aggregatedResult.created} vytvořeno, ${aggregatedResult.updated} aktualizováno, ${aggregatedResult.skipped} přeskočeno`;
      
      if (aggregatedResult.variants) {
        message += ` | Varianty: ${aggregatedResult.variants.created} vytvořeno, ${aggregatedResult.variants.updated} aktualizováno`;
      }
      
      if (aggregatedResult.errors.length === 0) {
        toast.success(message);
      } else {
        toast.error(`Import dokončen s chybami: ${aggregatedResult.errors.length} chyb`);
      }
    } catch (error) {
      toast.error(`Chyba při importu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
      setImportResult({
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Neznámá chyba'],
        details: []
      });
    } finally {
      setIsImporting(false);
      setCurrentChunk(0);
      setTotalChunks(0);
    }
  };

  const handleClose = () => {
    if (importResult && (importResult.created > 0 || importResult.updated > 0)) {
      onImportComplete();
    }
    setFile(null);
    setImportResult(null);
    setProcessedCount(0);
    setTotalCount(0);
    setActiveTab('products');
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
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Import produktů</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isImporting}
          >
            <X size={24} />
          </button>
        </div>

        {!importResult ? (
          <>
            {/* Simplified instructions */}
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Info size={20} />
                  Jak funguje import
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• <strong>Kód produktu je klíčový</strong> - podle něj se produkty identifikují</p>
                  <p>• Existující produkty se <strong>aktualizují pouze v zadaných polích</strong></p>
                  <p>• Prázdná pole nebo chybějící sloupce <strong>neovlivní existující data</strong></p>
                  <p>• Soubory s mnoha produkty jsou <strong>automaticky zpracovány po částech</strong></p>
                </div>
              </div>
            </div>

            {/* Cleaner field structure display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} />
                  List 1: Produkty
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Povinné pro nové produkty:</p>
                    <ul className="space-y-1 text-gray-600 ml-4">
                      <li>• <strong>Kód</strong> - unikátní identifikátor</li>
                      <li>• <strong>Název</strong> - název produktu</li>
                      <li>• <strong>Cena</strong> - prodejní cena</li>
                      <li>• <strong>Skladem</strong> - počet kusů</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Volitelné pole:</p>
                    <ul className="space-y-1 text-gray-600 ml-4">
                      <li>• Kategorie, Značka</li>
                      <li>• Běžná cena (přeškrtnutá)</li>
                      <li>• Krátký a detailní popis</li>
                      <li>• Záruka</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Palette size={18} />
                  List 2: Varianty (volitelné)
                </h4>
                
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">Pro produkty s různými barvami nebo velikostmi:</p>
                  
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• <strong>Kód produktu</strong> - musí odpovídat kódu v listu 1</li>
                    <li>• <strong>Barva</strong> + <strong>Kód barvy</strong> - pro barevné varianty</li>
                    <li>• <strong>Velikost</strong> - pro velikostní varianty</li>
                    <li>• <strong>Varianta</strong> - pro jiné typy variant</li>
                    <li>• Skladem, Cena varianty, Běžná cena</li>
                  </ul>
                  
                  <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2">
                    <p className="text-xs text-yellow-800">
                      <strong>Tip:</strong> Pořadí variant v souboru odpovídá pořadí na webu
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Template download */}
            <div className="flex justify-center mb-6">
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
              >
                <Download size={18} />
                Stáhnout prázdnou šablonu Excel
              </button>
            </div>

            {/* File upload area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
                    disabled={isImporting}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600 mb-2">
                    Přetáhněte soubor Excel sem nebo
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
                  <p className="text-xs text-gray-500 mt-2">
                    Podporované formáty: .xlsx, .xls
                  </p>
                </>
              )}
            </div>

            {/* Progress indicator */}
            {isImporting && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Zpracovávání produktů...</span>
                  <span>{processedCount} / {totalCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalCount > 0 ? (processedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
                {totalChunks > 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Část {currentChunk} z {totalChunks}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleClose}
                disabled={isImporting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Zrušit
              </button>
              <button
                onClick={handleImport}
                disabled={!file || isImporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? `Importování... (${processedCount}/${totalCount})` : 'Importovat'}
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

              {importResult.variants && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Varianty:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Vytvořeno variant</p>
                      <p className="text-xl font-bold text-green-600">{importResult.variants.created}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Aktualizováno variant</p>
                      <p className="text-xl font-bold text-blue-600">{importResult.variants.updated}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Chyb variant</p>
                      <p className="text-xl font-bold text-red-600">{importResult.variants.errors}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(importResult.details.length > 0 || (importResult.variants && importResult.variants.details.length > 0)) && (
              <div className="mb-4">
                <div className="flex space-x-4 mb-4 border-b">
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-2 px-1 flex items-center space-x-2 ${
                      activeTab === 'products' 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Produkty ({importResult.details.length})</span>
                  </button>
                  {importResult.variants && importResult.variants.details.length > 0 && (
                    <button
                      onClick={() => setActiveTab('variants')}
                      className={`pb-2 px-1 flex items-center space-x-2 ${
                        activeTab === 'variants' 
                          ? 'border-b-2 border-blue-500 text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Palette className="w-4 h-4" />
                      <span>Varianty ({importResult.variants.details.length})</span>
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto border rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left">Kód</th>
                        <th className="px-3 py-2 text-left">{activeTab === 'products' ? 'Produkt' : 'Varianta'}</th>
                        <th className="px-3 py-2 text-left">Akce</th>
                        <th className="px-3 py-2 text-left">Zpráva</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {activeTab === 'products' ? (
                        importResult.details.map((detail, index) => (
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
                        ))
                      ) : (
                        importResult.variants?.details.map((detail, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 font-mono text-xs">{detail.productCode}</td>
                            <td className="px-3 py-2">{detail.variant}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex items-center gap-1 ${
                                detail.action === 'created' ? 'text-green-600' :
                                detail.action === 'updated' ? 'text-blue-600' :
                                'text-red-600'
                              }`}>
                                {detail.action === 'created' && <CheckCircle size={16} />}
                                {detail.action === 'updated' && <AlertCircle size={16} />}
                                {detail.action === 'error' && <XCircle size={16} />}
                                {detail.action === 'created' ? 'Vytvořeno' :
                                 detail.action === 'updated' ? 'Aktualizováno' :
                                 'Chyba'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-600">
                              {detail.message || '—'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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