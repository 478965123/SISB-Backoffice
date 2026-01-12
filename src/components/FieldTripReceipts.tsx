import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Search, Download, Filter, Eye, Mail, Receipt, Users, Calendar, MapPin, Bus } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { format } from "date-fns"
import { toast } from "sonner"
import { InternalEmailManagement } from "./InternalEmailManagement"

interface TripReceipt {
  id: string
  receiptNumber: string
  tripName: string
  tripId: string
  destination: string
  tripDate: Date
  campus: string
  participantName: string
  participantId: string
  yearGroup: string
  parentName: string
  parentEmail: string
  amount: number
  paymentMethod: string
  transactionDate: Date
  transactionRef: string
  downloadCount: number
  isExternal: boolean
}

const mockReceipts: TripReceipt[] = [
  {
    id: "1",
    receiptNumber: "FT-RCP-2025-001234",
    tripName: "Science Museum Bangkok",
    tripId: "FT001",
    destination: "National Science Museum, Pathum Thani",
    tripDate: new Date("2025-02-15"),
    campus: "Thonburi",
    participantName: "Emma Johnson",
    participantId: "ST001234",
    yearGroup: "Year 4",
    parentName: "Sarah Johnson",
    parentEmail: "sarah.johnson@example.com",
    amount: 3000,
    paymentMethod: "Credit Card",
    transactionDate: new Date("2025-01-20"),
    transactionRef: "TXN001234",
    downloadCount: 2,
    isExternal: false
  },
  {
    id: "2",
    receiptNumber: "FT-RCP-2025-001235",
    tripName: "Ancient City Tour",
    tripId: "FT002",
    destination: "Ancient City (Muang Boran), Samut Prakan",
    tripDate: new Date("2025-02-20"),
    campus: "Suvarnabhumi",
    participantName: "Alex Chen",
    participantId: "EXT001235",
    yearGroup: "Year 6",
    parentName: "David Chen",
    parentEmail: "david.chen@example.com",
    amount: 3500,
    paymentMethod: "PromptPay",
    transactionDate: new Date("2025-01-18"),
    transactionRef: "TXN001235",
    downloadCount: 1,
    isExternal: true
  },
  {
    id: "3",
    receiptNumber: "FT-RCP-2025-001236",
    tripName: "Chao Phraya River Cruise",
    tripId: "FT003",
    destination: "Chao Phraya River, Bangkok",
    tripDate: new Date("2025-02-10"),
    campus: "Thonburi",
    participantName: "Maya Patel",
    participantId: "ST001236",
    yearGroup: "Year 8",
    parentName: "Raj Patel",
    parentEmail: "raj.patel@example.com",
    amount: 2500,
    paymentMethod: "Bank Transfer",
    transactionDate: new Date("2025-01-15"),
    transactionRef: "TXN001236",
    downloadCount: 3,
    isExternal: false
  },
  {
    id: "4",
    receiptNumber: "FT-RCP-2025-001237",
    tripName: "Safari World Adventure",
    tripId: "FT004",
    destination: "Safari World, Bangkok",
    tripDate: new Date("2025-03-05"),
    campus: "Suvarnabhumi",
    participantName: "Sophie Wilson",
    participantId: "EXT001237",
    yearGroup: "Year 2",
    parentName: "Jennifer Wilson",
    parentEmail: "jennifer.wilson@example.com",
    amount: 4000,
    paymentMethod: "Credit Card",
    transactionDate: new Date("2025-01-28"),
    transactionRef: "TXN001237",
    downloadCount: 0,
    isExternal: true
  },
  {
    id: "5",
    receiptNumber: "FT-RCP-2025-001238",
    tripName: "Ayutthaya Historical Park",
    tripId: "FT005",
    destination: "Ayutthaya",
    tripDate: new Date("2025-03-15"),
    campus: "Thonburi",
    participantName: "James Brown",
    participantId: "ST001238",
    yearGroup: "Year 10",
    parentName: "Michael Brown",
    parentEmail: "michael.brown@example.com",
    amount: 3800,
    paymentMethod: "QR Payment",
    transactionDate: new Date("2025-02-01"),
    transactionRef: "TXN001238",
    downloadCount: 1,
    isExternal: false
  }
]

// Add more mock data
for (let i = 6; i <= 50; i++) {
  const isExternal = Math.random() > 0.6
  const campuses = ["Thonburi", "Suvarnabhumi", "Chiangmai", "Phuket"]
  const trips = [
    { id: "FT001", name: "Science Museum Bangkok", dest: "National Science Museum" },
    { id: "FT002", name: "Ancient City Tour", dest: "Ancient City, Samut Prakan" },
    { id: "FT003", name: "Chao Phraya River Cruise", dest: "Chao Phraya River" },
    { id: "FT004", name: "Safari World Adventure", dest: "Safari World" },
    { id: "FT005", name: "Ayutthaya Historical Park", dest: "Ayutthaya" }
  ]
  const trip = trips[Math.floor(Math.random() * trips.length)]
  const grades = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]

  mockReceipts.push({
    id: i.toString(),
    receiptNumber: `FT-RCP-2025-${String(1234 + i).padStart(6, '0')}`,
    tripName: trip.name,
    tripId: trip.id,
    destination: trip.dest,
    tripDate: new Date(2025, Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 28) + 1),
    campus: campuses[Math.floor(Math.random() * campuses.length)],
    participantName: `Participant ${i}`,
    participantId: isExternal ? `EXT${String(1234 + i).padStart(6, '0')}` : `ST${String(1234 + i).padStart(6, '0')}`,
    yearGroup: grades[Math.floor(Math.random() * grades.length)],
    parentName: `Parent ${i}`,
    parentEmail: `parent${i}@example.com`,
    amount: [2500, 3000, 3500, 3800, 4000][Math.floor(Math.random() * 5)],
    paymentMethod: ["Credit Card", "PromptPay", "Bank Transfer", "QR Payment"][Math.floor(Math.random() * 4)],
    transactionDate: new Date(2025, Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1),
    transactionRef: `TXN${String(1234 + i).padStart(6, '0')}`,
    downloadCount: Math.floor(Math.random() * 5),
    isExternal
  })
}

export function FieldTripReceipts() {
  const [receipts] = useState<TripReceipt[]>(mockReceipts)
  const [filteredReceipts, setFilteredReceipts] = useState<TripReceipt[]>(mockReceipts)
  const [searchTerm, setSearchTerm] = useState("")
  const [tripFilter, setTripFilter] = useState("all")
  const [campusFilter, setCampusFilter] = useState("all")
  const [participantTypeFilter, setParticipantTypeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Get unique trips and campuses
  const uniqueTrips = Array.from(new Set(receipts.map(r => r.tripId)))
    .map(id => {
      const receipt = receipts.find(r => r.tripId === id)
      return { id, name: receipt?.tripName || "" }
    })

  const uniqueCampuses = Array.from(new Set(receipts.map(r => r.campus)))

  const applyFilters = () => {
    let filtered = receipts

    if (searchTerm) {
      filtered = filtered.filter(receipt =>
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.tripName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (tripFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.tripId === tripFilter)
    }

    if (campusFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.campus === campusFilter)
    }

    if (participantTypeFilter !== "all") {
      filtered = filtered.filter(receipt =>
        participantTypeFilter === "external" ? receipt.isExternal : !receipt.isExternal
      )
    }

    if (dateFrom) {
      filtered = filtered.filter(receipt =>
        format(receipt.transactionDate, "yyyy-MM-dd") >= dateFrom
      )
    }

    if (dateTo) {
      filtered = filtered.filter(receipt =>
        format(receipt.transactionDate, "yyyy-MM-dd") <= dateTo
      )
    }

    setFilteredReceipts(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTripFilter("all")
    setCampusFilter("all")
    setParticipantTypeFilter("all")
    setDateFrom("")
    setDateTo("")
    setFilteredReceipts(receipts)
    setCurrentPage(1)
  }

  const downloadReceipt = (receiptId: string) => {
    const receipt = receipts.find(r => r.id === receiptId)
    if (receipt) {
      toast.success(`Receipt ${receipt.receiptNumber} downloaded successfully`)
    }
  }

  const resendReceipt = (receiptId: string) => {
    const receipt = receipts.find(r => r.id === receiptId)
    if (receipt) {
      toast.success(`Receipt resent to ${receipt.parentEmail}`)
    }
  }

  const viewReceipt = (receiptId: string) => {
    const receipt = receipts.find(r => r.id === receiptId)
    if (receipt) {
      toast.info(`Viewing receipt ${receipt.receiptNumber}`)
    }
  }

  const exportAllReceipts = () => {
    toast.success("Exporting all receipts...")
  }

  const bulkResend = () => {
    toast.success(`Resending ${filteredReceipts.length} receipts...`)
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageReceipts = filteredReceipts.slice(startIndex, endIndex)

  const summaryStats = {
    total: receipts.length,
    totalDownloads: receipts.reduce((sum, r) => sum + r.downloadCount, 0),
    externalParticipants: receipts.filter(r => r.isExternal).length,
    totalRevenue: receipts.reduce((sum, r) => sum + r.amount, 0),
    avgAmount: receipts.reduce((sum, r) => sum + r.amount, 0) / receipts.length
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Field Trip Receipt Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage receipts and internal email notifications for field trips
          </p>
        </div>
      </div>

      <Tabs defaultValue="receipts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receipts" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Receipt Management
          </TabsTrigger>
          <TabsTrigger value="whitelist" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Internal Email Whitelist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">Receipt Management</h3>
              <p className="text-sm text-muted-foreground">
                View and download field trip payment receipts
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={bulkResend}>
                <Mail className="w-4 h-4" />
                Bulk Resend
              </Button>
              <Button className="flex items-center gap-2" onClick={exportAllReceipts}>
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.externalParticipants} external participants
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">฿{summaryStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg ฿{summaryStats.avgAmount.toFixed(0)} per trip
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">External Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{summaryStats.externalParticipants}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((summaryStats.externalParticipants / summaryStats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.totalDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  Avg {(summaryStats.totalDownloads / summaryStats.total).toFixed(1)} per receipt
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by receipt, participant, trip..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="grid gap-2 flex-1">
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      placeholder="From date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      placeholder="To date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Trip</Label>
                  <Select value={tripFilter} onValueChange={setTripFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Trips" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trips</SelectItem>
                      {uniqueTrips.map(trip => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.id} - {trip.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Campus</Label>
                  <Select value={campusFilter} onValueChange={setCampusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Campuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campuses</SelectItem>
                      {uniqueCampuses.map(campus => (
                        <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Participant Type</Label>
                  <Select value={participantTypeFilter} onValueChange={setParticipantTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Participants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Participants</SelectItem>
                      <SelectItem value="internal">Internal Students</SelectItem>
                      <SelectItem value="external">External Participants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={applyFilters} className="w-full md:w-auto">
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          {/* Receipts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Receipts ({filteredReceipts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt No.</TableHead>
                      <TableHead>Trip Details</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPageReceipts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No receipts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageReceipts.map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell>
                            <div className="font-mono text-sm">{receipt.receiptNumber}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(receipt.transactionDate, "MMM dd, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <Bus className="w-4 h-4 text-muted-foreground" />
                                {receipt.tripName}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {receipt.destination}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" />
                                {format(receipt.tripDate, "MMM dd, yyyy")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{receipt.participantName}</div>
                              <div className="text-xs text-muted-foreground">
                                {receipt.participantId}
                              </div>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">{receipt.yearGroup}</Badge>
                                <Badge variant="outline" className="text-xs">{receipt.campus}</Badge>
                                {receipt.isExternal && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">External</Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{receipt.parentName}</div>
                            <div className="text-xs text-muted-foreground">{receipt.parentEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold">฿{receipt.amount.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{receipt.paymentMethod}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {receipt.transactionRef}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center text-sm font-medium">{receipt.downloadCount}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewReceipt(receipt.id)}
                                title="View Receipt"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadReceipt(receipt.id)}
                                title="Download Receipt"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => resendReceipt(receipt.id)}
                                title="Resend Receipt"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredReceipts.length)} of {filteredReceipts.length} receipts
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => goToPage(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => goToPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => goToPage(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whitelist">
          <InternalEmailManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
