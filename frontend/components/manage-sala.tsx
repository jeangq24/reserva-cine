"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useReservation } from "@/context/reservation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Trash2 } from "lucide-react"


export default function ManageSala() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [success, setSuccess] = useState<any>(null)
  const [rooms, setRooms] = useState<any>([])
  const [seatAvailability, setSeatAvailability] = useState({});
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

  const { getRooms, createRoom, updateRoom, deleteRoom } = useReservation()

  // Inicializar el formulario con React Hook Form
  const form = useForm({
    defaultValues: {
      nameRoom: "",
      numberRoom: "",
      numberRows: "",
      numberSeatRows: "",
    },
  })

  // Cargar salas
  const loadRooms = async () => {
    try {
      const roomsData = await getRooms()
      setRooms(roomsData.data)
      setSeatAvailability
    } catch (err) {
      setError("Error al cargar salas. Intente nuevamente.")
      console.error(err)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  // Manejar edición de sala
  const handleEdit = (room: any) => {
    setEditingRoomId(room.id)
    form.reset({
      nameRoom: room.nameRoom,
      numberRoom: room.numberRoom,
      numberRows: room.numberRows,
      numberSeatRows: room.numberSeatRows,
    })
  }

  // Manejar eliminación de sala
  const handleDelete = (roomId: string) => {
    setRoomToDelete(roomId)
    setDeleteDialogOpen(true)
  }

  // Confirmar eliminación de sala
  const confirmDelete = async () => {
    if (!roomToDelete) return

    try {
      setLoading(true)
      await deleteRoom(roomToDelete)
      setSuccess("Sala eliminada correctamente")
      loadRooms()
      setDeleteDialogOpen(false)
    } catch (err) {
      setError("Error al eliminar la sala. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Cancelar edición
  const cancelEdit = () => {
    setEditingRoomId(null)
    form.reset({
      nameRoom: "",
      numberRoom: "",
      numberRows: "",
      numberSeatRows: "",
    })
  }

  // Manejar el envío del formulario
  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (editingRoomId) {
        // Actualizar sala existente
        await updateRoom({
          id: editingRoomId,
          nameRoom: data.nameRoom,
          numberRoom: Number.parseInt(data.numberRoom),
          status: true
        })
        setSuccess("Sala actualizada correctamente")
        setEditingRoomId(null)
      } else {
        // Crear nueva sala

        console.log(data)
        await createRoom({
          nameRoom: data.nameRoom,
          numberRoom: Number.parseInt(data.numberRoom),
          numberRows: Number.parseInt(data.numberRows),
          numberSeatRows: Number.parseInt(data.numberSeatRows)
        })
        setSuccess("Sala creada correctamente")
      }

      form.reset()
      loadRooms()
    } catch (err) {
      setError((err as any)?.message || (err as any)?.code || "Error al cargar datos de la sala. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{editingRoomId ? "Editar Sala" : "Crear Nueva Sala"}</CardTitle>
          <CardDescription>
            {editingRoomId ? "Actualice los detalles de la sala" : "Complete el formulario para crear una nueva sala"}
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
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="nameRoom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la sala</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Sala 1, Sala VIP, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberRoom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de sala</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!editingRoomId && <FormField
                  control={form.control}
                  name="numberRows"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de filas</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />}

                {!editingRoomId && <FormField
                  control={form.control}
                  name="numberSeatRows"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Butacas por fila</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />}
              </div>

              <div className="flex justify-end space-x-2">
                {editingRoomId && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancelar edición
                  </Button>
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                      Guardando...
                    </span>
                  ) : editingRoomId ? (
                    "Actualizar"
                  ) : (
                    "Crear"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Salas disponibles</CardTitle>
          <CardDescription>Listado de todas las salas del cine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Nombre</TableHead>
                    <TableHead className="whitespace-nowrap">Capacidad</TableHead>
                    <TableHead className="whitespace-nowrap">Filas</TableHead>
                    <TableHead className="whitespace-nowrap">Asientos por fila</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No hay salas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    rooms?.map((room: any) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.nameRoom}-{room.numberRoom}</TableCell>
                        <TableCell>{room.numberRow}</TableCell>
                        <TableCell>{room.numberRow}</TableCell>
                        <TableCell>{room.numberSeatRow}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(room)}>
                              <Edit className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Editar</span>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(room.id)}>
                              <Trash2 className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Eliminar</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta sala? Esta acción no se puede deshacer. Se eliminarán todas las
              carteleras y reservas asociadas a esta sala.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

