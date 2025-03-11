import type React from "react"
import { ReservationProvider } from "@/context/reservation-context"
import { ThemeProvider } from "@/components/theme-provider"
import MainNav from "@/components/main-nav"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Sistema de Reserva - Cine</title>
        <meta name="description" content="Sistema para la gestión de reservas" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReservationProvider>
            <div className="min-h-screen flex flex-col">
              <MainNav />
              <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
            </div>
          </ReservationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}