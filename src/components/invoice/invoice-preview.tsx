"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { type Totals } from "@/app/page"
import { useWatch } from "react-hook-form";

type InvoicePreviewProps = {
  logo: string | null
  totals: Totals
  fontSize: number
}

export function InvoicePreview({ logo, totals, fontSize }: InvoicePreviewProps) {
  const { control } = useFormContext()
  
  const formData = useWatch({ control });

  const {
    documentType,
    invoiceNumber,
    clientName,
    clientEmail,
    clientAddress,
    invoiceDate,
    dueDate,
    items,
    taxRate,
    taxType,
    currency,
    companyDetails,
    bankDetails,
    signature,
  } = formData;

  const subtotal = React.useMemo(
    () => items?.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.price) || 0), 0) || 0,
    [items]
  );
  
  const taxAmount = React.useMemo(
    () => subtotal * ((Number(taxRate) || 0) / 100),
    [subtotal, taxRate]
  );
  
  const total = React.useMemo(
    () => subtotal + taxAmount,
    [subtotal, taxAmount]
  );

  const currencyFormatter = React.useMemo(() => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }), [currency]);
  
  const isInvoice = documentType === 'invoice';

  return (
    <Card id="invoice-preview" className="sticky top-8">
      <CardContent className="p-8" style={{ fontSize: `${fontSize}px` }}>
        <div className="space-y-8">
          <header className="flex justify-between items-start">
            <div>
              {logo ? (
                <Image src={logo} alt="Company Logo" width={120} height={120} className="object-contain" data-ai-hint="company logo"/>
              ) : (
                <div className="w-32 h-16 bg-muted rounded-md flex items-center justify-center">
                  <span className="text-muted-foreground">Your Logo</span>
                </div>
              )}
               {companyDetails?.show && (
                <div className="mt-4">
                  {companyDetails.showName && companyDetails.name && <p className="font-bold">{companyDetails.name}</p>}
                  {companyDetails.showAddress && companyDetails.address && <p className="whitespace-pre-wrap">{companyDetails.address}</p>}
                  {companyDetails.showEmail && companyDetails.email && <p>{companyDetails.email}</p>}
                  {companyDetails.showPhone && companyDetails.phone && <p>{companyDetails.phone}</p>}
                </div>
              )}
            </div>
            <div className="text-right">
              <h1 className="font-bold text-primary uppercase" style={{ fontSize: `${fontSize * 1.5}px` }}>{isInvoice ? 'Invoice' : 'Quotation'}</h1>
              <p className="text-muted-foreground">{invoiceNumber || (isInvoice ? "INV-0000" : "QUO-0000")}</p>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold text-primary mb-2">Bill To:</h2>
              <p className="font-bold">{clientName || "Client Name"}</p>
              <p>{clientEmail || "client.email@example.com"}</p>
              <p className="whitespace-pre-wrap">{clientAddress || "Client Address"}</p>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-2">
                <span className="font-semibold">{isInvoice ? 'Invoice Date:' : 'Quotation Date:'}</span>
                <span>{invoiceDate ? format(new Date(invoiceDate), "MMM d, yyyy") : "-"}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-semibold">{isInvoice ? 'Due Date:' : 'Valid Until:'}</span>
                <span>{dueDate ? format(new Date(dueDate), "MMM d, yyyy") : "-"}</span>
              </div>
            </div>
          </section>

          <section>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length > 0 ? (
                  items.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <p className="font-medium">{item.name || "Item Name"}</p>
                        {item.description && <p className="text-muted-foreground text-sm whitespace-pre-wrap">{item.description}</p>}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity || 0}</TableCell>
                      <TableCell className="text-right">{currencyFormatter.format(item.price || 0)}</TableCell>
                      <TableCell className="text-right">{currencyFormatter.format((item.quantity || 0) * (item.price || 0))}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No items added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">Subtotal</TableCell>
                  <TableCell className="text-right font-semibold">{currencyFormatter.format(subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">{taxType || 'Tax'} ({taxRate || 0}%)</TableCell>
                  <TableCell className="text-right">{currencyFormatter.format(taxAmount)}</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="text-right font-bold text-primary">Total</TableCell>
                  <TableCell className="text-right font-bold text-primary">{currencyFormatter.format(total)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </section>
          
          {bankDetails?.show && isInvoice && (
            <section>
              <Separator className="my-4" />
              <h2 className="font-semibold text-primary mb-2">Bank Details</h2>
              <div className="text-muted-foreground space-y-1">
                {bankDetails.showBankName && bankDetails.bankName && <p><strong>Bank:</strong> {bankDetails.bankName}</p>}
                {bankDetails.showAccountNumber && bankDetails.accountNumber && <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>}
                {bankDetails.showBranch && bankDetails.branch && <p><strong>Branch:</strong> {bankDetails.branch}</p>}
                {bankDetails.showIfscCode && bankDetails.ifscCode && <p><strong>IFSC Code:</strong> {bankDetails.ifscCode}</p>}
              </div>
            </section>
          )}

          <footer className="pt-8 text-center text-muted-foreground border-t">
            {signature?.show && signature.requireSignature ? (
              <div className="pt-24 text-right">
                <div className="inline-block">
                  <div className="border-b-2 border-foreground w-48 mb-2"></div>
                  <p>Authorized Signature</p>
                  {signature.personName && <p>{signature.personName}</p>}
                </div>
              </div>
            ) : signature?.show ? (
              <p>This is a computer-generated {isInvoice ? 'invoice' : 'quotation'} and requires no signature.</p>
            ) : null}
          </footer>
        </div>
      </CardContent>
    </Card>
  )
}
