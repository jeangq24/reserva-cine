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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

// Esquema de validación para el formulario
const carteleraFormSchema = z.object({
  nameMovie: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }),
  genreMovie: z.string().min(1, { message: "Seleccione un género" }),
  allowedAgeMovie: z.string().regex(/^\d+$/, { message: "La edad permitida debe ser un número" }),
  lengthMinutesMovie: z.string().regex(/^\d+$/, { message: "La duración debe ser un número en minutos" }),
  roomId: z.string().min(1, { message: "Seleccione una sala" }),
  dateBillboard: z.string().min(1, { message: "Seleccione una fecha" }),
  starTimeBillboard: z.string().min(1, { message: "Ingrese un horario de inicio válido" }),
  endTimeBillboard: z.string().min(1, { message: "Ingrese un horario de fin válido" }),
})

type CarteleraFormValues = z.infer<typeof carteleraFormSchema>

interface ManageCarteleraFormProps {
  carteleraId?: string // Si se proporciona, estamos editando una cartelera existente
  onSuccess?: () => void
}

export default function ManageCarteleraForm({ carteleraId, onSuccess }: ManageCarteleraFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { createBillboard, getBillboardById, getRooms } = useReservation()
  const [salas, setSalas] = useState<any>([])

  // Inicializar el formulario con React Hook Form
  const form = useForm<CarteleraFormValues>({
    resolver: zodResolver(carteleraFormSchema),
    defaultValues: {
      nameMovie: "",
      genreMovie: "",
      allowedAgeMovie: "",
      lengthMinutesMovie: "",
      roomId: "",
      dateBillboard: new Date().toISOString().split("T")[0],
      starTimeBillboard: "",
      endTimeBillboard: "",
    },
  })

  // Cargar datos de salas y de la cartelera si estamos editando
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar salas
        const salasData = await getRooms()
        setSalas(salasData.data)
        console.log(salasData)
        // Si estamos editando, cargar datos de la cartelera
        if (carteleraId) {
          const cartelera = await getBillboardById(carteleraId)
          if (cartelera) {
            form.reset({
              nameMovie: cartelera.data.nameMovie,
              genreMovie: cartelera.data.genreMovie,
              allowedAgeMovie: cartelera.data.allowedAgeMovie.toString(),
              lengthMinutesMovie: cartelera.data.lengthMinutesMovie.toString(),
              roomId: cartelera.data.roomId,
              dateBillboard: cartelera.data.dateBillboard,
              starTimeBillboard: cartelera.data.starTimeBillboard,
              endTimeBillboard: cartelera.data.endTimeBillboard,
            })
          }
        }
      } catch (err) {
        setError("Error al cargar datos. Intente nuevamente.")
        console.error(err)
      }
    }

    loadData()
  }, [carteleraId])

  // Manejar el envío del formulario
  const onSubmit = async (data: CarteleraFormValues) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const billboardData = {
        nameMovie: data.nameMovie,
        genreMovie: data.genreMovie,
        allowedAgeMovie: Number.parseInt(data.allowedAgeMovie),
        lengthMinutesMovie: Number.parseInt(data.lengthMinutesMovie),
        roomId: data.roomId,
        dateBillboard: data.dateBillboard,
        starTimeBillboard: data.starTimeBillboard,
        endTimeBillboard: data.endTimeBillboard,
      }

      await createBillboard(billboardData)
      setSuccess("Cartelera creada correctamente")
      form.reset() // Limpiar formulario después de crear

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError("Error al guardar la cartelera. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{carteleraId ? "Editar Cartelera" : "Crear Nueva Cartelera"}</CardTitle>
        <CardDescription>
          {carteleraId
            ? "Actualice los detalles de la película en cartelera"
            : "Complete el formulario para agregar una nueva película a la cartelera"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nameMovie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la película</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el título" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genreMovie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTION">Acción</SelectItem>
                        <SelectItem value="ADVENTURE">Aventura</SelectItem>
                        <SelectItem value="COMEDY">Comedia</SelectItem>
                        <SelectItem value="DRAMA">Drama</SelectItem>
                        <SelectItem value="FANTASY">Fantasía</SelectItem>
                        <SelectItem value="HORROR">Terror</SelectItem>
                        <SelectItem value="MUSICALS">Musicales</SelectItem>
                        <SelectItem value="MYSTERY">Misterio</SelectItem>
                        <SelectItem value="ROMANCE">Romance</SelectItem>
                        <SelectItem value="SCIENCE FICTION">Ciencia Ficción</SelectItem>
                        <SelectItem value="SPORTS">Deportes</SelectItem>
                        <SelectItem value="THRILLER">Suspenso</SelectItem>
                        <SelectItem value="WESTERN">Western</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="allowedAgeMovie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad permitida</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="13" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lengthMinutesMovie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <>
                      <FormLabel>Sala</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una sala" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {salas.map((sala: any) => (
                            <SelectItem key={sala.id} value={sala.id}>
                              {sala.nameRoom}{sala.numberRoom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateBillboard"
                render={({ field }) => (
                  <FormItem>
                    <>
                      <FormLabel>Fecha de proyección</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="starTimeBillboard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horario de inicio</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTimeBillboard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horario de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2"></div>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                  Guardando...
                </span>
              ) : carteleraId ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
