"use client"
import { createContext, useContext, type ReactNode } from "react"

interface ReservationContextType {
  // Métodos para cartelera
  getBillboards: () => Promise<{ message: string, data: any }>
  getBillboardByDateAndCategorie: (filter: any) => Promise<{ message: string, data: any }>
  createBillboard: (billboardData: any) => Promise<{ message: string, data: any }>
  cancelBillboard: (billboardId: string) => Promise<{ message: string, data: any }>
  deleteBillboard: (billboardId: string) => Promise<{ message: string, data: any }>
  getBillboardById: (billboardId: string) => Promise<{ message: string, data: any }>
  // Métodos para reservas
  getBookings: () => Promise<{ message: string, data: any }>
  createBooking: (bookingData: any) => Promise<{ message: string, data: any }>
  cancelBooking: (bookingId: string) => Promise<{ message: string, data: any }>

  // Métodos para salas
  getRooms: () => Promise<{ message: string, data: any }>
  getRoomsById: (roomId: string) => Promise<{ message: string, data: any }>
  getavailabilitySeat: (roomId: string) => Promise<{ message: string, data: any }>
  createRoom: (roomData: any) => Promise<{ message: string, data: any }>
  updateRoom: (roomData: any) => Promise<{ message: string, data: any }>
  deleteRoom: (roomId: string) => Promise<{ message: string, data: any }>
  updateStatusSeat: (seatId: string) => Promise<{ message: string, data: any }>
  getSeats: () => Promise<{ message: string, data: any }>
  getSeatById: (seatId: string) => Promise<{ message: string, data: any }>
  getSeatsByRoomId: (roomId: string) => Promise<{ message: string, data: any }>
  getAvailableSeatsByRoomId: (roomId: string) => Promise<{ message: string, data: any }>
}

// Crear el contexto
const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

// Proveedor del contexto
export function ReservationProvider({ children }: { children: ReactNode }) {
  const apiUrl = "http://localhost:3001"

  const fetchData = async (url: string, options: any = {}): Promise<any> => {
    try {
      const response = await fetch(url, options);    
      return await response.json()
    } catch (error) {
      console.error("Error en la petición:", error)
      throw error
    }
  }

  const getBillboards = async (): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/billboards`)
  }

  const getBillboardByDateAndCategorie = async (filter: any): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/billboards/filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filter)
    })
  }

  const createBillboard = async (billboardData: any): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/billboards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billboardData)
    })
  }

  const cancelBillboard = async (billboardId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/billboards/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: billboardId })
    })
  }

  const deleteBillboard = async (billboardId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/billboards`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: billboardId })
    })
  }
  
  const getBillboardById = async (bookingId:string): Promise<{ message: string, data: any }> => {
    const response = await fetchData(`${apiUrl}/billboards`)

    const data = response.data.filter((billboard:any)=>{return billboard.id===bookingId});
    const message = response.message
    return { message, data }
  }

  const getBookings = async (): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/bookings`)
  }

  const createBooking = async (bookingData: any): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    })
  }

  const cancelBooking = async (bookingId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/bookings/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId })
    })
  }


  const getRooms = async (): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/rooms`)
  }

  const getRoomsById = async (roomId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/rooms/${roomId}`)
  }

  const getavailabilitySeat = async (roomId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/rooms/availability/${roomId}`)
  }

  const createRoom = async (roomData: any): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData)
    })
  }

  const updateRoom = async (roomData: any): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/rooms`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData)
    })
  }

  const deleteRoom = async (roomId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/rooms`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: roomId })
    })
  }

  const updateStatusSeat = async (seatId: string): Promise<{ message: string, data: any }> => {
    // Implementa la lógica para actualizar el estado del asiento
    return fetchData(`${apiUrl}/rooms/seat/${seatId}`, {
      method: "PUT",
    })
  }

  const getSeats = async (): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/seats`)
  }

  const getSeatById = async (seatId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/seats/${seatId}`)
  }

  const getSeatsByRoomId = (roomId: string): Promise<{ message: string, data: any }> => {
    return fetchData(`${apiUrl}/seats/rooms/${roomId}`)
  }


  const getAvailableSeatsByRoomId = async (roomId: string): Promise<{ message: string, data: any }> => {
    const response = await fetchData(`${apiUrl}/seats/rooms/${roomId}`);
    const data = response.data.filter((seat:any)=>{return seat.status.value});
    const message = response.message
    return { message, data }
  }


  const value: ReservationContextType = {
    getBillboards,
    getBillboardByDateAndCategorie,
    createBillboard,
    cancelBillboard,
    deleteBillboard,
    getBookings,
    createBooking,
    cancelBooking,
    getBillboardById,
    getRooms,
    getRoomsById,
    getavailabilitySeat,
    createRoom,
    updateRoom,
    deleteRoom,
    updateStatusSeat,
    getSeats,
    getSeatById,
    getSeatsByRoomId,
    getAvailableSeatsByRoomId
  }

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
}

// Hook personalizado para usar el contexto
export function useReservation() {
  const context = useContext(ReservationContext)
  if (context === undefined) {
    throw new Error("useReservation debe ser usado dentro de un ReservationProvider")
  }
  return context
}
