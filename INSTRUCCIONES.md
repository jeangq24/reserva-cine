# Reserva de Butacas de Cine

## Introducción
Gracias por iniciar el proceso de selección. Para continuar con el flujo, por favor realiza la siguiente prueba. Cuando la tengas lista, envía el enlace de tu repositorio en GitHub.

## Backend

### Mapeo de Entidades
Convierte el siguiente modelo de .NET al ORM que uses:

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace
{
    public class BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
       
        [Required]
        public bool Status { get; set; } = true;
    }

    public class BillboardEntity : BaseEntity
    {
        [Required]
        public DateTime Date { get; set; }
       
        [Required]
        public TimeSpan StartTime { get; set; }
       
        [Required]
        public TimeSpan EndTime { get; set; }

        [ForeignKey("Movie")]
        public int MovieId { get; set; }
        public MovieEntity Movie { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public RoomEntity Room { get; set; }
    }

    public class BookingEntity : BaseEntity
    {
        [Required]
        public DateTime Date { get; set; }

        [ForeignKey("Customer")]
        public int CustomerId { get; set; }
        public CustomerEntity Customer { get; set; }

        [ForeignKey("Seat")]
        public int SeatId { get; set; }
        public SeatEntity Seat { get; set; }

        [ForeignKey("Billboard")]
        public int BillboardId { get; set; }
        public BillboardEntity Billboard { get; set; }
    }

    public class CustomerEntity : BaseEntity
    {
        [Required]
        [MaxLength(20)]
        [Index(IsUnique = true)]
        public string DocumentNumber { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        [Required]
        [MaxLength(30)]
        public string Lastname { get; set; }

        [Required]
        public short Age { get; set; }

        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [MaxLength(100)]
        public string Email { get; set; }
    }

    public enum MovieGenreEnum { ACTION, ADVENTURE, COMEDY, DRAMA, FANTASY, HORROR, MUSICALS, MYSTERY, ROMANCE, SCIENCE_FICTION, SPORTS, THRILLER, WESTERN }

    public class MovieEntity : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public MovieGenreEnum Genre { get; set; }

        [Required]
        public short AllowedAge { get; set; }

        [Required]
        public short LengthMinutes { get; set; }
    }

    public class RoomEntity : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        public short Number { get; set; }
    }

    public class SeatEntity : BaseEntity
    {
        [Required]
        public short Number { get; set; }

        [Required]
        public short RowNumber { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public RoomEntity Room { get; set; }
    }
}
```

### Consultas SQL
1. Obtener las reservas de películas cuyo género sea terror y en un rango de fechas.
2. Obtener el número de butacas disponibles y ocupadas por sala en la cartelera del día actual.

### Servicios (Arquitectura Hexagonal y DTOs)
1. Inhabilitar una butaca y cancelar la reserva con transaccionalidad.
2. Cancelar una cartelera y todas sus reservas, habilitando las butacas e imprimiendo por consola los clientes afectados.
3. Si se intenta cancelar una cartelera cuya función es anterior a la fecha actual, lanzar una excepción con el mensaje: `No se puede cancelar funciones de la cartelera con fecha anterior a la actual`.

### Controladores
1. Administrar butacas.
2. Administrar cartelera.
   - Endpoint para inhabilitar una butaca y cancelar una reserva.
   - Endpoint para cancelar cartelera, cancelar reservas y habilitar butacas.
3. Manejo de excepciones con `CustomException` e `IExceptionHandler`.
4. Endpoint para obtener reservas de películas de terror en un rango de fechas.
5. Endpoint para obtener número de butacas disponibles y ocupadas por sala en la cartelera del día actual.

### Pruebas
- **Unitarias**: Validar la inhabilitación de butacas y cancelación de reservas.
- **Integración**:
  1. Consulta de reservas de películas de terror en un rango de fechas.
  2. Consulta de butacas disponibles y ocupadas por sala.
  3. Endpoint de cancelación de cartelera y reservas.

## Frontend

### Componentes
- **AdminButaca.tsx**: Administración de butacas.
- **AdminCartelera.tsx**: Administración de la cartelera.
- **ReservationList.tsx**: Lista de reservas.

### Contexto
- **ReservationContext.tsx**: Estado y manejo de reservas.

### Servicios
- **reservationService.ts**: Interacción con los endpoints del backend.

### Notas
- Utiliza **React Router** para la navegación.
- Maneja formularios con **React Hook Forms**.
- Usa **Tailwind CSS** para estilizado.
- Implementa `useContext` para compartir el estado de reservas.
- Maneja errores en las solicitudes HTTP.

---

