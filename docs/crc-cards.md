# FixFleet — CRC Cards

CRC stands for **Class–Responsibility–Collaborator**.

The following CRC cards are based on the surviving classes identified during
noun–verb analysis of the three use cases:

- UC-01: Book Service
- UC-02: Cancel Booking
- UC-03: Accept / Reject Service Request

---

## 1. Customer

| Class | Customer |
|---|---|
| **Responsibilities** | Register/login to FixFleet; search for service providers; select a provider; choose a suitable time slot; create a booking; make payment; view booking status; cancel a booking; receive booking updates |
| **Collaborators** | Service Provider, Service, Booking, Time Slot, Payment, Refund, Location |

---

## 2. Service Provider

| Class | Service Provider |
|---|---|
| **Responsibilities** | Maintain provider profile; provide available services; maintain availability; receive booking requests; review booking requests; accept or reject requests; view active jobs; update job status; receive cancellation notifications |
| **Collaborators** | Customer, Service, Booking, Time Slot, Location |

---

## 3. Service

| Class | Service |
|---|---|
| **Responsibilities** | Represent the type of service offered; provide service information; identify the service requested in a booking |
| **Collaborators** | Customer, Service Provider, Booking |

---

## 4. Booking

| Class | Booking |
|---|---|
| **Responsibilities** | Store booking details; associate a customer with a service provider; associate a requested service and time slot; maintain booking status; record payment status; allow cancellation; record provider acceptance/rejection |
| **Collaborators** | Customer, Service Provider, Service, Time Slot, Payment, Refund, Location |

---

## 5. Time Slot

| Class | Time Slot |
|---|---|
| **Responsibilities** | Represent an available service time; indicate whether a slot is available or reserved; associate a scheduled time with a booking; become available again when a booking is cancelled |
| **Collaborators** | Booking, Service Provider, Customer |

---

## 6. Payment

| Class | Payment |
|---|---|
| **Responsibilities** | Record payment information; process payment status; associate payment with a booking; record successful or failed payment; initiate refund processing when required |
| **Collaborators** | Customer, Booking, Refund, Payment Gateway |

---

## 7. Refund

| Class | Refund |
|---|---|
| **Responsibilities** | Record refund information; associate a refund with a payment/booking; maintain refund status; record pending or completed refunds |
| **Collaborators** | Booking, Payment, Customer, Payment Gateway |

---

## 8. Location

| Class | Location |
|---|---|
| **Responsibilities** | Store the location where the service is required; associate a service location with a booking; provide location information to the service provider |
| **Collaborators** | Customer, Service Provider, Booking |

---

# CRC Summary

| Class | Main Responsibilities | Main Collaborators |
|---|---|---|
| Customer | Request, book, pay for and cancel services | Service Provider, Service, Booking, Time Slot, Payment, Refund, Location |
| Service Provider | Offer services, manage requests and perform jobs | Customer, Service, Booking, Time Slot, Location |
| Service | Represent services offered through FixFleet | Customer, Service Provider, Booking |
| Booking | Manage the complete booking lifecycle | Customer, Service Provider, Service, Time Slot, Payment, Refund, Location |
| Time Slot | Manage scheduled service availability | Booking, Service Provider, Customer |
| Payment | Manage booking payment | Customer, Booking, Refund, Payment Gateway |
| Refund | Manage refunds after cancellation | Booking, Payment, Customer, Payment Gateway |
| Location | Store service location information | Customer, Service Provider, Booking |
