# Invoice and Quotation Tool

A modern, full-stack web application for efficiently creating, managing, and exporting professional invoices and quotations. Built with Next.js, TypeScript, and Tailwind CSS, and featuring AI-powered assistance with Google's Genkit.

## ✨ Features

- **📝 Create & Edit Documents:** An intuitive form for creating and modifying invoices and quotations with line items, taxes, and discounts.
- **📄 Real-Time Preview:** See a live-updating preview of your invoice as you type.
- **🤖 AI-Powered Assistance:** Utilizes Google's Genkit to provide AI-driven suggestions and automation.
- **⬇️ PDF Export:** Export your final documents to a professional-looking PDF format using `jspdf` and `html2canvas`.
- **📊 Dashboard & Analytics:** Visualize invoice data and track finances with integrated charts (`recharts`).
- **📱 Responsive Design:** Fully responsive interface built with shadcn/ui, ensuring a great experience on any device.
- **✅ Schema Validation:** Robust and type-safe forms powered by `react-hook-form` and `zod`.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Charts & Visualization:** [Recharts](https://recharts.org/)
- **Deployment:** [Firebase](https://firebase.google.com/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [Yarn](https://yarnpkg.com/) or npm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Invoice-and-Quotation-Tool.git
    cd Invoice-and-Quotation-Tool
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    The Next.js application runs on `http://localhost:9002`.
    ```bash
    npm run dev
    ```

4.  **Run the Genkit AI server:**
    To use the AI-powered features, run the Genkit server in a separate terminal.
    ```bash
    npm run genkit:dev
    ```

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs the Next.js linter to identify and fix code quality issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run genkit:dev`: Starts the Genkit development server.

## 📂 Project Structure

Here is a high-level overview of the key directories in this project:

```
.
├── src
│   ├── app/         # Core Next.js pages and layouts
│   ├── ai/          # Genkit AI flow definitions
│   ├── components/  # Shared and UI components (built with shadcn/ui)
│   │   ├── invoice/ # Components specific to the invoice feature
│   │   └── ui/      # Reusable shadcn/ui components
│   ├── hooks/       # Custom React hooks
│   └── lib/         # Utility functions and Zod schemas
├── public/          # Static assets
└── ...
```