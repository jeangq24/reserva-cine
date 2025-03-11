import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Sistema de Reserva - Cine</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/room" className="block">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Salas</CardTitle>
              <CardDescription>Administre las salas y asientos</CardDescription>
            </CardHeader>
            <CardContent>Visualice, cree y elimine salas. Gestione la distribución de los asientos.</CardContent>
          </Card>
        </Link>

        <Link href="/billboards" className="block">
          <Card>
            <CardHeader>
              <CardTitle>Cartelera</CardTitle>
              <CardDescription>Administre las películas en cartelera</CardDescription>
            </CardHeader>
            <CardContent>Añada nuevas películas, actualice información y gestione horarios.</CardContent>
          </Card>
        </Link>

        <Link href="/bookings" className="block">
          <Card>
            <CardHeader>
              <CardTitle>Reservas</CardTitle>
              <CardDescription>Gestione las reservas de los clientes</CardDescription>
            </CardHeader>
            <CardContent>Cree nuevas reservas, visualice y cancele reservas existentes.</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

