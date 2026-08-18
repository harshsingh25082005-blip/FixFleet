# FixFleet — CRC Cards

CRC stands for **Class–Responsibility–Collaborator**.

These CRC cards are based on the FixFleet problem statement and the three selected
use cases:

- UC-01: Book Service
- UC-02: Cancel Booking
- UC-03: Accept / Reject Service Request

The CRC cards identify the main domain classes, their responsibilities, and the
other classes they interact with.

---

## 1. Customer

| Class | Customer |
|---|---|
| **Responsibilities** | Register/login; search for required services; view service-provider profiles; select a service provider; select a suitable time slot; create bookings; make payments; view booking status; cancel bookings; receive booking updates |
| **Collaborators** | Service Provider, Service, Booking, Time Slot, Payment, Notification |

---

## 2. Service Provider

| Class | Service Provider |
|---|---|
| **Responsibilities** | Register as a provider; maintain provider profile; list skills and services; define working hours and availability; receive service requests; review requests; accept or reject requests; manage active jobs; update job status |
| **Collaborators** | Customer, Service, Service Provider Profile, Booking, Time Slot, Notification |

---

## 3. Service Provider Profile

| Class | Service Provider Profile |
|---|---|
| **Responsibilities** | Store provider information; maintain skills and experience; maintain ratings; maintain charges; maintain service area; provide profile information to customers |
| **Collaborators** | Service Provider, Skill, Rating, Service Area, Customer |

---

## 4. Service

| Class | Service |
|---|---|
| **Responsibilities** | Represent a type of home service offered by FixFleet; identify the service requested by a customer; associate services with suitable providers |
| **Collaborators** | Customer, Service Provider, Booking |

---

## 5. Skill

| Class | Skill |
|---|---|
| **Responsibilities** | Represent a skill possessed by a service provider; identify the type of work a provider can perform; support matching between customers and providers |
| **Collaborators** | Service Provider, Service Provider Profile, Service |

---

## 6. Booking

| Class | Booking |
|---|---|
| **Responsibilities** | Create and maintain booking details; associate a customer with a service provider; associate a service and time slot; maintain booking status; record provider acceptance/rejection; support cancellation; associate payment information with the booking |
| **Collaborators** | Customer, Service Provider, Service, Time Slot, Payment, Notification |

---

## 7. Time Slot

| Class | Time Slot |
|---|---|
| **Responsibilities** | Represent an available service time; maintain availability; associate a scheduled time with a booking; become available again when an applicable booking is cancelled |
| **Collaborators** | Service Provider, Booking, Customer |

---

## 8. Payment

| Class | Payment |
|---|---|
| **Responsibilities** | Record payment information; process payment for a booking; maintain payment status; handle failed payments; initiate refund processing when applicable |
| **Collaborators** | Customer, Booking, Payment Gateway, Notification |

---

## 9. Refund

| Class | Refund |
|---|---|
| **Responsibilities** | Record refund information; associate a refund with a cancelled booking/payment; maintain refund status; track pending or completed refunds |
| **Collaborators** | Booking, Payment, Customer, Payment Gateway |

---

## 10. Rating

| Class | Rating |
|---|---|
| **Responsibilities** | Represent the rating associated with a service provider; store rating information used to communicate provider reputation |
| **Collaborators** | Customer, Service Provider, Service Provider Profile |

---

## 11. Service Area

| Class | Service Area |
|---|---|
| **Responsibilities** | Represent the geographical area in which a service provider offers services; support identification of providers serving a customer's required location |
| **Collaborators** | Service Provider, Service Provider Profile, Customer |

---

## 12. Notification

| Class | Notification |
|---|---|
| **Responsibilities** | Send booking confirmations; send cancellation updates; inform customers about provider acceptance/rejection; send booking reminders and status updates |
| **Collaborators** | Customer, Service Provider, Booking, Notification Service |

---

# External Systems / Actors

The following are not considered internal domain classes because they represent
external actors or systems interacting with FixFleet.

## Payment Gateway

**Responsibilities:** Process customer payments and refunds and report their
status to FixFleet.

**Collaborators:** Payment, Refund.

---

## Notification Service

**Responsibilities:** Deliver notifications such as booking confirmations,
reminders, cancellations, and booking-status updates.

**Collaborators:** Notification, Customer, Service Provider.

---

# Administrative Actor

## Administrator

The Administrator is treated as an **actor** rather than a core domain class
for the current model.

**Responsibilities:**

- Verify service-provider profiles
- Monitor bookings
- Handle complaints
- Maintain user records

The Administrator may interact with classes such as Service Provider Profile,
Booking, and Customer.

---

# Final Domain Classes

The refined FixFleet domain model contains the following classes:

1. Customer
2. Service Provider
3. Service Provider Profile
4. Service
5. Skill
6. Booking
7. Time Slot
8. Payment
9. Refund
10. Rating
11. Service Area
12. Notification

External systems:

- Payment Gateway
- Notification Service

Actor:

- Administrator
| Refund | Manage refunds after cancellation | Booking, Payment, Customer, Payment Gateway |
| Location | Store service location information | Customer, Service Provider, Booking |
