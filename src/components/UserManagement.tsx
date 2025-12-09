import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  RefreshCw,
  Database,
  Clock,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "admin" | "manager" | "staff" | "viewer"
  status: "active" | "inactive"
  locations: string[]
  createdAt: Date
  lastLogin?: Date
  permissions: string[]
}

interface StudentSyncRecord {
  id: string
  studentId: string
  studentName: string
  gradeLevel: string
  location: string
  syncStatus: "success" | "failed" | "pending" | "partial"
  lastSyncDate: Date
  syncSource: "schoolbase"
  parentName: string
  parentEmail: string
  dataFields: {
    personalInfo: "synced" | "failed" | "pending"
    academicInfo: "synced" | "failed" | "pending"
    parentInfo: "synced" | "failed" | "pending"
    financialInfo: "synced" | "failed" | "pending"
  }
  errorMessage?: string
  retryCount: number
}

const mockUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@sisb.ac.th",
    phone: "+66 81 234 5678",
    role: "admin",
    status: "active",
    locations: ["PU", "SV", "TB", "CM", "NB", "RY"],
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2025-10-14T09:30:00"),
    permissions: ["all"]
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@sisb.ac.th",
    phone: "+66 82 345 6789",
    role: "manager",
    status: "active",
    locations: ["PU", "SV", "TB"],
    createdAt: new Date("2024-02-20"),
    lastLogin: new Date("2025-10-13T14:20:00"),
    permissions: ["tuition", "afterschool", "events"]
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@sisb.ac.th",
    phone: "+66 83 456 7890",
    role: "staff",
    status: "active",
    locations: ["PU"],
    createdAt: new Date("2024-03-10"),
    lastLogin: new Date("2025-10-14T08:15:00"),
    permissions: ["tuition", "reports"]
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@sisb.ac.th",
    phone: "+66 84 567 8901",
    role: "staff",
    status: "active",
    locations: ["CM", "RY"],
    createdAt: new Date("2024-04-05"),
    lastLogin: new Date("2025-10-12T16:45:00"),
    permissions: ["afterschool", "events"]
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@sisb.ac.th",
    phone: "+66 85 678 9012",
    role: "viewer",
    status: "inactive",
    locations: ["NB"],
    createdAt: new Date("2024-05-12"),
    lastLogin: new Date("2025-09-20T10:30:00"),
    permissions: ["reports"]
  }
]

const mockStudentSyncRecords: StudentSyncRecord[] = [
  {
    id: "1",
    studentId: "STD001",
    studentName: "Somchai Jaidee",
    gradeLevel: "Grade 10",
    location: "PU",
    syncStatus: "success",
    lastSyncDate: new Date("2025-10-14T08:30:00"),
    syncSource: "schoolbase",
    parentName: "Prasert Jaidee",
    parentEmail: "prasert.j@email.com",
    dataFields: {
      personalInfo: "synced",
      academicInfo: "synced",
      parentInfo: "synced",
      financialInfo: "synced"
    },
    retryCount: 0
  },
  {
    id: "2",
    studentId: "STD002",
    studentName: "Nida Wongsawat",
    gradeLevel: "Grade 9",
    location: "SV",
    syncStatus: "failed",
    lastSyncDate: new Date("2025-10-14T07:15:00"),
    syncSource: "schoolbase",
    parentName: "Somsri Wongsawat",
    parentEmail: "somsri.w@email.com",
    dataFields: {
      personalInfo: "synced",
      academicInfo: "synced",
      parentInfo: "failed",
      financialInfo: "synced"
    },
    errorMessage: "Parent contact information incomplete",
    retryCount: 2
  },
  {
    id: "3",
    studentId: "STD003",
    studentName: "Pattana Srisawat",
    gradeLevel: "Grade 11",
    location: "TB",
    syncStatus: "partial",
    lastSyncDate: new Date("2025-10-14T06:45:00"),
    syncSource: "schoolbase",
    parentName: "Wanchai Srisawat",
    parentEmail: "wanchai.s@email.com",
    dataFields: {
      personalInfo: "synced",
      academicInfo: "synced",
      parentInfo: "synced",
      financialInfo: "pending"
    },
    errorMessage: "Financial records sync delayed",
    retryCount: 1
  },
  {
    id: "4",
    studentId: "STD004",
    studentName: "Apinya Thongchai",
    gradeLevel: "Grade 8",
    location: "CM",
    syncStatus: "success",
    lastSyncDate: new Date("2025-10-13T16:20:00"),
    syncSource: "schoolbase",
    parentName: "Narong Thongchai",
    parentEmail: "narong.t@email.com",
    dataFields: {
      personalInfo: "synced",
      academicInfo: "synced",
      parentInfo: "synced",
      financialInfo: "synced"
    },
    retryCount: 0
  },
  {
    id: "5",
    studentId: "STD005",
    studentName: "Wuttichai Pongpat",
    gradeLevel: "Grade 12",
    location: "NB",
    syncStatus: "pending",
    lastSyncDate: new Date("2025-10-14T09:00:00"),
    syncSource: "schoolbase",
    parentName: "Sombat Pongpat",
    parentEmail: "sombat.p@email.com",
    dataFields: {
      personalInfo: "pending",
      academicInfo: "pending",
      parentInfo: "pending",
      financialInfo: "pending"
    },
    retryCount: 0
  },
  {
    id: "6",
    studentId: "STD006",
    studentName: "Siriporn Kaewkong",
    gradeLevel: "Grade 7",
    location: "RY",
    syncStatus: "success",
    lastSyncDate: new Date("2025-10-14T08:00:00"),
    syncSource: "schoolbase",
    parentName: "Pichai Kaewkong",
    parentEmail: "pichai.k@email.com",
    dataFields: {
      personalInfo: "synced",
      academicInfo: "synced",
      parentInfo: "synced",
      financialInfo: "synced"
    },
    retryCount: 0
  },
  {
    id: "7",
    studentId: "STD007",
    studentName: "Kittipat Rattana",
    gradeLevel: "Grade 10",
    location: "PU",
    syncStatus: "failed",
    lastSyncDate: new Date("2025-10-13T14:30:00"),
    syncSource: "schoolbase",
    parentName: "Anurak Rattana",
    parentEmail: "anurak.r@email.com",
    dataFields: {
      personalInfo: "synced",
      academicInfo: "failed",
      parentInfo: "synced",
      financialInfo: "synced"
    },
    errorMessage: "Grade level mismatch in SchoolBase",
    retryCount: 3
  }
]

const roleLabels = {
  admin: "Administrator",
  manager: "Manager",
  staff: "Staff",
  viewer: "Viewer"
}

const availableLocations = [
  { id: "PU", label: "SISB Pracha Uthit", code: "PU" },
  { id: "SV", label: "SISB Suvarnabhumi", code: "SV" },
  { id: "TB", label: "SISB Thonburi", code: "TB" },
  { id: "CM", label: "SISB Chiang Mai", code: "CM" },
  { id: "NB", label: "SISB Nonthaburi", code: "NB" },
  { id: "RY", label: "SISB Rayong", code: "RY" }
]

const availablePermissions = [
  { id: "tuition", label: "Tuition Management" },
  { id: "afterschool", label: "ECA & EAS" },
  { id: "events", label: "Event Management" },
  { id: "summer", label: "Camp" },
  { id: "invoice", label: "Invoice Management" },
  { id: "email", label: "Email Notifications" },
  { id: "reports", label: "Reports & Analytics" },
  { id: "users", label: "User Management" },
  { id: "all", label: "All Permissions" }
]

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("users")

  // User management states
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Student sync states
  const [syncRecords, setSyncRecords] = useState<StudentSyncRecord[]>(mockStudentSyncRecords)
  const [filteredSyncRecords, setFilteredSyncRecords] = useState<StudentSyncRecord[]>(mockStudentSyncRecords)
  const [syncSearchTerm, setSyncSearchTerm] = useState("")
  const [syncStatusFilter, setSyncStatusFilter] = useState("all")
  const [syncLocationFilter, setSyncLocationFilter] = useState("all")

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "staff" as User["role"],
    status: "active" as User["status"],
    locations: [] as string[],
    permissions: [] as string[]
  })

  const applyFilters = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
    setFilteredUsers(users)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Administrator</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>
      case "staff":
        return <Badge className="bg-green-100 text-green-800">Staff</Badge>
      case "viewer":
        return <Badge className="bg-gray-100 text-gray-800">Viewer</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Active</Badge>
    }
    return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" />Inactive</Badge>
  }

  const openCreateModal = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "staff",
      status: "active",
      locations: [],
      permissions: []
    })
    setIsCreateModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      locations: user.locations,
      permissions: user.permissions
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleCreateUser = () => {
    const newUser: User = {
      id: String(users.length + 1),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      locations: formData.locations,
      permissions: formData.permissions,
      createdAt: new Date()
    }

    setUsers([...users, newUser])
    setFilteredUsers([...users, newUser])
    setIsCreateModalOpen(false)
    toast.success(`User ${formData.firstName} ${formData.lastName} created successfully`)
  }

  const handleUpdateUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? {
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            locations: formData.locations,
            permissions: formData.permissions
          }
        : user
    )

    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    setIsEditModalOpen(false)
    toast.success(`User ${formData.firstName} ${formData.lastName} updated successfully`)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.filter(user => user.id !== selectedUser.id)
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    setIsDeleteModalOpen(false)
    toast.success(`User ${selectedUser.firstName} ${selectedUser.lastName} deleted successfully`)
  }

  const toggleLocation = (locationId: string) => {
    const newLocations = formData.locations.includes(locationId)
      ? formData.locations.filter(l => l !== locationId)
      : [...formData.locations, locationId]

    setFormData({
      ...formData,
      locations: newLocations
    })
  }

  const togglePermission = (permission: string) => {
    if (permission === "all") {
      setFormData({
        ...formData,
        permissions: formData.permissions.includes("all") ? [] : ["all"]
      })
    } else {
      const newPermissions = formData.permissions.includes(permission)
        ? formData.permissions.filter(p => p !== permission && p !== "all")
        : [...formData.permissions.filter(p => p !== "all"), permission]

      setFormData({
        ...formData,
        permissions: newPermissions
      })
    }
  }

  const applySyncFilters = () => {
    let filtered = syncRecords

    if (syncSearchTerm) {
      filtered = filtered.filter(record =>
        record.studentName.toLowerCase().includes(syncSearchTerm.toLowerCase()) ||
        record.studentId.toLowerCase().includes(syncSearchTerm.toLowerCase())
      )
    }

    if (syncStatusFilter !== "all") {
      filtered = filtered.filter(record => record.syncStatus === syncStatusFilter)
    }

    if (syncLocationFilter !== "all") {
      filtered = filtered.filter(record => record.location === syncLocationFilter)
    }

    setFilteredSyncRecords(filtered)
  }

  const clearSyncFilters = () => {
    setSyncSearchTerm("")
    setSyncStatusFilter("all")
    setSyncLocationFilter("all")
    setFilteredSyncRecords(syncRecords)
  }

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Success</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" />Failed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="w-3 h-3" />Pending</Badge>
      case "partial":
        return <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Partial</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFieldStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
        return <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">Synced</Badge>
      case "failed":
        return <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">Failed</Badge>
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleRetrySync = (recordId: string) => {
    toast.info(`Retrying sync for record ${recordId}...`)
    // Simulate retry logic
    setTimeout(() => {
      toast.success("Sync retry initiated successfully")
    }, 1000)
  }

  const handleBulkSync = () => {
    toast.info("Starting bulk sync from SchoolBase...")
    setTimeout(() => {
      toast.success("Bulk sync completed successfully")
    }, 2000)
  }

  const summaryStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    admins: users.filter(u => u.role === "admin").length,
    managers: users.filter(u => u.role === "manager").length,
    staff: users.filter(u => u.role === "staff").length
  }

  const syncStats = {
    totalRecords: syncRecords.length,
    successfulSyncs: syncRecords.filter(r => r.syncStatus === "success").length,
    failedSyncs: syncRecords.filter(r => r.syncStatus === "failed").length,
    pendingSyncs: syncRecords.filter(r => r.syncStatus === "pending").length,
    partialSyncs: syncRecords.filter(r => r.syncStatus === "partial").length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, permissions, and student sync status
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="student-sync" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Student Sync Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add New User
            </Button>
          </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.admins}</div>
            <p className="text-xs text-muted-foreground">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.managers}</div>
            <p className="text-xs text-muted-foreground">Management level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.staff}</div>
            <p className="text-xs text-muted-foreground">Limited access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((summaryStats.activeUsers / summaryStats.totalUsers) * 100)}% of total
            </p>
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
                  placeholder="Name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.locations.map((locationId) => {
                        const location = availableLocations.find(l => l.id === locationId)
                        return location ? (
                          <Badge key={locationId} variant="outline" className="text-xs">
                            {location.code}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.lastLogin ? (
                        <>
                          <div>{user.lastLogin.toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.lastLogin.toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.createdAt.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account with role and permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.smith@sisb.ac.th"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+66 81 234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
                {availableLocations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Switch
                      id={`create-location-${location.id}`}
                      checked={formData.locations.includes(location.id)}
                      onCheckedChange={() => toggleLocation(location.id)}
                    />
                    <Label htmlFor={`create-location-${location.id}`} className="cursor-pointer">
                      {location.label} ({location.code})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Permissions
              </Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Switch
                      id={`create-${permission.id}`}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label htmlFor={`create-${permission.id}`} className="cursor-pointer">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information, role, and permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
                {availableLocations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Switch
                      id={`edit-location-${location.id}`}
                      checked={formData.locations.includes(location.id)}
                      onCheckedChange={() => toggleLocation(location.id)}
                    />
                    <Label htmlFor={`edit-location-${location.id}`} className="cursor-pointer">
                      {location.label} ({location.code})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Permissions
              </Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Switch
                      id={`edit-${permission.id}`}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label htmlFor={`edit-${permission.id}`} className="cursor-pointer">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        </TabsContent>

        <TabsContent value="student-sync" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Student Sync Status from SchoolBase</h3>
              <p className="text-sm text-muted-foreground">
                Monitor and manage student data synchronization from SchoolBase
              </p>
            </div>
            <Button onClick={handleBulkSync} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync All Students
            </Button>
          </div>

          {/* Sync Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStats.totalRecords}</div>
                <p className="text-xs text-muted-foreground">Student records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Successful</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{syncStats.successfulSyncs}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((syncStats.successfulSyncs / syncStats.totalRecords) * 100)}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{syncStats.failedSyncs}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{syncStats.pendingSyncs}</div>
                <p className="text-xs text-muted-foreground">In queue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Partial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{syncStats.partialSyncs}</div>
                <p className="text-xs text-muted-foreground">Incomplete sync</p>
              </CardContent>
            </Card>
          </div>

          {/* Sync Filters */}
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
                      placeholder="Student name or ID"
                      value={syncSearchTerm}
                      onChange={(e) => setSyncSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sync Status</label>
                  <Select value={syncStatusFilter} onValueChange={setSyncStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select value={syncLocationFilter} onValueChange={setSyncLocationFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {availableLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={applySyncFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={clearSyncFilters}>Clear All</Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Sync Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Parent Information</TableHead>
                    <TableHead>Sync Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Retry Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSyncRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.studentName}</div>
                          <div className="text-sm text-muted-foreground">ID: {record.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.gradeLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <MapPin className="w-3 h-3" />
                          {record.location}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.parentName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {record.parentEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getSyncStatusBadge(record.syncStatus)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{record.lastSyncDate.toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {record.lastSyncDate.toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {record.retryCount > 0 ? (
                            <Badge variant="outline" className="text-orange-600">
                              {record.retryCount} {record.retryCount === 1 ? 'retry' : 'retries'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(record.syncStatus === "failed" || record.syncStatus === "partial") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRetrySync(record.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                          {record.errorMessage && (
                            <Button
                              size="sm"
                              variant="ghost"
                              title={record.errorMessage}
                              className="text-red-600"
                            >
                              <AlertCircle className="w-4 h-4" />
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
        </TabsContent>
      </Tabs>

      {/* Delete User Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                <div className="text-sm">{getRoleBadge(selectedUser.role)}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
