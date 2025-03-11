### 5. Iniciar el servidor en modo desarrollo
```sh
$ npm run dev
```

El servidor se iniciará en `http://localhost:3000` o el puerto especificado en `.env`.

## 📌 Endpoints disponibles

### **Billboard**
- **GET /billboards**: Obtener todas las carteleras.
    - **Respuesta**:
        ```json
        [
            {
                "id": "uuid",
                "status": true,
                "dateBillboard": "2023-10-01",
                "starTimeBillboard": "18:00",
                "endTimeBillboard": "20:00",
                "roomId": "uuid",
                "movieId": "uuid"
            }
        ]
        ```
- **POST /billboards**: Crear una nueva cartelera.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "dateBillboard": "2023-10-01",
            "starTimeBillboard": "18:00",
            "endTimeBillboard": "20:00",
            "roomId": "uuid",
            "movieId": "uuid"
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Cartelera creada correctamente.",
            "data": {
                "id": "uuid",
                "status": true,
                "dateBillboard": "2023-10-01",
                "starTimeBillboard": "18:00",
                "endTimeBillboard": "20:00",
                "roomId": "uuid",
                "movieId": "uuid"
            }
        }
        ```
- **GET /billboards/:id**: Obtener una cartelera por ID.
    - **Respuesta**:
        ```json
        {
            "id": "uuid",
            "status": true,
            "dateBillboard": "2023-10-01",
            "starTimeBillboard": "18:00",
            "endTimeBillboard": "20:00",
            "roomId": "uuid",
            "movieId": "uuid"
        }
        ```
- **PUT /billboards/:id**: Actualizar una cartelera por ID.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "dateBillboard": "2023-10-02",
            "starTimeBillboard": "19:00",
            "endTimeBillboard": "21:00",
            "roomId": "uuid",
            "movieId": "uuid"
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Cartelera actualizada correctamente.",
            "data": {
                "id": "uuid",
                "status": true,
                "dateBillboard": "2023-10-02",
                "starTimeBillboard": "19:00",
                "endTimeBillboard": "21:00",
                "roomId": "uuid",
                "movieId": "uuid"
            }
        }
        ```
- **DELETE /billboards/:id**: Eliminar una cartelera por ID.
    - **Respuesta**:
        ```json
        {
            "message": "Cartelera eliminada correctamente.",
            "data": null
        }
        ```

### **Booking**
- **GET /bookings**: Obtener todas las reservaciones.
    - **Respuesta**:
        ```json
        [
            {
                "id": "uuid",
                "status": true,
                "dateBooking": "2023-10-01",
                "customer": {
                    "id": "uuid",
                    "name": "John",
                    "lastName": "Doe"
                },
                "seats": [
                    {
                        "id": "uuid",
                        "numberSeat": 1,
                        "numberSeatRow": 1
                    }
                ],
                "billboard": {
                    "id": "uuid",
                    "dateBillboard": "2023-10-01"
                }
            }
        ]
        ```
- **POST /bookings**: Crear una nueva reservación.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "dateBooking": "2023-10-01",
            "customerId": "uuid",
            "seats": ["uuid"],
            "billboardId": "uuid"
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Reservación creada correctamente.",
            "data": {
                "id": "uuid",
                "status": true,
                "dateBooking": "2023-10-01",
                "customer": {
                    "id": "uuid",
                    "name": "John",
                    "lastName": "Doe"
                },
                "seats": [
                    {
                        "id": "uuid",
                        "numberSeat": 1,
                        "numberSeatRow": 1
                    }
                ],
                "billboard": {
                    "id": "uuid",
                    "dateBillboard": "2023-10-01"
                }
            }
        }
        ```
- **GET /bookings/:id**: Obtener una reservación por ID.
    - **Respuesta**:
        ```json
        {
            "id": "uuid",
            "status": true,
            "dateBooking": "2023-10-01",
            "customer": {
                "id": "uuid",
                "name": "John",
                "lastName": "Doe"
            },
            "seats": [
                {
                    "id": "uuid",
                    "numberSeat": 1,
                    "numberSeatRow": 1
                }
            ],
            "billboard": {
                "id": "uuid",
                "dateBillboard": "2023-10-01"
            }
        }
        ```
- **PUT /bookings/:id**: Actualizar una reservación por ID.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "dateBooking": "2023-10-02",
            "customerId": "uuid",
            "seats": ["uuid"],
            "billboardId": "uuid"
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Reservación actualizada correctamente.",
            "data": {
                "id": "uuid",
                "status": true,
                "dateBooking": "2023-10-02",
                "customer": {
                    "id": "uuid",
                    "name": "John",
                    "lastName": "Doe"
                },
                "seats": [
                    {
                        "id": "uuid",
                        "numberSeat": 1,
                        "numberSeatRow": 1
                    }
                ],
                "billboard": {
                    "id": "uuid",
                    "dateBillboard": "2023-10-02"
                }
            }
        }
        ```
- **DELETE /bookings/:id**: Eliminar una reservación por ID.
    - **Respuesta**:
        ```json
        {
            "message": "Reservación eliminada correctamente.",
            "data": null
        }
        ```

### **Room**
- **GET /rooms**: Obtener todas las salas.
    - **Respuesta**:
        ```json
        [
            {
                "id": "uuid",
                "status": true,
                "nameRoom": "Sala 1",
                "numberRoom": 1
            }
        ]
        ```
- **POST /rooms**: Crear una nueva sala.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "nameRoom": "Sala 1",
            "numberRoom": 1,
            "numberRows": 10,
            "numberSeatRows": 10
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Sala creada correctamente.",
            "data": {
                "id": "uuid",
                "status": true,
                "nameRoom": "Sala 1",
                "numberRoom": 1
            }
        }
        ```
- **GET /rooms/:id**: Obtener una sala por ID.
    - **Respuesta**:
        ```json
        {
            "id": "uuid",
            "status": true,
            "nameRoom": "Sala 1",
            "numberRoom": 1
        }
        ```
- **PUT /rooms/:id**: Actualizar una sala por ID.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "nameRoom": "Sala 2",
            "numberRoom": 2,
            "status": true
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Sala actualizada correctamente.",
            "data": {
                "id": "uuid",
                "status": true,
                "nameRoom": "Sala 2",
                "numberRoom": 2
            }
        }
        ```
- **DELETE /rooms/:id**: Eliminar una sala por ID.
    - **Respuesta**:
        ```json
        {
            "message": "Sala eliminada correctamente.",
            "data": null
        }
        ```

### **Seat**
- **GET /seats**: Obtener todos los asientos.
    - **Respuesta**:
        ```json
        [
            {
                "id": "uuid",
                "status": true,
                "numberSeat": 1,
                "numberSeatRow": 1,
                "roomId": "uuid"
            }
        ]
        ```
- **POST /seats**: Crear un nuevo asiento.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "numberSeat": 1,
            "numberSeatRow": 1,
            "roomId": "uuid"
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Asiento creado correctamente.",
            "data": {
                "id": "uuid",
                "status": true,
                "numberSeat": 1,
                "numberSeatRow": 1,
                "roomId": "uuid"
            }
        }
        ```
- **GET /seats/:id**: Obtener un asiento por ID.
    - **Respuesta**:
        ```json
        {
            "id": "uuid",
            "status": true,
            "numberSeat": 1,
            "numberSeatRow": 1,
            "roomId": "uuid"
        }
        ```
- **PUT /seats/:id**: Actualizar un asiento por ID.
    - **Cuerpo de la solicitud**:
        ```json
        {
            "numberSeat": 2,
            "numberSeatRow": 2,
            "status": false
        }
        ```
    - **Respuesta**:
        ```json
        {
            "message": "Asiento actualizado correctamente.",
            "data": {
                "id": "uuid",
                "status": false,
                "numberSeat": 2,
                "numberSeatRow": 2,
                "roomId": "uuid"
            }
        }
        ```
- **DELETE /seats/:id**: Eliminar un asiento por ID.
    - **Respuesta**:
        ```json
        {
            "message": "Asiento eliminado correctamente.",
            "data": null
        }
        ```
