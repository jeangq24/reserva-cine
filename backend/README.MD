# API Documentation

documentation
---

## 🎬 Billboards

### Create a Billboard
- **Method**: `POST`
- **Endpoint**: `/billboards`
- **Validation**: Requires `CreateBillboardDto`
- **Description**:  
  - Creates a new billboard **and a movie entity**.
  - Synchronizes with an existing room (validates `roomId`).
  - **Transactional**: Rolls back if movie or billboard creation fails.
- **Errors**:
  - `404 Not Found`: If room or movie is not found.
  - `409 Conflict`: If billboard is already canceled.

### Get All Billboards
- **Method**: `GET`
- **Endpoint**: `/billboards`
- **Response**: Includes billboards with nested movie and room data.
- **Description**: Retrieves all active billboards with relationships.

### Delete a Billboard
- **Method**: `DELETE`
- **Endpoint**: `/billboards`
- **Validation**: Requires `DeleteBillboardDto`
- **Description**:  
  - Deletes a billboard **and its associated movie**.
  - **Transactional**: Ensures both entities are deleted atomically.

### Cancel a Billboard
- **Method**: `POST`
- **Endpoint**: `/billboards/cancel`
- **Validation**: Requires `CancelBillboardDto`
- **Description**:  
  - Cancels a billboard and **re-enables all associated seats**.
  - Automatically cancels linked bookings and notifies affected customers (logs to console).
  - **Transactional**: Rolls back seat/booking updates on failure.

### Filter Billboards
- **Method**: `POST`
- **Endpoint**: `/billboards/filter`
- **Validation**: Requires `FilterBillboardDto`
- **Description**: Filters billboards by date range and movie category.

---

## 🎟️ Bookings

### Create a Booking
- **Method**: `POST`
- **Endpoint**: `/bookings`
- **Validation**: Requires `CreateBookingDto`
- **Description**:  
  - Creates a booking and **marks selected seats as occupied**.
  - Generates a customer record from request data.
  - **Transactional**: Rolls back if seat updates or customer creation fails.
- **Errors**:
  - `404 Not Found`: If billboard or seat does not exist.
  - `409 Conflict`: If no seats are available for booking.

### Get All Bookings
- **Method**: `GET`
- **Endpoint**: `/bookings`
- **Response**: Includes bookings with customer, billboard, and seat details.

### Cancel a Booking
- **Method**: `POST`
- **Endpoint**: `/bookings/cancel`
- **Validation**: Requires `CancelBookingDto`
- **Description**:  
  - Cancels a booking and **re-enables its associated seats**.
  - **Transactional**: Atomic seat status update.

---

## 🎪 Rooms

### Create a Room
- **Method**: `POST`
- **Endpoint**: `/rooms`
- **Validation**: Requires `CreateRoomDto`
- **Description**:  
  - Creates a room **and generates seats automatically** based on `numberRows` and `numberSeatRows`.
  - **Transactional**: Rolls back if seat generation fails.
  - Example Request Body:
    ```json
    {
      "nameRoom": "Sala VIP",
      "numberRoom": 5,
      "numberRows": 10,
      "numberSeatRows": 20
    }
    ```

### Update Seat Status
- **Method**: `PUT`
- **Endpoint**: `/rooms/seat/:id`
- **Parameters**: `id` (Seat ID)
- **Description**: Toggles a seat's status (enabled/disabled).  
- **Errors**:
  - `404 Not Found`: If seat or linked room does not exist.

### Check Seat Availability
- **Method**: `GET`
- **Endpoint**: `/rooms/availability/:id`
- **Parameters**: `id` (Room ID)
- **Response**: 
  ```json
  {
    "total": 200,
    "enabled": 150,
    "disabled": 50
  }