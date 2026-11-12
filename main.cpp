#include <iostream>
#include <string>
#include "Customer.h"
#include "ServiceProvider.h"
#include "Booking.h"
#include "TimeSlot.h"
#include "Payment.h"
#include "Refund.h"
#include "Notification.h"
#include "FixFleetTemplates.h"
#include "FixFleetExceptions.h"
#include "FixFleetFinally.h"
#include "ThreadTasks.h"

using namespace std;

class FixFleetMember : public Customer, public ServiceProvider
{
public:
    FixFleetMember(int id, string n, string p, string e, int exp, string hours)
        : User(id, n, p),
          Customer(id, n, p, e),
          ServiceProvider(id, n, p, exp, hours) {}

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
    FixFleetMember member(301, "Harsh Singh", "9999999999",
                          "harsh@example.com", 4, "10:00-19:00");
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

    cout << "\n===== TIME SLOT =====" << endl;
    TimeSlot slot(9, "10:00", "11:00");
    cout << "Available: " << boolalpha << slot.checkAvailability() << endl;
    slot.reserve();
    slot.release();

    cout << "\n===== PAYMENT =====" << endl;
    Payment payment(7001, 500.0);
    payment.processPayment();
    payment.displayPayment();

    cout << "\n===== REFUND + NOTIFICATION =====" << endl;
    Refund refund(9001, 500.0);
    refund.initiate();
    Notification notification(8001, "Your booking has been accepted.");
    notification.send();

    cout << "\n===== TYPE CONVERSIONS =====" << endl;
    double basicAmount = 750.0;
    Payment convertedPayment = basicAmount;
    convertedPayment.displayPayment();
    Payment paymentForConversion(7002, 1250.0);
    double extractedAmount = paymentForConversion;
    cout << "Converted payment amount: Rs. " << extractedAmount << endl;
    Refund convertedRefund(booking1, 500.0);
    convertedRefund.initiate();

    cout << "\n===== FUNCTION TEMPLATE =====" << endl;
    displayInfo("Booking ID: ", 1001);
    displayInfo("Payment Amount: Rs. ", 750.50);
    displayInfo("Customer Name: ", string("Harsh Singh"));

    
    cout << "\n===== EXCEPTION HANDLING: TRY / THROW / CATCH =====" << endl;
    try
    {
       
        Payment invalidPayment(7003, 0.0);
        invalidPayment.processPayment();
    }
    catch (const PaymentException& ex) 
    {
        cout << "Payment error caught: " << ex.what() << endl;
    }
    catch (const FixFleetException& ex) 
    {
        cout << "FixFleet error caught: " << ex.what() << endl;
    }
    catch (const exception& ex)
    {
        cout << "Standard exception caught: " << ex.what() << endl;
    }

    cout << "\n===== DERIVED AND BASE-CLASS EXCEPTION CATCHING =====" << endl;
    try
    {
        
        TimeSlot invalidSlot(0, "10:00", "11:00");
    }
    catch (const InvalidBookingException& ex)
    {
        cout << "Derived exception caught: " << ex.what() << endl;
    }
    catch (const FixFleetException& ex)
    {
        cout << "Base exception caught: " << ex.what() << endl;
    }

    cout << "\n===== BASE-CLASS CATCH FOR ANOTHER DERIVED EXCEPTION =====" << endl;
    try
    {
        TimeSlot occupiedSlot(10, "12:00", "13:00");
        occupiedSlot.reserve();
        occupiedSlot.reserve(); 
    }
    catch (const FixFleetException& ex)
    {
        cout << "Base FixFleetException caught derived error: " << ex.what() << endl;
    }

    cout << "\n===== FINALLY-BLOCK EQUIVALENT =====" << endl;
    try
    {
        auto finallyBlock = makeFinally([] {
            cout << "Cleanup runs from the finally-equivalent block." << endl;
        });
        throw InvalidBookingException("Demonstration exception for cleanup.");
    }
    catch (const FixFleetException& ex)
    {
        cout << "Exception handled: " << ex.what() << endl;
    }


    cout << "\n===== MULTITHREADING: BOOKING PROCESSING =====" << endl;
    Booking threadedBooking1(2001, "06-Nov-2026");
    Booking threadedBooking2(2002, "06-Nov-2026");
    BookingStatistics bookingStats;

    // BookingThread is a C++ class-based thread task (the closest
    // equivalent to extending Java's Thread class).
    BookingThread bookingWorker1(threadedBooking1, bookingStats, "Electrical repair");
    BookingThread bookingWorker2(threadedBooking2, bookingStats, "Plumbing repair");

    bookingWorker1.start();
    bookingWorker2.start();
    bookingWorker1.join();
    bookingWorker2.join();

    cout << "Booking 2001 status: " << threadedBooking1.getStatus() << endl;
    cout << "Booking 2002 status: " << threadedBooking2.getStatus() << endl;
    cout << "Completed bookings (mutex-protected): "
         << bookingStats.getCompletedCount() << endl;

    cout << "\n===== RUNNABLE EQUIVALENT: NOTIFICATION THREAD =====" << endl;
    Notification threadedNotification(
        8002, "Your FixFleet service booking has been confirmed.");
    NotificationRunnable notificationTask(threadedNotification);

    // A Runnable-style object is passed to std::thread.
    thread notificationThread(ref(notificationTask));
    notificationThread.join();

    cout << "\n===== THREAD METHODS + LIFE CYCLE =====" << endl;
    cout << "Booking worker 1 state: "
         << threadStateToString(bookingWorker1.getState()) << endl;
    cout << "Booking worker 2 state: "
         << threadStateToString(bookingWorker2.getState()) << endl;
    cout << "start() launches the worker; run() contains its task; "
         << "sleep_for() simulates processing; yield() gives up the CPU; "
         << "join() waits for completion." << endl;

    cout << "\n===== EXCEPTION HANDLING COMPLETE =====" << endl;
    return 0;
}
