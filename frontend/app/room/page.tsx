import AdminButaca from "@/components/admin-butaca"
import ManageSala from "@/components/manage-sala"
import RoomView from "@/components/room-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RoomPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Gestión de Salas</h1>

      <Tabs defaultValue="view" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full inline-flex whitespace-nowrap">
            <TabsTrigger value="view">Visualizar Salas</TabsTrigger>
            <TabsTrigger value="manage">Administrar Salas</TabsTrigger>
            <TabsTrigger value="seats">Administrar Butacas</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="view" className="mt-6">
          <RoomView />
        </TabsContent>
        <TabsContent value="manage" className="mt-6">
          <ManageSala />
        </TabsContent>
        <TabsContent value="seats" className="mt-6">
          <AdminButaca />
        </TabsContent>
      </Tabs>
    </div>
  )
}

