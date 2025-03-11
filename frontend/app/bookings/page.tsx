import ReservationList from "@/components/reservation-list"
import ManageReservationForm from "@/components/manage-reservation-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Gestión de Reservas</h1>

      <Tabs defaultValue="list" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full inline-flex whitespace-nowrap">
            <TabsTrigger value="list">Lista de Reservas</TabsTrigger>
            <TabsTrigger value="new">Nueva Reserva</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="list" className="mt-6">
          <ReservationList />
        </TabsContent>
        <TabsContent value="new" className="mt-6">
          <ManageReservationForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

