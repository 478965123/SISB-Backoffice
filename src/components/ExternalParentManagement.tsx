import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Search, Filter, UserCheck, UserX, Eye, Mail, Phone, Calendar, Download, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner@2.0.3"

interface ExternalParent {
  id: string
  parentName: string
  parentEmail: string
  parentPhone: string
  studentName: string
  studentAge: number
  studentGrade: string
  activities: string[]
  applicationDate: Date
  status: "pending" | "approved" | "rejected" | "waitlist"
  paymentStatus: "not_paid" | "pending" | "paid"
  totalAmount: number
  notes: string
  documents: string[]
}

const mockParents: ExternalParent[] = [
  {
    id: "1",
    parentName: "Jennifer Wilson",
    parentEmail: "jennifer.wilson@email.com",
    parentPhone: "+66 87 123 4567",
    studentName: "Emma Wilson",
    studentAge: 8,
    studentGrade: "Grade 3",
    activities: ["Swimming - Beginner", "Art & Craft"],
    applicationDate: new Date("2025-08-10"),
    status: "pending",
    paymentStatus: "not_paid",
    totalAmount: 500,
    notes: "Student has previous swimming experience",
    documents: ["Birth Certificate", "Medical Certificate"]
  },
  {
    id: "2",
    parentName: "Michael Chen", 
    parentEmail: "m.chen@email.com",
    parentPhone: "+66 89 876 5432",
    studentName: "Alex Chen",
    studentAge: 10,
    studentGrade: "Grade 5",
    activities: ["Football Training", "Piano Lessons"],
    applicationDate: new Date("2025-08-08"),
    status: "approved",
    paymentStatus: "paid",
    totalAmount: 650,
    notes: "",
    documents: ["Birth Certificate", "Medical Certificate", "Previous School Records"]
  },
  {
    id: "3",
    parentName: "Sarah Thompson",
    parentEmail: "sarah.t@email.com", 
    parentPhone: "+66 82 345 6789",
    studentName: "Lily Thompson",
    studentAge: 6,
    studentGrade: "Grade 1",
    activities: ["Drama Club"],
    applicationDate: new Date("2025-08-12"),
    status: "waitlist",
    paymentStatus: "not_paid",
    totalAmount: 180,
    notes: "Requesting specific time slot",
    documents: ["Birth Certificate"]
  },
  {
    id: "4",
    parentName: "David Rodriguez",
    parentEmail: "d.rodriguez@email.com",
    parentPhone: "+66 85 987 6543",
    studentName: "Carlos Rodriguez",
    studentAge: 12,
    studentGrade: "Grade 7",
    activities: ["Basketball Skills", "Coding Club"],
    applicationDate: new Date("2025-08-05"),
    status: "rejected",
    paymentStatus: "not_paid",
    totalAmount: 420,
    notes: "Age requirement not met for selected activities",
    documents: ["Birth Certificate", "Medical Certificate"]
  },
  {
    id: "5",
    parentName: "Amanda Lee",
    parentEmail: "amanda.lee@email.com",
    parentPhone: "+66 88 234 5678",
    studentName: "Sophie Lee",
    studentAge: 9,
    studentGrade: "Grade 4",
    activities: ["Music Theory", "Chess Club"],
    applicationDate: new Date("2025-08-14"),
    status: "approved",
    paymentStatus: "pending",
    totalAmount: 380,
    notes: "Parent is SISB alumni",
    documents: ["Birth Certificate", "Medical Certificate", "Photo ID"]
  }
]

export function ExternalParentManagement() {
  const [parents] = useState<ExternalParent[]>(mockParents)
  const [filteredParents, setFilteredParents] = useState<ExternalParent[]>(mockParents)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [selectedParent, setSelectedParent] = useState<ExternalParent | null>(null)

  const applyFilters = () => {
    let filtered = parents

    if (searchTerm) {
      filtered = filtered.filter(parent => 
        parent.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.activities.some(activity => 
          activity.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(parent => parent.status === statusFilter)
    }

    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(parent => parent.paymentStatus === paymentStatusFilter)
    }

    setFilteredParents(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPaymentStatusFilter("all")
    setFilteredParents(parents)
  }

  const updateStatus = (parentId: string, newStatus: string) => {
    const parent = parents.find(p => p.id === parentId)
    if (parent) {
      toast.success(`${parent.studentName}'s application has been ${newStatus}`)
      // In a real app, this would update the backend
    }
  }

  const sendEmail = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId)
    if (parent) {
      toast.success(`Email sent to ${parent.parentName} (${parent.parentEmail})`)
      // In a real app, this would send email
    }
  }

  const downloadApplication = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId)
    if (parent) {
      // Generate CSV content for the application
      const csvContent = [
        "Field,Value",
        `Parent Name,${parent.parentName}`,
        `Parent Email,${parent.parentEmail}`,
        `Parent Phone,${parent.parentPhone}`,
        `Student Name,${parent.studentName}`,
        `Student Age,${parent.studentAge}`,
        `Student Grade,${parent.studentGrade}`,
        `Activities,"${parent.activities.join('; ')}"`,
        `Application Date,${format(parent.applicationDate, "yyyy-MM-dd")}`,
        `Status,${parent.status}`,
        `Payment Status,${parent.paymentStatus}`,
        `Total Amount,${parent.totalAmount}`,
        `Notes,"${parent.notes}"`,
        `Documents,"${parent.documents.join('; ')}"`,
      ].join("\n")

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${parent.studentName.replace(/[^a-zA-Z0-9]/g, '_')}_application.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`Application downloaded for ${parent.studentName}`)
    }
  }

  const resendEmail = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId)
    if (parent) {
      toast.success(`Reminder email resent to ${parent.parentName} (${parent.parentEmail})`)
      // In a real app, this would resend email
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "waitlist":
        return <Badge className="bg-blue-100 text-blue-800">Waitlist</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "not_paid":
        return <Badge className="bg-gray-100 text-gray-800">Not Paid</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const summaryStats = {
    total: parents.length,
    pending: parents.filter(p => p.status === "pending").length,
    approved: parents.filter(p => p.status === "approved").length,
    rejected: parents.filter(p => p.status === "rejected").length,
    waitlist: parents.filter(p => p.status === "waitlist").length,
    totalRevenue: parents.filter(p => p.paymentStatus === "paid").reduce((sum, p) => sum + p.totalAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">External Parent Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage registrations for non-SISB member parents
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Send Bulk Updates
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</div>
            <p className="text-xs text-muted-foreground">Require action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Waitlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summaryStats.waitlist}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue from External</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{summaryStats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Parent name, email, student name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Application Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="not_paid">Not Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>Clear All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredParents.length} of {parents.length} applications
        </p>
      </div>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent Details</TableHead>
                <TableHead>Student Info</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Application Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{parent.parentName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {parent.parentEmail}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {parent.parentPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{parent.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        Age {parent.studentAge} • {parent.studentGrade}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {parent.activities.map((activity, index) => (
                        <Badge key={index} variant="outline" className="block w-fit text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">฿{parent.totalAmount.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(parent.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(parent.paymentStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3" />
                      {format(parent.applicationDate, "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setSelectedParent(parent)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Application Details - {parent.studentName}</DialogTitle>
                            <DialogDescription>
                              View and manage the external parent application for after-school activities
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Parent Name</Label>
                                <p className="text-sm">{parent.parentName}</p>
                              </div>
                              <div>
                                <Label>Student Name</Label>
                                <p className="text-sm">{parent.studentName}</p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="text-sm">{parent.parentEmail}</p>
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <p className="text-sm">{parent.parentPhone}</p>
                              </div>
                              <div>
                                <Label>Student Age</Label>
                                <p className="text-sm">{parent.studentAge} years old</p>
                              </div>
                              <div>
                                <Label>Grade</Label>
                                <p className="text-sm">{parent.studentGrade}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Selected Activities</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {parent.activities.map((activity, index) => (
                                  <Badge key={index} variant="outline">{activity}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label>Documents Submitted</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {parent.documents.map((doc, index) => (
                                  <Badge key={index} variant="secondary">{doc}</Badge>
                                ))}
                              </div>
                            </div>

                            {parent.notes && (
                              <div>
                                <Label>Notes</Label>
                                <p className="text-sm bg-muted p-2 rounded">{parent.notes}</p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-4">
                              <Button 
                                onClick={() => updateStatus(parent.id, "approved")}
                                className="flex items-center gap-1"
                              >
                                <UserCheck className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => updateStatus(parent.id, "rejected")}
                                className="flex items-center gap-1"
                              >
                                <UserX className="w-4 h-4" />
                                Reject
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => sendEmail(parent.id)}
                                className="flex items-center gap-1"
                              >
                                <Mail className="w-4 h-4" />
                                Send Email
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => downloadApplication(parent.id)}
                        title="Download Application"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => sendEmail(parent.id)}
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4 text-purple-600" />
                      </Button>

                      {parent.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => updateStatus(parent.id, "approved")}
                            title="Approve Application"
                          >
                            <UserCheck className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => updateStatus(parent.id, "rejected")}
                            title="Reject Application"
                          >
                            <UserX className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}

                      {(parent.status === "approved" || parent.status === "waitlist") && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => resendEmail(parent.id)}
                          title="Resend Email"
                        >
                          <RotateCcw className="w-4 h-4 text-orange-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}