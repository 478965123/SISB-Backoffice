import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Search,
  Filter,
  Calendar,
  Bus,
  Users,
  TrendingUp,
  FileText,
  Eye
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Progress } from "./ui/progress"
import { toast } from "sonner"
import { format } from "date-fns"

interface PaymentRecord {
  id: string
  studentId: string
  studentName: string
  yearGroup: string
  tripId: string
  tripName: string
  campus: string
  amount: number
  paymentDate?: string
  dueDate: string
  status: "paid" | "pending" | "overdue" | "cancelled"
  paymentMethod?: string
  transactionRef?: string
}

const mockPayments: PaymentRecord[] = [
  {
    id: "PAY001",
    studentId: "STU12345",
    studentName: "John Smith",
    yearGroup: "Year 4",
    tripId: "FT001",
    tripName: "Science Museum Bangkok",
    campus: "Thonburi",
    amount: 3000,
    paymentDate: "2024-01-20",
    dueDate: "2024-02-01",
    status: "paid",
    paymentMethod: "Credit Card",
    transactionRef: "TXN001234"
  },
  {
    id: "PAY002",
    studentId: "STU12346",
    studentName: "Emma Johnson",
    yearGroup: "Year 5",
    tripId: "FT001",
    tripName: "Science Museum Bangkok",
    campus: "Thonburi",
    amount: 3000,
    paymentDate: "2024-01-22",
    dueDate: "2024-02-01",
    status: "paid",
    paymentMethod: "Bank Transfer",
    transactionRef: "TXN001235"
  },
  {
    id: "PAY003",
    studentId: "STU12347",
    studentName: "Michael Chen",
    yearGroup: "Year 6",
    tripId: "FT002",
    tripName: "Ancient City Tour",
    campus: "Suvarnabhumi",
    amount: 3500,
    dueDate: "2024-02-05",
    status: "pending",
  },
  {
    id: "PAY004",
    studentId: "STU12348",
    studentName: "Sarah Williams",
    yearGroup: "Year 7",
    tripId: "FT002",
    tripName: "Ancient City Tour",
    campus: "Suvarnabhumi",
    amount: 3500,
    dueDate: "2024-01-25",
    status: "overdue",
  },
  {
    id: "PAY005",
    studentId: "STU12349",
    studentName: "David Brown",
    yearGroup: "Year 1",
    tripId: "FT004",
    tripName: "Safari World Adventure",
    campus: "Suvarnabhumi",
    amount: 4000,
    paymentDate: "2024-01-28",
    dueDate: "2024-02-10",
    status: "paid",
    paymentMethod: "QR Payment",
    transactionRef: "TXN001236"
  },
  {
    id: "PAY006",
    studentId: "STU12350",
    studentName: "Sophie Taylor",
    yearGroup: "Year 2",
    tripId: "FT004",
    tripName: "Safari World Adventure",
    campus: "Suvarnabhumi",
    amount: 4000,
    dueDate: "2024-02-10",
    status: "pending",
  },
  {
    id: "PAY007",
    studentId: "STU12351",
    studentName: "James Wilson",
    yearGroup: "Year 8",
    tripId: "FT003",
    tripName: "Chao Phraya River Cruise",
    campus: "Thonburi",
    amount: 2500,
    paymentDate: "2024-01-15",
    dueDate: "2024-01-30",
    status: "paid",
    paymentMethod: "Credit Card",
    transactionRef: "TXN001237"
  },
  {
    id: "PAY008",
    studentId: "STU12352",
    studentName: "Olivia Martinez",
    yearGroup: "Year 9",
    tripId: "FT003",
    tripName: "Chao Phraya River Cruise",
    campus: "Thonburi",
    amount: 2500,
    paymentDate: "2024-01-18",
    dueDate: "2024-01-30",
    status: "paid",
    paymentMethod: "Bank Transfer",
    transactionRef: "TXN001238"
  },
]

const campusOptions = ["Thonburi", "Suvarnabhumi", "Chiangmai", "Phuket"]

export function FieldTripPaymentReports() {
  const { t } = useTranslation()
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [campusFilter, setCampusFilter] = useState<string>("all")
  const [tripFilter, setTripFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Get unique trips for filter
  const uniqueTrips = Array.from(new Set(payments.map(p => p.tripId)))
    .map(id => {
      const payment = payments.find(p => p.tripId === id)
      return { id, name: payment?.tripName || "" }
    })

  const getStatusBadge = (status: PaymentRecord['status']) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    }
    return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesCampus = campusFilter === "all" || payment.campus === campusFilter
    const matchesTrip = tripFilter === "all" || payment.tripId === tripFilter

    let matchesDateRange = true
    if (dateFrom && payment.paymentDate) {
      matchesDateRange = matchesDateRange && payment.paymentDate >= dateFrom
    }
    if (dateTo && payment.paymentDate) {
      matchesDateRange = matchesDateRange && payment.paymentDate <= dateTo
    }

    return matchesSearch && matchesStatus && matchesCampus && matchesTrip && matchesDateRange
  })

  // Calculate summary statistics
  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0)
  const paidPayments = filteredPayments.filter(p => p.status === "paid")
  const pendingPayments = filteredPayments.filter(p => p.status === "pending")
  const overduePayments = filteredPayments.filter(p => p.status === "overdue")

  const totalPaidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalOverdueAmount = overduePayments.reduce((sum, p) => sum + p.amount, 0)

  const collectionRate = totalRevenue > 0
    ? Math.round((totalPaidAmount / totalRevenue) * 100)
    : 0

  const exportToCSV = () => {
    const headers = [
      "Payment ID",
      "Student ID",
      "Student Name",
      "Year Group",
      "Trip ID",
      "Trip Name",
      "Campus",
      "Amount",
      "Payment Date",
      "Due Date",
      "Status",
      "Payment Method",
      "Transaction Ref"
    ]

    const rows = filteredPayments.map(p => [
      p.id,
      p.studentId,
      p.studentName,
      p.yearGroup,
      p.tripId,
      p.tripName,
      p.campus,
      p.amount,
      p.paymentDate || "-",
      p.dueDate,
      p.status,
      p.paymentMethod || "-",
      p.transactionRef || "-"
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `field-trip-payment-report-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success("Report exported successfully")
  }

  const openViewDialog = (payment: PaymentRecord) => {
    setSelectedPayment(payment)
    setIsViewDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCampusFilter("all")
    setTripFilter("all")
    setDateFrom("")
    setDateTo("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Field Trip Payment Reports</h2>
          <p className="text-muted-foreground">
            Track and analyze payment collections for field trips
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">฿{totalPaidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {paidPayments.length} paid ({collectionRate}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">฿{totalPendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">฿{totalOverdueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {overduePayments.length} overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Collection Progress
          </CardTitle>
          <CardDescription>
            Overall payment collection status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Collection Rate</span>
              <span className="text-sm font-bold">{collectionRate}%</span>
            </div>
            <Progress value={collectionRate} className="h-3" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Paid: ฿{totalPaidAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span>Pending: ฿{totalPendingAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Overdue: ฿{totalOverdueAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student, trip, or payment ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">From Date</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">To Date</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={campusFilter} onValueChange={setCampusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by campus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  {campusOptions.map(campus => (
                    <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tripFilter} onValueChange={setTripFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by trip" />
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
          </div>
        </CardContent>
      </Card>

      {/* Payment Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({filteredPayments.length})</CardTitle>
          <CardDescription>
            Detailed payment information for all field trips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Trip</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No payment records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-xs text-muted-foreground">
                            {payment.studentId} • {payment.yearGroup}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{payment.tripName}</div>
                          <div className="text-xs text-muted-foreground">{payment.tripId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.campus}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-medium">
                          ฿{payment.amount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {format(new Date(payment.dueDate), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? (
                          <div className="text-sm text-green-600">
                            {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(payment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Payment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete payment information
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Payment ID</Label>
                  <p className="font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Student Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Student Name</Label>
                    <p className="font-medium">{selectedPayment.studentName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Student ID</Label>
                    <p className="font-medium">{selectedPayment.studentId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Year Group</Label>
                    <p className="font-medium">{selectedPayment.yearGroup}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Campus</Label>
                    <p className="font-medium">{selectedPayment.campus}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Bus className="w-4 h-4" />
                  Trip Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Trip Name</Label>
                    <p className="font-medium">{selectedPayment.tripName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Trip ID</Label>
                    <p className="font-medium">{selectedPayment.tripId}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-medium text-lg">฿{selectedPayment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Due Date</Label>
                    <p className="font-medium">
                      {format(new Date(selectedPayment.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  {selectedPayment.paymentDate && (
                    <>
                      <div>
                        <Label className="text-muted-foreground">Payment Date</Label>
                        <p className="font-medium text-green-600">
                          {format(new Date(selectedPayment.paymentDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Payment Method</Label>
                        <p className="font-medium">{selectedPayment.paymentMethod}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Transaction Reference</Label>
                        <p className="font-medium font-mono text-sm">{selectedPayment.transactionRef}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
