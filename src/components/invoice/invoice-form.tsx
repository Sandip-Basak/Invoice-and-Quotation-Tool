"use client"

import * as React from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CalendarIcon, PlusCircle, Trash2, UploadCloud, Calculator, FilePlus2, X } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


type InvoiceFormProps = {
  logo: string | null
  setLogo: (logo: string | null) => void
  onCalculateTotals: () => void
  fontSize: number
  setFontSize: (size: number) => void
  onNewInvoice: () => void
  isEditing: boolean
}

export function InvoiceForm({ logo, setLogo, onCalculateTotals, fontSize, setFontSize, onNewInvoice, isEditing }: InvoiceFormProps) {
  const form = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const showCompanyDetails = form.watch("companyDetails.show")
  const showBankDetails = form.watch("bankDetails.show")
  const showSignatureSection = form.watch("signature.show")
  const requireSignature = form.watch("signature.requireSignature")
  const documentType = form.watch("documentType")

  return (
    <Form {...form}>
      <form className="space-y-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{documentType === 'invoice' ? 'Invoice' : 'Quotation'} Editor</CardTitle>
                <Button type="button" variant="outline" onClick={onNewInvoice} disabled={!isEditing}>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    New {documentType === 'invoice' ? 'Invoice' : 'Quotation'}
                </Button>
            </CardHeader>
            <CardContent>
               <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Document Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="invoice" />
                          </FormControl>
                          <FormLabel className="font-normal">Invoice</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="quotation" />
                          </FormControl>
                          <FormLabel className="font-normal">Quotation</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Client's full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{documentType === 'invoice' ? 'Invoice' : 'Quotation'} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{documentType === 'invoice' ? 'Invoice' : 'Quotation'} Number</FormLabel>
                  <FormControl>
                    <Input placeholder={documentType === 'invoice' ? "e.g. INV-2024-001" : "e.g. QUO-2024-001"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{documentType === 'invoice' ? 'Invoice Date' : 'Quotation Date'}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{documentType === 'invoice' ? 'Due Date' : 'Valid Until'}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="taxType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. GST" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD - United States Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4 relative">
                 <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Web Design" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Item or service description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Item
                </Button>
              </div>
            ))}
             <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: "", description: '', quantity: 1, price: 0 })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                <Button
                  type="button"
                  onClick={onCalculateTotals}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Totals
                </Button>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Company Details</CardTitle>
              <FormField
                control={form.control}
                name="companyDetails.show"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel>Show</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          {showCompanyDetails && (
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg space-y-4">
                 <FormField
                  control={form.control}
                  name="companyDetails.name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Company Name</FormLabel>
                         <FormField
                          control={form.control}
                          name="companyDetails.showName"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="companyDetails.address"
                  render={({ field }) => (
                    <FormItem>
                       <div className="flex justify-between items-center">
                        <FormLabel>Company Address</FormLabel>
                         <FormField
                          control={form.control}
                          name="companyDetails.showAddress"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Textarea placeholder="e.g. 123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="companyDetails.email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Company Email</FormLabel>
                        <FormField
                          control={form.control}
                          name="companyDetails.showEmail"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. contact@acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="companyDetails.phone"
                  render={({ field }) => (
                    <FormItem>
                       <div className="flex justify-between items-center">
                        <FormLabel>Company Phone</FormLabel>
                        <FormField
                          control={form.control}
                          name="companyDetails.showPhone"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bank Details</CardTitle>
              <FormField
                control={form.control}
                name="bankDetails.show"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel>Show</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          {showBankDetails && (
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg space-y-4">
                 <FormField
                  control={form.control}
                  name="bankDetails.bankName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Bank Name</FormLabel>
                         <FormField
                          control={form.control}
                          name="bankDetails.showBankName"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. Global Banking Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bankDetails.accountNumber"
                  render={({ field }) => (
                    <FormItem>
                       <div className="flex justify-between items-center">
                        <FormLabel>Account Number</FormLabel>
                         <FormField
                          control={form.control}
                          name="bankDetails.showAccountNumber"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. 1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bankDetails.branch"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Branch</FormLabel>
                        <FormField
                          control={form.control}
                          name="bankDetails.showBranch"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. Main Street Branch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bankDetails.ifscCode"
                  render={({ field }) => (
                    <FormItem>
                       <div className="flex justify-between items-center">
                        <FormLabel>IFSC Code</FormLabel>
                        <FormField
                          control={form.control}
                          name="bankDetails.showIfscCode"
                          render={({ field }) => (
                             <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              />
                          )}
                          />
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. GBCORP0001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Signature</CardTitle>
              <FormField
                control={form.control}
                name="signature.show"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel>Show</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          {showSignatureSection && (
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg space-y-4">
                <FormField
                  control={form.control}
                  name="signature.requireSignature"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Require Signature</FormLabel>
                        <FormDescription>
                          { requireSignature ? "A signature line will be shown." : `Shows 'Computer-generated ${documentType}'.` }
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {requireSignature && (
                  <FormField
                    control={form.control}
                    name="signature.personName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authorized Person Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Jane Smith, Accounts Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formatting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
              </div>
              <Slider
                id="font-size"
                min={10}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="logo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                    </div>
                    <FormControl>
                      <Input id="logo-upload" type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    </FormControl>
                  </FormLabel>
                  <FormDescription>Your company logo will appear on the document.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {logo && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Logo Preview:</p>
                <div className="relative w-32 h-32 p-2 border rounded-md">
                  <Image src={logo} alt="Company logo preview" layout="fill" objectFit="contain" />
                   <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setLogo(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </form>
    </Form>
  )
}
