"use client"

import { useState, useEffect, ReactNode } from "react";
import { useReservation } from "@/context/reservation-context";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Seat {
  id: string;
  number: number;
  row: string;
  available: boolean;
  bookingId?: string;
  roomId: string;
}

interface Room {
  numberRoom: ReactNode;
  nameRoom: ReactNode;
  id: string;
  name: string;
  capacity: number;
  rows: number;
  columns: number;
}

export default function AdminSeat() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateStatusSeat, getSeats, getRooms, getSeatsByRoomId } = useReservation();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data.data);
        if (data.data.length > 0 && !selectedRoom) {
          setSelectedRoom(data.data[0].id);
        }
      } catch (err) {
        setError("Error al cargar las salas. Intenta de nuevo.");
        console.error(err);
      }
    };
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadSeatsByRoom(selectedRoom);
    } else {
      loadAllSeats();
    }
  }, [selectedRoom]);

  const loadAllSeats = async () => {
    try {
      setLoading(true);
      const data = await getSeats();
      setSeats(
        data.data.map((seat: any) => ({
          id: seat.id.value,
          row: seat.numberSeatRow.value,
          number: seat.numberSeat.value,
          available: seat.status.value,
        }))
      );
      setError(null);
    } catch (err) {
      setError("Error al cargar los asientos. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSeatsByRoom = async (roomId: string) => {
    try {
      setLoading(true);
      const data = await getSeatsByRoomId(roomId);
      setSeats(
        data.data.map((seat: any) => ({
          id: seat.id.value,
          row: seat.numberSeatRow.value,
          number: seat.numberSeat.value,
          available: seat.status.value,
        }))
      );
      setError(null);
    } catch (err) {
      setError("Error al cargar los asientos de la sala. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableSeat = async (seatId: string) => {
    try {
      await updateStatusSeat(seatId);
      selectedRoom ? loadSeatsByRoom(selectedRoom) : loadAllSeats();
    } catch (err) {
      setError("Error al actualizar el estado del asiento. Intenta de nuevo.");
      console.error(err);
    }
  };

  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  Object.keys(seatsByRow).forEach(row => {
    seatsByRow[row].sort((a, b) => a.number - b.number);
  });

  return (
    <Tabs defaultValue="seats" className="w-full">
      <TabsList className="grid w-full grid-cols-1 mb-4">
        <TabsTrigger value="seats">Administrar Asientos</TabsTrigger>
      </TabsList>
      <TabsContent value="seats">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Gestión de Asientos</CardTitle>
            <CardDescription>Administra los asientos disponibles en cada sala</CardDescription>
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
              <Select
                value={selectedRoom || ""}
                onValueChange={setSelectedRoom}
                disabled={loading || rooms.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una sala" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.nameRoom} - {room.numberRoom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : Object.keys(seatsByRow).length === 0 ? (
              <div className="text-center p-8">No hay asientos configurados en esta sala</div>
            ) : (
              Object.entries(seatsByRow).map(([row, seatsRow]) => (
                <div key={row} className="space-y-2">
                  <h3 className="text-lg font-medium">Fila {row}</h3>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {seatsRow.map(seat => (
                      <div key={seat.id} className="text-center">
                        <div className={`p-2 rounded-md ${seat.available ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}>{seat.number}</div>
                        <Button onClick={() => handleDisableSeat(seat.id)} className="mt-1 w-full text-xs">
                          {seat.available ? "Deshabilitar" : "Habilitar"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
