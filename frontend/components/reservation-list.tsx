"use client"

import { useState, useEffect } from "react"
import { useReservation } from "@/context/reservation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Reserva {
  status: any
  id: string
  clienteNombre: string
  clienteEmail: string
  peliculaTitulo: string
  sala: string
  fecha: string
  horario: string
  butacas: string[]
}

export default function ReservationList() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reservaToDelete, setReservaToDelete] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { getBookings, cancelBooking } = useReservation()

  useEffect(() => {
    loadReservations()
  }, [])

  useEffect(() => {
    filterReservations()
  }, [searchTerm, filterBy, reservas])

  const loadReservations = async () => {
    try {
      setLoading(true)
      const response = await getBookings()
      const data = response.data.map((item: any) => ({
        id: item.id.value,
        status: item.status.value,
        clienteNombre: item.customer.nameCustomer.value,
        clienteEmail: item.customer.emailCustomer.value,
        peliculaTitulo: item.billboard.movie.nameMovie.value,
        sala: item.billboard.room.nameRoom.value,
        fecha: item.dateBooking.value.split("T")[0],
        horario: `${item.billboard.starTimeBillboard.value} - ${item.billboard.endTimeBillboard.value}`,
        butacas: item.seats.map((seat: any) => `Fila ${seat.numberSeatRow.value}, Asiento ${seat.numberSeat.value}`)
      }))
      setReservas(data)
      setFilteredReservas(data)
      setError(null)
    } catch (err) {
      setError("Error al cargar las reservas. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterReservations = () => {
    let filtered = [...reservas]

    // Aplicar filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (reserva) =>
          reserva.clienteNombre.toLowerCase().includes(term) ||
          reserva.clienteEmail.toLowerCase().includes(term) ||
          reserva.peliculaTitulo.toLowerCase().includes(term),
      )
    }

    // Aplicar filtro por categoría
    if (filterBy !== "all") {
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]

      if (filterBy === "today") {
        filtered = filtered.filter((reserva) => reserva.fecha === todayStr)
      } else if (filterBy === "future") {
        filtered = filtered.filter((reserva) => reserva.fecha > todayStr)
      } else if (filterBy === "past") {
        filtered = filtered.filter((reserva) => reserva.fecha < todayStr)
      }
    }

    setFilteredReservas(filtered)
  }

  // Manejar eliminación de reserva
  const handleDeleteReservation = (reservaId: string) => {
    setReservaToDelete(reservaId)
    setDeleteDialogOpen(true)
  }

  // Confirmar eliminación de reserva
  const confirmDeleteReservation = async () => {
    if (!reservaToDelete) return

    try {
      setLoading(true)
      await cancelBooking(reservaToDelete)
      setSuccess("Reserva cancelada correctamente")
      loadReservations()
      setDeleteDialogOpen(false)

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError("Error al cancelar la reserva. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lista de Reservas</CardTitle>
        <CardDescription>
          Visualice todas las reservas realizadas en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
  
        {success && (
          <Alert className="mb-4 border-green-500 text-green-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
  
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente o película..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las reservas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="future">Próximas</SelectItem>
              <SelectItem value="past">Pasadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Cliente</TableHead>
                    <TableHead className="whitespace-nowrap">Email</TableHead>
                    <TableHead className="whitespace-nowrap">Película</TableHead>
                    <TableHead className="whitespace-nowrap">Sala</TableHead>
                    <TableHead className="whitespace-nowrap">Fecha</TableHead>
                    <TableHead className="whitespace-nowrap">Horario</TableHead>
                    <TableHead className="whitespace-nowrap">Butacas</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No se encontraron reservas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservas.map((reserva) => (
                      <TableRow key={reserva.id}>
                        <TableCell className="font-medium">
                          {reserva.clienteNombre}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {reserva.clienteEmail}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {reserva.peliculaTitulo}
                        </TableCell>
                        <TableCell>{reserva.sala}</TableCell>
                        <TableCell>{reserva.fecha}</TableCell>
                        <TableCell>{reserva.horario}</TableCell>
                        <TableCell className="max-w-[100px] truncate">
                          {reserva.butacas.join(", ")}
                        </TableCell>
                        <TableCell className="text-right">
                          {reserva.status &&<Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReservation(reserva.id)}
                          >
                    
                            <span className="hidden sm:inline">Cancelar</span>
                          </Button>
}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={loadReservations} className="ml-auto">
          Actualizar
        </Button>
      </CardFooter>
  
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cancelación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea cancelar esta reserva? Esta acción liberará las
              butacas asociadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteReservation}
              disabled={loading}
            >
              {loading ? "Cancelando..." : "Confirmar cancelación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
  
}
