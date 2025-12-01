import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { InvoiceOverview } from "./InvoiceOverview"
import { ReceiptPage } from "./ReceiptPageUpdated"

export function TuitionInvoiceManagement() {
  const [activeTab, setActiveTab] = useState("invoices")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Transaction Management</h2>
        <p className="text-muted-foreground">
          Manage invoices and receipts for tuition fees
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="invoices">Invoice</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceOverview />
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6">
          <ReceiptPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}