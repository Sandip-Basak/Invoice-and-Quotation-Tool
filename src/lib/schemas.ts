import { z } from "zod";

export const invoiceFormSchema = z.object({
  id: z.string(),
  documentType: z.enum(["invoice", "quotation"]),
  invoiceNumber: z.string().min(1, "Document number is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  clientAddress: z.string().min(1, "Client address is required"),
  invoiceDate: z.date({ required_error: "Date is required." }),
  dueDate: z.date({ required_error: "Date is required." }),
  items: z.array(z.object({
    name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
  })).min(1, "At least one item is required"),
  taxType: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
  currency: z.string().min(2, "Currency is required"),
  companyDetails: z.object({
    show: z.boolean().optional().default(false),
    name: z.string().optional(),
    address: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    showName: z.boolean().optional().default(true),
    showAddress: z.boolean().optional().default(true),
    showEmail: z.boolean().optional().default(true),
    showPhone: z.boolean().optional().default(true),
  }).optional(),
  bankDetails: z.object({
    show: z.boolean().optional().default(false),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    branch: z.string().optional(),
    ifscCode: z.string().optional(),
    showAccountNumber: z.boolean().optional().default(true),
    showBankName: z.boolean().optional().default(true),
    showBranch: z.boolean().optional().default(true),
    showIfscCode: z.boolean().optional().default(true),
  }).optional(),
  signature: z.object({
    show: z.boolean().optional().default(true),
    personName: z.string().optional(),
    requireSignature: z.boolean().optional().default(false),
  }).optional(),
});

export type Invoice = z.infer<typeof invoiceFormSchema>;
