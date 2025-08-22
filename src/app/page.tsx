"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type z } from "zod"
import { Form } from "@/components/ui/form"
import { InvoiceForm } from "@/components/invoice/invoice-form"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { invoiceFormSchema, type Invoice } from "@/lib/schemas"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2, Save, Trash2, Edit, CheckSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export type Totals = {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export default function InvoicePage() {
  const [logo, setLogo] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [totals, setTotals] = React.useState<Totals>({
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  });
  const [fontSize, setFontSize] = React.useState(14);
  const [savedInvoices, setSavedInvoices] = React.useState<Invoice[]>([]);
  const [editingInvoiceId, setEditingInvoiceId] = React.useState<string | null>(null);

  const { toast } = useToast()

  const defaultValues = {
      id: `doc_${new Date().getTime()}`,
      documentType: "invoice" as "invoice" | "quotation",
      invoiceNumber: "",
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      invoiceDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [{ name: "", description: "", quantity: 1, price: 0 }],
      taxRate: 0,
      taxType: "",
      currency: "USD",
      companyDetails: {
        show: false,
        name: "",
        address: "",
        email: "",
        phone: "",
        showName: true,
        showAddress: true,
        showEmail: true,
        showPhone: true,
      },
      bankDetails: {
        show: false,
        accountNumber: "",
        bankName: "",
        branch: "",
        ifscCode: "",
        showAccountNumber: true,
        showBankName: true,
        showBranch: true,
        showIfscCode: true,
      },
      signature: {
        show: true,
        personName: "",
        requireSignature: false,
      }
    }

  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  })

  // Load invoices and logo from localStorage on mount
  React.useEffect(() => {
    try {
      const storedInvoices = localStorage.getItem('invoices');
      const storedLogo = localStorage.getItem('companyLogo');

      if (storedInvoices) {
        const parsedInvoices = JSON.parse(storedInvoices);
        // Dates need to be converted back to Date objects
        const invoicesWithDates = parsedInvoices.map((inv: any) => ({
          ...inv,
          invoiceDate: new Date(inv.invoiceDate),
          dueDate: new Date(inv.dueDate),
        }))
        setSavedInvoices(invoicesWithDates);
      }
      
      if (storedLogo) {
        setLogo(storedLogo);
      }

    } catch (e) {
      console.error("Failed to parse data from localStorage", e)
    }
  }, []);

  // Generate a new invoice/quotation number when the form is reset to a new document
  React.useEffect(() => {
    const generateDocNumber = () => {
      const docType = form.getValues("documentType");
      const prefix = docType === 'invoice' ? 'INV' : 'QUO';
      form.setValue("invoiceNumber", `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`);
    };

    const currentDocNumber = form.getValues("invoiceNumber");
    const isNewDoc = !editingInvoiceId;
    const isEditingDifferentType = editingInvoiceId && savedInvoices.find(inv => inv.id === editingInvoiceId)?.documentType !== form.watch('documentType');
    
    if (isNewDoc && (!currentDocNumber || isEditingDifferentType)) {
      generateDocNumber();
    }
    
  }, [form, editingInvoiceId, form.watch('documentType'), savedInvoices]);

  const saveInvoicesToLocalStorage = (invoices: Invoice[]) => {
    try {
      const invoicesAsString = JSON.stringify(invoices);
      localStorage.setItem('invoices', invoicesAsString);
    } catch(e) {
      console.error("Failed to save invoices to localStorage", e)
      toast({
        title: "Error",
        description: "Could not save documents.",
        variant: "destructive",
      })
    }
  };


  const calculateTotals = () => {
    const { items, taxRate } = form.getValues();
    const subtotal = items?.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.price) || 0), 0) || 0;
    const taxAmount = subtotal * ((Number(taxRate) || 0) / 100);
    const total = subtotal + taxAmount;
    setTotals({ subtotal, taxAmount, total });
  };

  const handleGeneratePdf = async () => {
    const invoicePreviewElement = document.getElementById('invoice-preview');
    if (!invoicePreviewElement) {
       toast({
        title: "Error",
        description: "Could not find the preview element to generate PDF.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(invoicePreviewElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate PDF dimensions to fit the whole canvas
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'p' : 'l',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const docType = form.getValues('documentType');
      pdf.save(`${docType}-${form.getValues('invoiceNumber') || 'new'}.pdf`);
      
      toast({
        title: "Success!",
        description: `Your ${docType} has been downloaded.`,
      })
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  };
  

  const handleSaveInvoice = () => {
    const data = form.getValues();
    const newInvoices = [...savedInvoices, data];
    setSavedInvoices(newInvoices);
    saveInvoicesToLocalStorage(newInvoices);
    toast({
      title: `${data.documentType === 'invoice' ? 'Invoice' : 'Quotation'} Saved`,
      description: `${data.invoiceNumber} has been saved.`,
    });
    handleNewInvoice();
  };

  const handleUpdateInvoice = () => {
    if (!editingInvoiceId) return;
    const data = form.getValues();
    const updatedInvoices = savedInvoices.map(inv => inv.id === editingInvoiceId ? data : inv);
    setSavedInvoices(updatedInvoices);
    saveInvoicesToLocalStorage(updatedInvoices);
    toast({
      title: `${data.documentType === 'invoice' ? 'Invoice' : 'Quotation'} Updated`,
      description: `${data.invoiceNumber} has been updated.`,
    });
    handleNewInvoice(); // Reset form after update
  };

  const handleLoadInvoice = (invoice: Invoice) => {
    form.reset(invoice);
    setEditingInvoiceId(invoice.id);
    calculateTotals();
    toast({
      title: `${invoice.documentType === 'invoice' ? 'Invoice' : 'Quotation'} Loaded`,
      description: `Now editing ${invoice.invoiceNumber}.`,
    });
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const updatedInvoices = savedInvoices.filter(inv => inv.id !== invoiceId);
    setSavedInvoices(updatedInvoices);
    saveInvoicesToLocalStorage(updatedInvoices);
    toast({
      title: "Document Deleted",
      description: "The selected document has been deleted.",
      variant: "destructive"
    });
    if (editingInvoiceId === invoiceId) {
      handleNewInvoice();
    }
  };

  const handleNewInvoice = () => {
    const docType = form.getValues('documentType');
    form.reset({
      ...defaultValues,
      id: `doc_${new Date().getTime()}`,
      documentType: docType,
      invoiceNumber: `${docType === 'invoice' ? 'INV' : 'QUO'}-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setEditingInvoiceId(null);
    setTotals({ subtotal: 0, taxAmount: 0, total: 0 });
  }

  const handleSetLogo = (logo: string | null) => {
    setLogo(logo);
    try {
      if (logo) {
        localStorage.setItem('companyLogo', logo);
      } else {
        localStorage.removeItem('companyLogo');
      }
    } catch (e) {
      console.error("Failed to save logo to localStorage", e);
      toast({
        title: "Error",
        description: "Could not save logo.",
        variant: "destructive",
      });
    }
  };

  const documentType = form.watch('documentType');

  return (
    <Form {...form}>
      <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <FileText className="h-10 w-10 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">InvoiceFlow</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingInvoiceId ? (
                 <Button onClick={handleUpdateInvoice}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Update {documentType === 'invoice' ? 'Invoice' : 'Quotation'}
                 </Button>
              ) : (
                <Button onClick={handleSaveInvoice}>
                    <Save className="mr-2 h-4 w-4" />
                    Save {documentType === 'invoice' ? 'Invoice' : 'Quotation'}
                </Button>
              )}
              <Button onClick={handleGeneratePdf} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <InvoiceForm 
                logo={logo} 
                setLogo={handleSetLogo} 
                onCalculateTotals={calculateTotals}
                fontSize={fontSize}
                setFontSize={setFontSize}
                onNewInvoice={handleNewInvoice}
                isEditing={!!editingInvoiceId}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Saved Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {savedInvoices.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {savedInvoices.map(invoice => (
                        <div key={invoice.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <p className="font-semibold">{invoice.invoiceNumber} <span className="text-xs font-normal text-muted-foreground">({invoice.documentType})</span></p>
                            <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                             <Button variant="outline" size="sm" onClick={() => handleLoadInvoice(invoice)}>
                               <Edit className="h-4 w-4 mr-2"/>
                               Edit
                            </Button>
                             <Button variant="destructive" size="sm" onClick={() => handleDeleteInvoice(invoice.id)}>
                               <Trash2 className="h-4 w-4 mr-2"/>
                               Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No saved documents found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <InvoicePreview logo={logo} totals={totals} fontSize={fontSize} />
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm border-t">
        <p>© 2025 QubitOne. All rights reserved.</p>
        <p className="font-semibold">Powered by QubitOne</p>
      </footer>
    </Form>
  )
}
