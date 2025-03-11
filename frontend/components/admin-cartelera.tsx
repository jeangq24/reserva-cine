"use client"

import { useState, useEffect } from "react"
import { useReservation } from "@/context/reservation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Plus, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManageCarteleraForm from "@/components/manage-cartelera-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Pelicula {
  status: any
  id: string
  titulo: string
  horarioInicio: string
  horarioFin: string
  sala: string
  salaId: string
  fechaProyeccion: string
  reservas: number
}

interface Sala {
  id: string
  nombre: string
}

export default function AdminCartelera() {
  const [cartelera, setCartelera] = useState<Pelicula[]>([])
  const [filteredCartelera, setFilteredCartelera] = useState<Pelicula[]>([])
  const [salas, setSalas] = useState<Sala[]>([])
  const [selectedSala, setSelectedSala] = useState<string | "all">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPelicula, setSelectedPelicula] = useState<Pelicula | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("lista")
  const [editingPelicula, setEditingPelicula] = useState<string | null>(null)
  const { getBillboards, cancelBillboard, getRooms } = useReservation()

  useEffect(() => {
    loadCartelera()
    loadSalas()
  }, [])

  useEffect(() => {
    filterCarteleraBySala()
  }, [selectedSala, cartelera])

  const loadCartelera = async () => {
    try {
      setLoading(true)
      const response = await getBillboards()
      const data = response.data.map((item: any) => ({
        id: item.id.value,
        status: item.status.value,
        titulo: item.movie.nameMovie.value,
        horarioInicio: item.starTimeBillboard.value,
        horarioFin: item.endTimeBillboard.value,
        sala: item.room.nameRoom.value,
        salaId: item.room.id.value,
        fechaProyeccion: item.dateBillboard.value,
        reservas: 0 // Asumiendo que no hay información de reservas en la respuesta
      }))
      console.log(data)
      setCartelera(data)
      setFilteredCartelera(data)
      setError(null)
    } catch (err) {
      setError("Error al cargar la cartelera. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadSalas = async () => {
    try {
      const data = await getRooms()
      setSalas(data.data)
    } catch (err) {
      console.error("Error al cargar salas:", err)
    }
  }

  const filterCarteleraBySala = () => {
    if (selectedSala === "all") {
      setFilteredCartelera(cartelera)
    } else {
      setFilteredCartelera(cartelera.filter((pelicula) => pelicula.salaId === selectedSala))
    }
  }

  const handleCancelCartelera = async (peliculaId: string) => {
    try {
      await cancelBillboard(peliculaId)
      setDialogOpen(false)
      // Actualizar la cartelera después de cancelar
      loadCartelera()
    } catch (err) {
      setError("Error al cancelar la cartelera. Intente nuevamente.")
      console.error(err)
    }
  }

  const openCancelDialog = (pelicula: Pelicula) => {
    setSelectedPelicula(pelicula)
    setDialogOpen(true)
  }

  const handleEditPelicula = (peliculaId: string) => {
    setEditingPelicula(peliculaId)
    setActiveTab("nueva")
  }

  const handleFormSuccess = () => {
    loadCartelera()
    setActiveTab("lista")
    setEditingPelicula(null)
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Cartelera</TabsTrigger>
          <TabsTrigger value="nueva">{editingPelicula ? "Editar Película" : "Nueva Película"}</TabsTrigger>
        </TabsList>
        <TabsContent value="lista">
          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Administración de Cartelera</CardTitle>
                <CardDescription>Gestione las películas en cartelera y sus reservas asociadas</CardDescription>
              </div>
              <Button onClick={() => setActiveTab("nueva")} className="self-start sm:self-auto">
                <Plus className="mr-2 h-4 w-4" /> Nueva Película
              </Button>
            </CardHeader><CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mb-6 w-full"></div>
              <Select value={selectedSala} onValueChange={(value) => setSelectedSala(value)}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Filtrar por sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las salas</SelectItem>
                  {salas.map((sala) => (
                    <SelectItem key={sala.id} value={sala.id}>
                      {sala.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                          <TableHead className="whitespace-nowrap">Título</TableHead>
                          <TableHead className="whitespace-nowrap">Sala</TableHead>
                          <TableHead className="whitespace-nowrap">Fecha</TableHead>
                          <TableHead className="whitespace-nowrap">Horario Inicio</TableHead>
                          <TableHead className="whitespace-nowrap">Horario Fin</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCartelera.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No hay películas en cartelera
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCartelera.map((pelicula) => (
                            <TableRow key={pelicula.id}>
                              <TableCell className="font-medium max-w-[150px] truncate">{pelicula.titulo}</TableCell>
                              <TableCell>{pelicula.sala}</TableCell>
                              <TableCell>{pelicula.fechaProyeccion}</TableCell>
                              <TableCell>{pelicula.horarioInicio}</TableCell>
                              <TableCell>{pelicula.horarioFin}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2 flex-wrap">
                                  {/* <Button variant="outline" size="sm" onClick={() => handleEditPelicula(pelicula.id)}>
                                    <Edit className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Editar</span>
                                  </Button> */}

                                  {pelicula.status &&
                                    <Button variant="destructive" size="sm" onClick={() => openCancelDialog(pelicula)}>
                                      <span className="hidden sm:inline">Cancelar</span>
                                      <span className="inline sm:hidden">X</span>
                                    </Button>
                                  }

                                </div>
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
              <Button onClick={loadCartelera} className="ml-auto">
                Actualizar
              </Button>
            </CardFooter>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar cancelación</DialogTitle>
                  <DialogDescription>
                    ¿Está seguro que desea cancelar la película {selectedPelicula?.titulo}? Esta acción cancelará todas
                    las reservas asociadas y habilitará las butacas.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => selectedPelicula && handleCancelCartelera(selectedPelicula.id)}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>


        <TabsContent value="nueva">
          <ManageCarteleraForm carteleraId={editingPelicula ?? undefined} onSuccess={handleFormSuccess} />
        </TabsContent>
      </Tabs>

    </>
  )
}
