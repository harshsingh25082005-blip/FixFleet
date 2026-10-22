#include <iostream>
#include "Customer.h"
#include "ServiceProvider.h"
#include "Booking.h"
#include "TimeSlot.h"
#include "Payment.h"
#include "Refund.h"
#include "Notification.h"

using namespace std;


class FixFleetMember : public Customer, public ServiceProvider
{
public:
    FixFleetMember(int id, string n, string p, string e, int exp, string hours)
        : User(id, n, p),
          Customer(id, n, p, e),
          ServiceProvider(id, n, p, exp, hours)
    {
    }

    
    void display() const override
    {
        cout << "----- FixFleet Member -----" << endl;
        Customer::display();
        cout << "Service Provider Details:" << endl;
        ServiceProvider::display();
    }
};

int main()
{
    Customer customer(101, "Rahul Sharma", "9876543210", "rahul@example.com");
    ServiceProvider provider(205, "Amit Kumar", "9988776655", 5, "09:00-18:00");

    cout << "===== CUSTOMER =====" << endl;
    customer.displayCustomer();

    cout << "\n===== SERVICE PROVIDER =====" << endl;
    provider.displayProvider();

    cout << "\n===== THIS POINTER =====" << endl;
    customer.setName("Rahul Singh");
    customer.updateEmail("rahul.singh@example.com");
    customer.displayCustomer();

    cout << "\n===== VIRTUAL FUNCTION =====" << endl;
    User* userPtr = &customer;          
    userPtr->display();                

    userPtr = &provider;               
    userPtr->display();                
    cout << "\n===== POINTER TO OBJECT =====" << endl;
    Booking booking1(1001, "20-Aug-2026");
    Booking* bookingPtr = &booking1;   
    bookingPtr->createBooking("Electrical Repair");
    bookingPtr->confirmBooking();

    cout << "\n===== POINTER TO DERIVED CLASS =====" << endl;
    ServiceProvider* providerPtr = &provider;
    providerPtr->acceptRequest();
    providerPtr->updateJobStatus("Accepted");

    cout << "\n===== VIRTUAL BASE CLASS =====" << endl;
    FixFleetMember member(
        301,
        "Harsh Singh",
        "9999999999",
        "harsh@example.com",
        4,
        "10:00-19:00"
    );

    User* virtualBasePtr = &member;
    virtualBasePtr->display();

    cout << "\n===== BOOKING + METHOD OVERLOADING =====" << endl;
    booking1.createBooking();
    booking1.createBooking("Electrical Repair");
    booking1.createBooking("Electrical Repair", "20-Aug-2026");

    cout << "\n===== NESTED CLASS =====" << endl;
    Booking::BookingDetails details("Electrical Repair", "Geeta Residency");
    details.display();

    cout << "\n===== PROVIDER RESPONSE =====" << endl;
    provider.acceptRequest();
    booking1.confirmBooking();
    provider.updateJobStatus("Accepted");

    cout << "\n===== FRIEND STREAM OPERATOR OVERLOADING =====" << endl;
    cout << booking1;

    cout << "\n===== OPERATOR == OVERLOADING =====" << endl;
    Booking booking2(1001, "20-Aug-2026");
    if (booking1 == booking2)
        cout << "Both bookings have the same Booking ID." << endl;

    cout << "\n===== STATIC VARIABLE + STATIC FUNCTION =====" << endl;
    cout << "Total User objects created: " << User::getTotalUsers() << endl;

    cout << "\n===== OBJECT SLICING =====" << endl;
    User slicedCustomer = customer;
    slicedCustomer.displayUser();
    cout << "Only User data is copied; Customer::email is not present in the sliced object." << endl;

    cout << "\n===== NEXT FIXFLEET PART: TIME SLOT =====" << endl;
    TimeSlot slot(9, "10:00", "11:00");
    cout << "Available: " << boolalpha << slot.checkAvailability() << endl;
    slot.reserve();
    slot.release();

    cout << "\n===== NEXT FIXFLEET PART: PAYMENT (final class) =====" << endl;
    Payment payment(7001, 500.0);
    payment.processPayment();
    payment.displayPayment();

    cout << "\n===== REFUND + NOTIFICATION =====" << endl;
    Refund refund(9001, 500.0);
    refund.initiate();
    Notification notification(8001, "Your booking has been accepted.");
    notification.send();

