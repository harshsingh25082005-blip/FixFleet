# FixFleet — Use Case Specifications

## UC-01: Book Service

**Primary Actor:** Customer

**Stakeholders:**

* **Customer:** Wants to book a reliable service provider at a suitable time and receive confirmation of the booking.
* **Service Provider:** Wants to receive genuine service requests and be able to accept or reject them based on availability.
* **Payment Gateway:** Processes the customer's payment securely.
* **FixFleet System:** Maintains the booking details and communicates the booking status to the involved users.

**Preconditions:**

1. The customer is registered/logged in to the FixFleet system.
2. The customer has searched for and selected a service provider.
3. The selected service provider has available service slots.
4. The customer has provided the required service and booking details.

**Postconditions:**

1. A booking request is created in the FixFleet system.
2. The selected time slot is associated with the booking.
3. The payment is processed successfully, if payment is required at booking time.
4. The booking status is updated and made available to the customer and service provider.

**Trigger:**

The customer selects a service provider and chooses the option to book a service.

### Main Flow

1. The customer selects a service provider from the available providers.
2. The system displays the provider's available service details and time slots.
3. The customer chooses a suitable service time.
4. The system records the selected time slot.
5. The customer confirms the service booking.
6. The system creates a booking request.
7. The system requests payment from the customer.
8. The customer completes the payment through the Payment Gateway.
9. The Payment Gateway confirms the successful payment to the FixFleet System.
10. The system updates the booking with the payment status.
11. The system sends the booking details/status to the customer.
12. The booking request becomes available to the selected service provider for acceptance or rejection.

### Alternate Flows

**A1. Selected time slot is no longer available**

1. During time-slot selection or booking confirmation, the system detects that the selected slot has already been booked.
2. The system informs the customer that the slot is unavailable.
3. The system displays other available time slots.
4. The customer selects another slot.
5. The use case resumes from Step 4 of the main flow.

**A2. Payment fails**

1. The Payment Gateway reports that the payment was unsuccessful.
2. The system informs the customer that the payment could not be completed.
3. The booking remains unpaid/pending and is not confirmed as a completed booking.
4. The customer may retry the payment.
5. If the payment succeeds, the use case resumes from Step 9 of the main flow.

**A3. Customer cancels before payment**

1. The customer decides not to continue with the booking before completing payment.
2. The system stops the booking process.
3. No confirmed booking is created.
4. The customer may return to the provider search or select another provider.

---

## UC-02: Cancel Booking

**Primary Actor:** Customer

**Stakeholders:**

* **Customer:** Wants to cancel a booking when the service is no longer required or circumstances have changed.
* **Service Provider:** Needs to be informed so that the reserved time slot can be made available again.
* **Payment Gateway:** May be involved if a payment needs to be refunded.
* **FixFleet System:** Must maintain accurate booking and cancellation records.

**Preconditions:**

1. The customer is registered/logged in.
2. The customer has an existing booking.
3. The booking has not already been completed.
4. The cancellation is requested before the service provider starts the work.

**Postconditions:**

1. The booking is marked as cancelled.
2. The service provider is informed about the cancellation.
3. The reserved time slot may become available for other customers.
4. If applicable, the payment/refund status is updated.

**Trigger:**

The customer chooses to cancel an existing booking.

### Main Flow

1. The customer opens their existing bookings.
2. The system displays the customer's active bookings.
3. The customer selects the booking they want to cancel.
4. The system displays the booking details and cancellation option.
5. The customer selects **Cancel Booking**.
6. The system checks whether the booking can still be cancelled.
7. The system asks the customer to confirm the cancellation.
8. The customer confirms the cancellation.
9. The system changes the booking status to **Cancelled**.
10. The system informs the service provider about the cancellation.
11. The system updates the availability of the selected time slot.
12. If a refund is applicable, the system initiates the refund/payment process.

### Alternate Flows

**A1. Cancellation is requested after the provider has started work**

1. The system checks the booking status.
2. The system determines that the service provider has already started the work.
3. The system does not allow cancellation through the normal cancellation process.
4. The system informs the customer that the booking cannot be cancelled at this stage.
5. The booking remains active.

**A2. Customer does not confirm cancellation**

1. The system displays a cancellation confirmation request.
2. The customer chooses not to confirm the cancellation.
3. The system closes the cancellation request.
4. The booking remains active.

**A3. Refund cannot be processed immediately**

1. The system marks the booking as cancelled.
2. The system sends the refund request to the Payment Gateway.
3. The Payment Gateway reports that the refund cannot be completed immediately.
4. The system records the refund as pending.
5. The customer is informed that the refund is being processed.

---

## UC-03: Accept / Reject Service Request

**Primary Actor:** Service Provider

**Stakeholders:**

* **Service Provider:** Wants to accept suitable jobs and reject requests that cannot be fulfilled.
* **Customer:** Wants to know whether the selected provider has accepted the service request.
* **FixFleet System:** Must maintain the correct booking status and notify both parties.

**Preconditions:**

1. The service provider is registered/logged in.
2. The service provider has a valid profile on FixFleet.
3. A customer has created a booking request for the service provider.
4. The booking request is still pending.
5. The service provider has access to the request details.

**Postconditions:**

1. The request is marked as either **Accepted** or **Rejected**.
2. The customer can see the updated booking status.
3. The service provider's job/request list is updated.
4. If accepted, the booking proceeds toward the scheduled service.

**Trigger:**

A new customer booking request is received by the service provider.

### Main Flow

1. The FixFleet System receives a booking request for the service provider.
2. The system makes the request available to the service provider.
3. The service provider opens the request.
4. The system displays the customer, service, location, scheduled time, and other relevant booking details.
5. The service provider reviews the request.
6. The service provider chooses **Accept Request**.
7. The system changes the booking status to **Accepted**.
8. The system records the service provider's acceptance.
9. The system informs the customer that the request has been accepted.
10. The accepted job is added to the service provider's active jobs.
11. The service provider can later update the job status as the work progresses.

### Alternate Flows

**A1. Service provider rejects the request**

1. The service provider reviews the booking request.
2. The service provider chooses **Reject Request**.
3. The system asks the service provider to confirm the rejection.
4. The service provider confirms the rejection.
5. The system changes the booking status to **Rejected**.
6. The system informs the customer that the provider has rejected the request.
7. The request is removed from the provider's pending requests.

**A2. Service provider is unavailable**

1. The service provider checks the requested service time.
2. The provider determines that they are unavailable at that time.
3. The provider rejects the request.
4. The system records the rejection and updates the booking status.
5. The customer is informed that the request was rejected due to provider unavailability.

**A3. Booking request is cancelled before the provider responds**

1. The service provider opens the pending request.
2. The system checks the current booking status.
3. The system finds that the customer has already cancelled the booking.
4. The system informs the service provider that the request is no longer active.
5. The system does not allow the provider to accept or reject the cancelled request.
