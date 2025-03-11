"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useReservation } from "@/context/reservation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Esquema de validación para el formulario
const reservationFormSchema = z.object({
  clienteNombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  clienteApellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  clienteDocumento: z.string().min(10, { message: "El número de documento debe tener al menos 10 caracteres" }),
  clienteTelefono: z.string().min(10, { message: "El teléfono debe tener al menos 10 caracteres" }),
  clienteEmail: z.string().email({ message: "Ingrese un email válido" }),
  clienteEdad: z.string().min(1, { message: "Ingrese una edad válida" }),
  peliculaId: z.string().min(1, { message: "Seleccione una película" }),
  butacas: z.array(z.string()).min(1, { message: "Seleccione al menos una butaca" }),
})

type ReservationFormValues = z.infer<typeof reservationFormSchema>

interface ManageReservationFormProps {
  reservationId?: string // Si se proporciona, estamos editando una reserva existente
  onSuccess?: () => void
}

export default function ManageReservationForm({ reservationId, onSuccess }: ManageReservationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [peliculas, setPeliculas] = useState<Array<{ id: string; titulo: string; sala: any; horario: string }>>([])
  const [butacasDisponibles, setButacasDisponibles] = useState<Array<{ id: string; fila: string; numero: number }>>([])
  const [selectedPelicula, setSelectedPelicula] = useState<any | null>(null)

  const { getBillboards, getAvailableSeatsByRoomId, createBooking } = useReservation()

  // Inicializar el formulario con React Hook Form
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      clienteNombre: "",
      clienteApellido: "",
      clienteDocumento: "",
      clienteTelefono: "",
      clienteEmail: "",
      clienteEdad: "0",
      peliculaId: "",
      butacas: [],
    },
  })

  // Cargar películas disponibles
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await getBillboards()
        const moviesData = response.data.map((item: any) => ({
          id: item.id.value,
          idMovie: item.movie.id.value,
          titulo: item.movie.nameMovie.value,
          sala: {
            id: item.room.id.value,
            nombreSala: item.room.nameRoom.value,
            numeroSala: item.room.numberRoom.value,
            status: item.status.value
          },
          horario: `${item.starTimeBillboard.value} - ${item.endTimeBillboard.value}`,
        }))

        setPeliculas(moviesData)
      } catch (err) {
        setError("Error al cargar películas. Intente nuevamente.")
        console.error(err)
      }
    }

    loadMovies()
  }, [])

  // Cargar butacas disponibles cuando se selecciona una película
  useEffect(() => {
    if (!selectedPelicula) return

    const loadAvailableSeats = async () => {
      try {
        const selectedMovie = peliculas.find((p) => p.id === selectedPelicula)
        if (!selectedMovie) {
          setError("Película no encontrada")
          return
        }

        const response = await getAvailableSeatsByRoomId(selectedMovie.sala.id)
        console.log(response.data)
        const seats = response.data.map((seat: any) => ({
          id: seat.id.value,
          fila: seat.numberSeatRow.value,
          numero: seat.numberSeat.value,
        }))

        setButacasDisponibles(seats)
      } catch (err) {
        setError("Error al cargar butacas disponibles. Intente nuevamente.")
        console.error(err)
      }
    }

    loadAvailableSeats()
  }, [selectedPelicula])

  // Manejar cambio de película seleccionada
  const handlePeliculaChange = (peliculaId: string) => {
    setSelectedPelicula(peliculaId)
    form.setValue("peliculaId", peliculaId)
    form.setValue("butacas", []) // Resetear butacas seleccionadas
  }

  // Manejar el envío del formulario
  const onSubmit = async (data: ReservationFormValues) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const pelicula = peliculas.find((p) => p.id === data.peliculaId)
      if (!pelicula) {
        setError("Película no encontrada")
        return
      }

      await createBooking({
        name: data.clienteNombre,
        lastName: data.clienteApellido,
        documentNumber: data.clienteDocumento,
        phone: data.clienteTelefono,
        email: data.clienteEmail,
        age: Number.parseInt(data.clienteEdad),
        seats: data.butacas,
        billboardId: data.peliculaId,
        dateBooking: new Date().toISOString().split("T")[0],
      })
      setSuccess("Reserva creada correctamente")
      form.reset() // Limpiar formulario después de crear

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError("Error al guardar la reserva. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Agrupar butacas por fila para mejor visualización
  const butacasPorFila = butacasDisponibles.reduce(
    (acc, butaca) => {
      if (!acc[butaca.fila]) {
        acc[butaca.fila] = []
      }
      acc[butaca.fila].push(butaca)
      return acc
    },
    {} as Record<string, typeof butacasDisponibles>,
  )

  // Ordenar los asientos dentro de cada fila por número
  Object.keys(butacasPorFila).forEach(row => {
    butacasPorFila[row].sort((a, b) => a.numero - b.numero)
  })


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{reservationId ? "Editar Reserva" : "Crear Nueva Reserva"}</CardTitle>
        <CardDescription>
          {reservationId
            ? "Actualice los detalles de la reserva"
            : "Complete el formulario para realizar una nueva reserva"}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clienteNombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteApellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido del cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de documento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el número de documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteTelefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono del cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email del cliente</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteEdad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad del cliente</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ingrese la edad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="peliculaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Película</FormLabel>
                  <Select onValueChange={(value) => handlePeliculaChange(value)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una película" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {peliculas.map((pelicula) => (
                        <SelectItem key={pelicula.id} value={pelicula.id}>
                          {pelicula.titulo} - {pelicula.sala.nombreSala}
                          {pelicula.sala.numeroSala} - {pelicula.horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Seleccione la película para la cual desea realizar la reserva
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            {selectedPelicula && (
              <FormField
                control={form.control}
                name="butacas"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Seleccione butacas</FormLabel>
                      <FormDescription>Seleccione las butacas que desea reservar</FormDescription>
                    </div>

                    {Object.entries(butacasPorFila).length === 0 ? (
                      <div className="text-center p-4 border rounded-md">
                        No hay butacas disponibles para esta película
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(butacasPorFila).map(([fila, butacas]) => (
                          <div key={fila} className="space-y-2">
                            <h3 className="text-sm font-medium">Fila {fila}</h3>
                            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                              {butacas.map((butaca) => (
                                <FormField
                                  key={butaca.id}
                                  control={form.control}
                                  name="butacas"
                                  render={({ field }) => {
                                    return (
                                      <FormItem key={butaca.id} className="flex flex-col items-center space-y-1">
                                        <FormControl>
                                          <div className="text-center">
                                            <Checkbox
                                              checked={field.value?.includes(butaca.id)}
                                              onCheckedChange={(checked) => {
                                                const updatedValue = checked
                                                  ? [...field.value, butaca.id]
                                                  : field.value?.filter((value) => value !== butaca.id)
                                                field.onChange(updatedValue)
                                              }}
                                            />
                                            <div className="text-xs mt-1">

                                              {butaca.numero}
                                            </div>
                                          </div>
                                        </FormControl>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                    Guardando...
                  </span>
                ) : reservationId ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card >
  )
}
