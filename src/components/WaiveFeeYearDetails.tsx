import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Progress } from "./ui/progress"
import { 
  Users,
  Calendar,
  Coins,
  Eye,
  Search,
  RotateCcw,
  Home,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react"

interface FamilyDetail {
  familyCode: string
  olderSibling: {
    name: string
    grade: string
    discountPeriod: string
    discountStatus: 'active' | 'completed' | 'waiting' | 'upcoming'
    termsReceived: number
    totalTerms: number
    amountReceived: number
    totalAmount: number
  }
  youngerSibling: {
    name: string
    grade: string
    discountPeriod: string
    discountStatus: 'active' | 'completed' | 'waiting' | 'upcoming'
    termsReceived: number
    totalTerms: number
    amountReceived: number
    totalAmount: number
  }
  familyTotalDiscount: number
  currentActiveStudent: 'older' | 'younger' | 'none'
}

interface WaiveFeeYearDetailsProps {
  academicYear: string
  onBack: () => void
}

export function WaiveFeeYearDetails({ academicYear, onBack }: WaiveFeeYearDetailsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Generate mock family data for the specific year
  const generateFamilyDetails = (year: string): FamilyDetail[] => {
    const families: FamilyDetail[] = []
    const yearNumber = parseInt(year.split('-')[0])
    const baseYear = 2024
    const yearIndex = yearNumber - baseYear

    const familyCodes = Array.from({ length: 25 }, (_, i) => `FAM${String(i + 1).padStart(3, '0')}`)
    
    const olderNames = ['Alex Johnson', 'Emma Smith', 'James Brown', 'Sophie Davis', 'Michael Wilson', 'Olivia Garcia', 'Daniel Martinez', 'Isabella Rodriguez', 'William Anderson', 'Charlotte Taylor', 'Benjamin Thomas', 'Amelia Jackson', 'Lucas White', 'Mia Harris', 'Henry Martin', 'Grace Lee', 'Samuel Kim', 'Chloe Chen', 'Nathan Park', 'Zoe Liu', 'Oliver Wang', 'Maya Singh', 'Ethan Cooper', 'Lily Johnson', 'Jacob Miller']
    
    const youngerNames = ['Ethan Johnson', 'Ava Smith', 'Liam Brown', 'Grace Davis', 'Noah Wilson', 'Chloe Garcia', 'Mason Martinez', 'Lily Rodriguez', 'Oliver Anderson', 'Zoe Taylor', 'Jacob Thomas', 'Hannah Jackson', 'Alexander White', 'Emily Harris', 'Samuel Martin', 'Sophie Lee', 'William Kim', 'Mia Chen', 'Lucas Park', 'Emma Liu', 'Michael Wang', 'Isabella Singh', 'Daniel Cooper', 'Charlotte Johnson', 'Benjamin Miller']

    familyCodes.forEach((familyCode, index) => {
      let currentActiveStudent: 'older' | 'younger' | 'none' = 'none'
      let olderStatus: 'active' | 'completed' | 'waiting' | 'upcoming' = 'waiting'
      let youngerStatus: 'active' | 'completed' | 'waiting' | 'upcoming' = 'waiting'
      let olderTermsReceived = 0
      let youngerTermsReceived = 0
      let olderAmountReceived = 0
      let youngerAmountReceived = 0

      // Business logic: Years 0-2 (2024-2026) younger gets discount, Years 3-5 (2027-2029) older gets discount
      if (yearIndex >= 0 && yearIndex <= 2) {
        // Younger sibling period
        currentActiveStudent = 'younger'
        youngerStatus = yearIndex < 2 ? 'completed' : 'active'
        olderStatus = 'waiting'
        
        if (yearIndex === 0) {
          youngerTermsReceived = 3
          youngerAmountReceived = 75000
        } else if (yearIndex === 1) {
          youngerTermsReceived = 3
          youngerAmountReceived = 75000
        } else {
          youngerTermsReceived = Math.floor(Math.random() * 3) + 1
          youngerAmountReceived = youngerTermsReceived * 25000
        }
      } else if (yearIndex >= 3 && yearIndex <= 5) {
        // Older sibling period
        currentActiveStudent = 'older'
        olderStatus = yearIndex < 5 ? 'upcoming' : 'active'
        youngerStatus = 'completed'
        youngerTermsReceived = 3
        youngerAmountReceived = 75000
        
        if (yearIndex === 3) {
          olderStatus = 'upcoming'
        } else if (yearIndex === 4) {
          olderStatus = 'upcoming'
        } else {
          olderTermsReceived = Math.floor(Math.random() * 3) + 1
          olderAmountReceived = olderTermsReceived * 25000
        }
      }

      const family: FamilyDetail = {
        familyCode,
        olderSibling: {
          name: olderNames[index % olderNames.length],
          grade: `Grade ${8 + (index % 5)}`,
          discountPeriod: '2027-2029',
          discountStatus: olderStatus,
          termsReceived: olderTermsReceived,
          totalTerms: 3,
          amountReceived: olderAmountReceived,
          totalAmount: 75000
        },
        youngerSibling: {
          name: youngerNames[index % youngerNames.length],
          grade: `Grade ${5 + (index % 4)}`,
          discountPeriod: '2024-2026',
          discountStatus: youngerStatus,
          termsReceived: youngerTermsReceived,
          totalTerms: 3,
          amountReceived: youngerAmountReceived,
          totalAmount: 75000
        },
        familyTotalDiscount: olderAmountReceived + youngerAmountReceived,
        currentActiveStudent
      }

      families.push(family)
    })

    return families
  }

  const familyDetails = generateFamilyDetails(academicYear)

  // Filter families based on search and status
  const filteredFamilies = familyDetails.filter(family => {
    const matchesSearch = searchQuery === '' || 
      family.familyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.olderSibling.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.youngerSibling.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      family.olderSibling.discountStatus === filterStatus ||
      family.youngerSibling.discountStatus === filterStatus

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: 'active' | 'completed' | 'waiting' | 'upcoming') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case 'waiting':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">Waiting</Badge>
      case 'upcoming':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Upcoming</Badge>
    }
  }

  const getStatusIcon = (status: 'active' | 'completed' | 'waiting' | 'upcoming') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'waiting':
        return <Clock className="w-4 h-4 text-gray-500" />
      case 'upcoming':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  // Summary calculations
  const totalFamilies = filteredFamilies.length
  const activeDiscounts = filteredFamilies.filter(f => 
    f.olderSibling.discountStatus === 'active' || f.youngerSibling.discountStatus === 'active'
  ).length
  const totalAmount = filteredFamilies.reduce((sum, f) => sum + f.familyTotalDiscount, 0)
  const totalStudentsReceiving = filteredFamilies.reduce((sum, f) => {
    let count = 0
    if (f.olderSibling.discountStatus === 'active' || f.olderSibling.discountStatus === 'completed') count++
    if (f.youngerSibling.discountStatus === 'active' || f.youngerSibling.discountStatus === 'completed') count++
    return sum + count
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Waiver Details - {academicYear}</h2>
          <p className="text-muted-foreground">
            Detailed family and student waiver information for academic year {academicYear}
          </p>
        </div>
        <Button onClick={onBack} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFamilies}</div>
            <p className="text-xs text-muted-foreground">
              families in waiver program
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeDiscounts}</div>
            <p className="text-xs text-muted-foreground">
              families with active discounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Benefiting</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudentsReceiving}</div>
            <p className="text-xs text-muted-foreground">
              students receiving waivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              total waiver amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2 min-w-[150px]">
              <Label>Status Filter</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1 min-w-[300px]">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by family code or student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Family Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Family Waiver Details
          </CardTitle>
          <CardDescription>
            Complete list of families and their sibling discount status for {academicYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Family Code</TableHead>
                  <TableHead>Older Sibling</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Younger Sibling</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Family Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFamilies.map((family) => (
                  <TableRow key={family.familyCode}>
                    <TableCell className="font-medium">
                      {family.familyCode}
                    </TableCell>
                    
                    {/* Older Sibling */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{family.olderSibling.name}</div>
                        <div className="text-sm text-muted-foreground">{family.olderSibling.grade}</div>
                        <div className="text-xs text-muted-foreground">Period: {family.olderSibling.discountPeriod}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(family.olderSibling.discountStatus)}
                        {getStatusBadge(family.olderSibling.discountStatus)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 min-w-[120px]">
                        <Progress 
                          value={(family.olderSibling.termsReceived / family.olderSibling.totalTerms) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {family.olderSibling.termsReceived}/{family.olderSibling.totalTerms} terms
                        </div>
                        <div className="text-xs font-medium">
                          {formatCurrency(family.olderSibling.amountReceived)}/{formatCurrency(family.olderSibling.totalAmount)}
                        </div>
                      </div>
                    </TableCell>

                    {/* Younger Sibling */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{family.youngerSibling.name}</div>
                        <div className="text-sm text-muted-foreground">{family.youngerSibling.grade}</div>
                        <div className="text-xs text-muted-foreground">Period: {family.youngerSibling.discountPeriod}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(family.youngerSibling.discountStatus)}
                        {getStatusBadge(family.youngerSibling.discountStatus)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 min-w-[120px]">
                        <Progress 
                          value={(family.youngerSibling.termsReceived / family.youngerSibling.totalTerms) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {family.youngerSibling.termsReceived}/{family.youngerSibling.totalTerms} terms
                        </div>
                        <div className="text-xs font-medium">
                          {formatCurrency(family.youngerSibling.amountReceived)}/{formatCurrency(family.youngerSibling.totalAmount)}
                        </div>
                      </div>
                    </TableCell>

                    {/* Family Total */}
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(family.familyTotalDiscount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        of ฿150,000 total
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredFamilies.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No families found matching your filters</p>
              <Button variant="outline" onClick={resetFilters} className="mt-2">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}