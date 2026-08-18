# FixFleet — Noun–Verb Analysis

## 1. Purpose

Noun–verb analysis was performed on the three selected use-case specifications:

- UC-01: Book Service
- UC-02: Cancel Booking
- UC-03: Accept / Reject Service Request

The nouns were initially collected as candidate domain classes, while verbs were
considered as potential responsibilities/operations. The noun candidates were
then filtered to identify the classes that belong in the FixFleet domain model.

---

# 2. UC-01: Book Service

## 2.1 Raw Candidate List

### Nouns

| Candidate | Source / Context |
|---|---|
| Customer | Primary actor |
| Service Provider | Selected provider |
| Payment Gateway | Stakeholder/external system |
| FixFleet System | System |
| Service | Service being booked |
| Booking | Booking request |
| Booking Request | Request created by customer |
| Time Slot | Selected service time |
| Service Details | Details displayed to customer |
| Payment | Payment made by customer |
| Payment Status | Status of payment |
| Booking Status | Status of booking |
| Provider Search | Search for providers |
| Availability | Provider/time-slot availability |
| Service Slot | Available slot |
| Booking Details | Details of booking |
| Cancellation | Customer cancellation |
| Customer | User making booking |

### Verbs

| Verb | Possible Responsibility / Operation |
|---|---|
| select | Select provider |
| search | Search for provider |
| display | Display provider details |
| choose | Choose time slot |
| record | Record selected slot |
| confirm | Confirm booking |
| create | Create booking |
| request | Request payment |
| complete | Complete payment |
| process | Process payment |
| confirm | Confirm payment |
| update | Update booking/payment status |
| send | Send booking details |
| accept | Accept request |
| reject | Reject request |
| cancel | Cancel booking |

## 2.2 Filtering

| Candidate | Decision | Filter / Reason |
|---|---|---|
| Customer | **Keep** | Relevant domain entity |
| Service Provider | **Keep** | Relevant domain entity |
| Service | **Keep** | Represents the service being requested |
| Booking | **Keep** | Central domain entity |
| Time Slot | **Keep** | Represents scheduled service availability |
| Payment | **Keep** | Represents payment associated with a booking |
| Payment Gateway | **Keep as external system** | External actor/system, not an internal domain class |
| FixFleet System | **Discard** | System boundary, not a domain class |
| Booking Request | **Discard** | Redundant with Booking |
| Service Details | **Discard** | Attribute/details of Service |
| Booking Details | **Discard** | Attributes/details of Booking |
| Payment Status | **Discard** | Attribute of Payment |
| Booking Status | **Discard** | Attribute of Booking |
| Provider Search | **Discard** | Activity/function rather than domain entity |
| Availability | **Discard** | Property/state of provider/time slot |
| Service Slot | **Discard** | Redundant with Time Slot |
| Cancellation | **Discard** | Action/state related to Booking |

---

# 3. UC-02: Cancel Booking

## 3.1 Raw Candidate List

### Nouns

| Candidate | Source / Context |
|---|---|
| Customer | Primary actor |
| Service Provider | Stakeholder |
| Payment Gateway | Stakeholder/external system |
| FixFleet System | System |
| Booking | Existing booking |
| Cancellation | Cancellation operation |
| Booking Details | Details displayed |
| Cancellation Option | Option displayed to customer |
| Booking Status | Status checked/updated |
| Time Slot | Reserved slot |
| Payment | Payment associated with booking |
| Refund | Possible refund |
| Refund Status | Status of refund |
| Cancellation Process | Process of cancellation |

### Verbs

| Verb | Possible Responsibility / Operation |
|---|---|
| open | Open bookings |
| display | Display bookings/details |
| select | Select booking |
| cancel | Cancel booking |
| check | Check cancellation eligibility |
| confirm | Confirm cancellation |
| change | Change booking status |
| inform | Inform service provider |
| update | Update availability/status |
| initiate | Initiate refund |
| process | Process refund |
| record | Record refund status |
| remain | Remain active/pending |

## 3.2 Filtering

| Candidate | Decision | Filter / Reason |
|---|---|---|
| Customer | **Keep** | Relevant domain entity |
| Service Provider | **Keep** | Relevant domain entity |
| Payment Gateway | **Keep as external system** | External actor/system |
| Booking | **Keep** | Central domain entity |
| Time Slot | **Keep** | Represents reserved service time |
| Payment | **Keep** | Associated with booking |
| Refund | **Keep** | Represents money returned after cancellation |
| FixFleet System | **Discard** | System boundary |
| Cancellation | **Discard** | Operation/state associated with Booking |
| Booking Details | **Discard** | Attributes/details of Booking |
| Cancellation Option | **Discard** | UI/implementation concept |
| Booking Status | **Discard** | Attribute of Booking |
| Refund Status | **Discard** | Attribute of Refund |
| Cancellation Process | **Discard** | Process rather than domain entity |

---

# 4. UC-03: Accept / Reject Service Request

## 4.1 Raw Candidate List

### Nouns

| Candidate | Source / Context |
|---|---|
| Service Provider | Primary actor |
| Customer | Stakeholder |
| FixFleet System | System |
| Booking Request | Request received by provider |
| Booking | Underlying booking |
| Service | Requested service |
| Location | Service location |
| Scheduled Time | Time of service |
| Booking Details | Details shown to provider |
| Request Details | Details of request |
| Booking Status | Accepted/rejected status |
| Acceptance | Provider acceptance |
| Rejection | Provider rejection |
| Active Jobs | Provider's jobs |
| Pending Requests | Provider's requests |
| Provider Availability | Availability of provider |

### Verbs

| Verb | Possible Responsibility / Operation |
|---|---|
| receive | Receive booking request |
| make available | Make request available |
| open | Open request |
| display | Display request details |
| review | Review request |
| choose | Choose accept/reject |
| accept | Accept request |
| reject | Reject request |
| confirm | Confirm rejection |
| change | Change booking status |
| record | Record acceptance/rejection |
| inform | Inform customer |
| add | Add accepted job |
| update | Update job status |
| check | Check availability/status |
| cancel | Cancel booking |

## 4.2 Filtering

| Candidate | Decision | Filter / Reason |
|---|---|---|
| Service Provider | **Keep** | Relevant domain entity |
| Customer | **Keep** | Relevant domain entity |
| Booking | **Keep** | Central domain entity |
| Service | **Keep** | Represents requested service |
| Location | **Keep** | Important information associated with service booking |
| Scheduled Time | **Discard** | Attribute of Booking/Time Slot |
| Booking Request | **Discard** | Redundant with Booking |
| FixFleet System | **Discard** | System boundary |
| Booking Details | **Discard** | Attributes/details of Booking |
| Request Details | **Discard** | Attributes/details of Booking |
| Booking Status | **Discard** | Attribute of Booking |
| Acceptance | **Discard** | Action/state of Booking |
| Rejection | **Discard** | Action/state of Booking |
| Active Jobs | **Discard** | Collection/view of bookings |
| Pending Requests | **Discard** | Collection/view of bookings |
| Provider Availability | **Discard** | Property/state of Service Provider |

---

# 5. Consolidated Surviving Classes

After combining the results from all three use cases and removing duplicates, the
following domain classes survive:

| Class | Reason for Survival |
|---|---|
| **Customer** | Represents a user who requests services |
| **Service Provider** | Represents a provider who receives and handles service requests |
| **Service** | Represents the service requested by a customer |
| **Booking** | Represents a customer's service booking |
| **Time Slot** | Represents the scheduled time associated with a booking |
| **Payment** | Represents payment associated with a booking |
| **Refund** | Represents money returned after an eligible cancellation |
| **Location** | Represents where the service is performed |

---

# 6. Final Surviving Classes

The final candidate classes for the FixFleet domain model are:

1. Customer
2. Service Provider
3. Service
4. Booking
5. Time Slot
6. Payment
7. Refund
8. Location

These classes will be used as the starting point for the CRC cards and domain
class diagram.
