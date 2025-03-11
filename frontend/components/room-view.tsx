"use client"

import { useState, useEffect, ReactNode } from "react"
import { useReservation } from "@/context/reservation-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RoomView() {
  interface Room {
    numberRoom: ReactNode
    nameRoom: ReactNode
    id: string
    name: string
    capacity: number
  }

  interface Seat {
    id: string
    row: string
    number: number
    available: boolean
  }

  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getRooms, getSeatsByRoomId } = useReservation()

  // Cargar salas
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true)
        const roomsData = await getRooms()
        setRooms(roomsData.data)

        if (roomsData.data.length > 0 && !selectedRoom) {
          setSelectedRoom(roomsData.data[0].id)
        }

        setError(null)
      } catch (err) {
        setError("Error al cargar salas. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRooms()
  }, [])

  // Cargar datos de la sala seleccionada
  useEffect(() => {
    if (!selectedRoom) return

    const loadRoomData = async () => {
      try {
        setLoading(true)

        // Cargar asientos de la sala
        const seatsData = await getSeatsByRoomId(selectedRoom)
        setSeats(seatsData.data.map((seat: any) => ({
          id: seat.id.value,
          row: seat.numberSeatRow.value,
          number: seat.numberSeat.value,
          available: seat.status.value
        })))

        setError(null)
      } catch (err) {
        setError((err as any)?.message || (err as any)?.code || "Error al cargar datos de la sala. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRoomData()
  }, [selectedRoom])

  // Agrupar asientos por filas para mejor visualización
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = []
      }
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  // Ordenar los asientos dentro de cada fila por número
  Object.keys(seatsByRow).forEach(row => {
    seatsByRow[row].sort((a, b) => a.number - b.number)
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visualización de Salas</CardTitle>
        <CardDescription>Seleccione una sala para ver su distribución</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mb-6 w-full">
          <Select value={selectedRoom || ""} onValueChange={(value) => setSelectedRoom(value)} disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una sala" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.nameRoom}-{room.numberRoom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : selectedRoom ? (
          <Tabs defaultValue="seats">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="seats">Distribución de asientos</TabsTrigger>
            </TabsList>

            <TabsContent value="seats" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Distribución de asientos</h3>

                {Object.keys(seatsByRow).length === 0 ? (
                  <div className="text-center p-4 border rounded-md">No hay asientos configurados para esta sala</div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(seatsByRow).map(([row, seatsRow]) => (
                      <div key={row} className="space-y-2">
                        <h4 className="text-sm font-medium">Fila {row}</h4>
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                          {seatsRow.map((seat) => (
                            <div key={seat.id} className="text-center">
                              <div
                                className={`p-2 rounded-md ${seat.available ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                                  }`}
                              >
                                {seat.number}
                              </div>
                              <div className="text-xs mt-1">{seat.available ? "Disponible" : "Ocupada"}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center p-8">Seleccione una sala para ver su información</div>
        )}
      </CardContent>
    </Card>
  )
}
