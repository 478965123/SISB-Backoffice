import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Bus,
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Filter,
  Download,
  Eye
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
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
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"

interface Trip {
  id: string
  name: string
  destination: string
  date: string
  endDate?: string
  capacity: number
  registered: number
  price: number
  description?: string
  status: "draft" | "open" | "full" | "closed" | "completed" | "cancelled"
  yearGroups: string[]
  campus: string
  createdAt: string
  updatedAt: string
}

const mockTrips: Trip[] = [
  {
    id: "FT001",
    name: "Science Museum Bangkok",
    destination: "National Science Museum, Pathum Thani",
    date: "2024-02-15",
    capacity: 120,
    registered: 95,
    price: 3000,
    description: "Educational trip to National Science Museum",
    status: "open",
    yearGroups: ["Year 4", "Year 5"],
    campus: "Thonburi",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "FT002",
    name: "Ancient City Tour",
    destination: "Ancient City (Muang Boran), Samut Prakan",
    date: "2024-02-20",
    capacity: 80,
    registered: 80,
    price: 3500,
    description: "Historical and cultural exploration",
    status: "full",
    yearGroups: ["Year 6", "Year 7"],
    campus: "Suvarnabhumi",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-18"
  },
  {
    id: "FT003",
    name: "Chao Phraya River Cruise",
    destination: "Chao Phraya River, Bangkok",
    date: "2024-02-10",
    capacity: 60,
    registered: 60,
    price: 2500,
    description: "River cruise and temple visits",
    status: "completed",
    yearGroups: ["Year 8", "Year 9"],
    campus: "Thonburi",
    createdAt: "2024-01-05",
    updatedAt: "2024-02-10"
  },
  {
    id: "FT004",
    name: "Safari World Adventure",
    destination: "Safari World, Bangkok",
    date: "2024-03-05",
    capacity: 100,
    registered: 45,
    price: 4000,
    description: "Wildlife and marine park visit",
    status: "open",
    yearGroups: ["Year 1", "Year 2", "Year 3"],
    campus: "Suvarnabhumi",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25"
  },
  {
    id: "FT005",
    name: "Ayutthaya Historical Park",
    destination: "Ayutthaya",
    date: "2024-03-15",
    capacity: 90,
    registered: 0,
    price: 3800,
    description: "UNESCO World Heritage Site visit",
    status: "draft",
    yearGroups: ["Year 10", "Year 11"],
    campus: "Thonburi",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25"
  }
]

const yearGroupOptions = [
  "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6",
  "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"
]

const campusOptions = ["Thonburi", "Suvarnabhumi", "Chiangmai", "Phuket"]

export function TripManagement() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>(mockTrips)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [campusFilter, setCampusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<Trip>>({
    name: "",
    destination: "",
    date: "",
    endDate: "",
    capacity: 0,
    price: 0,
    description: "",
    status: "draft",
    yearGroups: [],
    campus: ""
  })

  const getStatusBadge = (status: Trip['status']) => {
    const variants = {
      draft: "bg-gray-100 text-gray-800",
      open: "bg-green-100 text-green-800",
      full: "bg-blue-100 text-blue-800",
      closed: "bg-yellow-100 text-yellow-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    const matchesCampus = campusFilter === "all" || trip.campus === campusFilter
    return matchesSearch && matchesStatus && matchesCampus
  })

  const handleAddTrip = () => {
    if (!formData.name || !formData.destination || !formData.date || !formData.campus) {
      toast.error("Please fill in all required fields")
      return
    }

    const newTrip: Trip = {
      id: `FT${String(trips.length + 1).padStart(3, '0')}`,
      name: formData.name!,
      destination: formData.destination!,
      date: formData.date!,
      endDate: formData.endDate,
      capacity: formData.capacity || 0,
      registered: 0,
      price: formData.price || 0,
      description: formData.description,
      status: formData.status as Trip['status'] || "draft",
      yearGroups: formData.yearGroups || [],
      campus: formData.campus!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTrips([...trips, newTrip])
    setIsAddDialogOpen(false)
    resetForm()
    toast.success("Trip created successfully")
  }

  const handleEditTrip = () => {
    if (!selectedTrip || !formData.name || !formData.destination || !formData.date) {
      toast.error("Please fill in all required fields")
      return
    }

    const updatedTrips = trips.map(trip =>
      trip.id === selectedTrip.id
        ? {
            ...trip,
            ...formData,
            updatedAt: new Date().toISOString()
          } as Trip
        : trip
    )

    setTrips(updatedTrips)
    setIsEditDialogOpen(false)
    setSelectedTrip(null)
    resetForm()
    toast.success("Trip updated successfully")
  }

  const handleDeleteTrip = () => {
    if (!selectedTrip) return

    // Check if trip has registrations
    if (selectedTrip.registered > 0) {
      toast.error("Cannot delete trip with existing registrations")
      return
    }

    setTrips(trips.filter(trip => trip.id !== selectedTrip.id))
    setIsDeleteDialogOpen(false)
    setSelectedTrip(null)
    toast.success("Trip deleted successfully")
  }

  const openEditDialog = (trip: Trip) => {
    setSelectedTrip(trip)
    setFormData({
      name: trip.name,
      destination: trip.destination,
      date: trip.date,
      endDate: trip.endDate,
      capacity: trip.capacity,
      price: trip.price,
      description: trip.description,
      status: trip.status,
      yearGroups: trip.yearGroups,
      campus: trip.campus
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (trip: Trip) => {
    setSelectedTrip(trip)
    setIsDeleteDialogOpen(true)
  }

  const openViewDialog = (trip: Trip) => {
    setSelectedTrip(trip)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      destination: "",
      date: "",
      endDate: "",
      capacity: 0,
      price: 0,
      description: "",
      status: "draft",
      yearGroups: [],
      campus: ""
    })
  }

  const handleYearGroupToggle = (yearGroup: string) => {
    const currentYearGroups = formData.yearGroups || []
    if (currentYearGroups.includes(yearGroup)) {
      setFormData({
        ...formData,
        yearGroups: currentYearGroups.filter(y => y !== yearGroup)
      })
    } else {
      setFormData({
        ...formData,
        yearGroups: [...currentYearGroups, yearGroup]
      })
    }
  }

  const exportTrips = () => {
    toast.info("Export feature coming soon")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trip Management</h2>
          <p className="text-muted-foreground">
            Create and manage field trips for students
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTrips}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Trip
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trips by name, destination, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Trips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Field Trips ({filteredTrips.length})</CardTitle>
          <CardDescription>
            Manage all field trip information and registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Trip Name</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No trips found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">{trip.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{trip.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {trip.yearGroups.join(", ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {trip.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {format(new Date(trip.date), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>{trip.campus}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className={trip.registered >= trip.capacity ? "text-red-600 font-medium" : ""}>
                            {trip.registered}/{trip.capacity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          {trip.price.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(trip.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(trip)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(trip)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(trip)}
                            disabled={trip.registered > 0}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Trip Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Trip</DialogTitle>
            <DialogDescription>
              Create a new field trip for students
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Trip Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Science Museum Bangkok"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., National Science Museum, Pathum Thani"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (THB) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 3000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campus">Campus *</Label>
              <Select value={formData.campus} onValueChange={(value) => setFormData({ ...formData, campus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  {campusOptions.map(campus => (
                    <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Trip['status'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Year Groups</Label>
              <div className="grid grid-cols-4 gap-2">
                {yearGroupOptions.map(yearGroup => (
                  <Button
                    key={yearGroup}
                    type="button"
                    variant={formData.yearGroups?.includes(yearGroup) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleYearGroupToggle(yearGroup)}
                  >
                    {yearGroup}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the trip..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTrip}>
              <Plus className="w-4 h-4 mr-2" />
              Create Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>
              Update trip information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Trip Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-destination">Destination *</Label>
              <Input
                id="edit-destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Capacity *</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (THB) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-campus">Campus *</Label>
              <Select value={formData.campus} onValueChange={(value) => setFormData({ ...formData, campus: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {campusOptions.map(campus => (
                    <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Trip['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Year Groups</Label>
              <div className="grid grid-cols-4 gap-2">
                {yearGroupOptions.map(yearGroup => (
                  <Button
                    key={yearGroup}
                    type="button"
                    variant={formData.yearGroups?.includes(yearGroup) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleYearGroupToggle(yearGroup)}
                  >
                    {yearGroup}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTrip}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="py-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p><strong>Trip:</strong> {selectedTrip.name}</p>
                <p><strong>Destination:</strong> {selectedTrip.destination}</p>
                <p><strong>Date:</strong> {format(new Date(selectedTrip.date), "MMM dd, yyyy")}</p>
                {selectedTrip.registered > 0 && (
                  <p className="text-red-600 text-sm font-medium">
                    Cannot delete: {selectedTrip.registered} students registered
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTrip}
              disabled={selectedTrip ? selectedTrip.registered > 0 : false}
            >
              Delete Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Trip Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              View complete trip information
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Trip ID</Label>
                  <p className="font-medium">{selectedTrip.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTrip.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Trip Name</Label>
                <p className="font-medium">{selectedTrip.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Destination</Label>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {selectedTrip.destination}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(selectedTrip.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Campus</Label>
                  <p className="font-medium">{selectedTrip.campus}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Capacity</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {selectedTrip.registered} / {selectedTrip.capacity}
                    <span className="text-sm text-muted-foreground">
                      ({Math.round((selectedTrip.registered / selectedTrip.capacity) * 100)}% filled)
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    ฿{selectedTrip.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Year Groups</Label>
                <div className="flex gap-2 mt-1">
                  {selectedTrip.yearGroups.map((year, idx) => (
                    <Badge key={idx} variant="outline">{year}</Badge>
                  ))}
                </div>
              </div>
              {selectedTrip.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedTrip.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p>{format(new Date(selectedTrip.createdAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p>{format(new Date(selectedTrip.updatedAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedTrip && (
              <Button onClick={() => {
                setIsViewDialogOpen(false)
                openEditDialog(selectedTrip)
              }}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Trip
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
