import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { Search, Filter, Download, Users, Calendar, CreditCard, Mail, Phone } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner@2.0.3"

interface Course {
  id: string
  name: string
  category: string
  instructor: string
  capacity: number
  enrolled: number
  waitlist: number
  schedule: string
  fee: number
  totalRevenue: number
  status: "active" | "full" | "cancelled" | "upcoming"
  location: string
  ageGroup: string
  startDate: Date
  endDate: Date
}

interface StudentRegistration {
  id: string
  studentName: string
  parentName: string
  parentType: "internal" | "external"
  yearGroup: string
  registrationDate: Date
  paymentDate?: Date
  paymentChannel: "cash" | "bank_transfer" | "credit_card" | "online_banking" | "cheque"
  paymentStatus: "paid" | "pending" | "overdue"
  amount: number
  studentEmail: string
  parentEmail: string
  parentPhone: string
}

interface CourseStudentReportProps {
  courseId?: string
}

// Mock data generation
const generateStudentRegistrations = (courseId: string, enrolledCount: number): StudentRegistration[] => {
  const students: StudentRegistration[] = []
  const firstNames = ["Emma", "Oliver", "Sophia", "James", "Isabella", "William", "Ava", "Benjamin", "Charlotte", "Lucas", "Mia", "Henry", "Amelia", "Alexander", "Harper", "Michael", "Evelyn", "Daniel", "Abigail", "Matthew"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee"]
  const yearGroups = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  const paymentChannels: StudentRegistration["paymentChannel"][] = ["bank_transfer", "credit_card", "online_banking", "cash", "cheque"]
  
  for (let i = 0; i < enrolledCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const parentFirstName = Math.random() > 0.5 ? firstNames[Math.floor(Math.random() * firstNames.length)] : "Parent"
    
    const registrationDate = new Date(2025, 7, Math.floor(Math.random() * 20) + 1) // August dates
    const hasPayment = Math.random() > 0.1 // 90% have paid
    const fee = Math.floor(Math.random() * 300) + 200 // Random fee between 200-500
    
    students.push({
      id: `${courseId}-student-${i + 1}`,
      studentName: `${firstName} ${lastName}`,
      parentName: `${parentFirstName} ${lastName}`,
      parentType: Math.random() > 0.7 ? "external" : "internal",
      yearGroup: yearGroups[Math.floor(Math.random() * yearGroups.length)],
      registrationDate,
      paymentDate: hasPayment ? new Date(registrationDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      paymentChannel: paymentChannels[Math.floor(Math.random() * paymentChannels.length)],
      paymentStatus: hasPayment ? "paid" : Math.random() > 0.5 ? "pending" : "overdue",
      amount: fee,
      studentEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sisb.ac.th`,
      parentEmail: `${parentFirstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      parentPhone: `+66 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`
    })
  }
  
  return students.sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime())
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "Swimming - Beginner",
    category: "Sports",
    instructor: "Coach Sarah",
    capacity: 20,
    enrolled: 18,
    waitlist: 5,
    schedule: "Mon, Wed, Fri 3:30-4:30 PM",
    fee: 300,
    totalRevenue: 5400,
    status: "active",
    location: "Swimming Pool",
    ageGroup: "6-8 years",
    startDate: new Date("2025-08-15"),
    endDate: new Date("2025-12-20")
  },
  {
    id: "2",
    name: "Football Training",
    category: "Sports", 
    instructor: "Coach Mike",
    capacity: 25,
    enrolled: 25,
    waitlist: 8,
    schedule: "Tue, Thu 4:00-5:00 PM",
    fee: 250,
    totalRevenue: 6250,
    status: "full",
    location: "Football Field",
    ageGroup: "9-12 years",
    startDate: new Date("2025-08-15"),
    endDate: new Date("2025-12-20")
  }
]

export function CourseStudentReport({ courseId = "1" }: CourseStudentReportProps) {
  const [studentRegistrations, setStudentRegistrations] = useState<StudentRegistration[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentRegistration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [yearGroupFilter, setYearGroupFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const course = mockCourses.find(c => c.id === courseId) || mockCourses[0]

  useEffect(() => {
    const students = generateStudentRegistrations(courseId, course.enrolled)
    setStudentRegistrations(students)
    setFilteredStudents(students)
  }, [courseId, course.enrolled])

  const applyFilters = () => {
    let filtered = studentRegistrations

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(student => student.paymentStatus === paymentStatusFilter)
    }

    if (yearGroupFilter !== "all") {
      filtered = filtered.filter(student => student.yearGroup === yearGroupFilter)
    }

    setFilteredStudents(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setPaymentStatusFilter("all")
    setYearGroupFilter("all")
    setFilteredStudents(studentRegistrations)
    setCurrentPage(1)
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentChannelIcon = (channel: string) => {
    switch (channel) {
      case "bank_transfer":
        return "🏦"
      case "credit_card":
        return "💳"
      case "online_banking":
        return "💻"
      case "cash":
        return "💵"
      case "cheque":
        return "📝"
      default:
        return "💰"
    }
  }

  const exportStudentReport = () => {
    const csvContent = [
      // Headers
      "Student Name,Parent Name,Parent Type,Year Group,Registration Date,Payment Date,Payment Status,Payment Channel,Amount,Student Email,Parent Email,Parent Phone",
      // Data rows
      ...filteredStudents.map(student => [
        student.studentName,
        student.parentName,
        student.parentType,
        student.yearGroup,
        format(student.registrationDate, "yyyy-MM-dd"),
        student.paymentDate ? format(student.paymentDate, "yyyy-MM-dd") : "",
        student.paymentStatus,
        student.paymentChannel,
        student.amount,
        student.studentEmail,
        student.parentEmail,
        student.parentPhone
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${course.name.replace(/[^a-zA-Z0-9]/g, '_')}_student_report.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success(`Student report exported for ${course.name}`)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageStudents = filteredStudents.slice(startIndex, endIndex)

  const yearGroups = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]

  const summaryStats = {
    totalStudents: filteredStudents.length,
    paidStudents: filteredStudents.filter(s => s.paymentStatus === "paid").length,
    pendingStudents: filteredStudents.filter(s => s.paymentStatus === "pending").length,
    overdueStudents: filteredStudents.filter(s => s.paymentStatus === "overdue").length,
    totalRevenue: filteredStudents.filter(s => s.paymentStatus === "paid").reduce((sum, s) => sum + s.amount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{course.name} - Student Report</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{course.schedule}</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              <span>฿{course.fee}/student</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {course.location} • {course.ageGroup}
          </p>
        </div>
        <Button onClick={exportStudentReport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.paidStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summaryStats.pendingStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.overdueStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
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
            Search & Filter Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Student, parent, email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year Group</label>
              <Select value={yearGroupFilter} onValueChange={setYearGroupFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {yearGroups.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium invisible">Actions</label>
              <div className="flex gap-2">
                <Button onClick={applyFilters}>Apply</Button>
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
          {filteredStudents.length !== studentRegistrations.length && (
            <span> (filtered from {studentRegistrations.length} total)</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Parent Information</TableHead>
                <TableHead>Year Group</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-sm text-muted-foreground">{student.studentEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.parentName}</div>
                      <div className="text-sm text-muted-foreground">{student.parentEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.yearGroup}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(student.registrationDate, "dd MMM yyyy")}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getPaymentStatusBadge(student.paymentStatus)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>{getPaymentChannelIcon(student.paymentChannel)}</span>
                          <span>฿{student.amount}</span>
                        </div>
                        {student.paymentDate && (
                          <div className="text-xs">
                            Paid: {format(student.paymentDate, "dd MMM yyyy")}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs">{student.parentPhone}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                      onClick={() => setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}