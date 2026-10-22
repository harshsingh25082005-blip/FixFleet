#ifndef BOOKING_H
#define BOOKING_H

#include <iostream>
#include <string>
using namespace std;

class Booking
{
private:
    int bookingId;
    string bookingDate;
    string status;

public:
   
    class BookingDetails
    {
    private:
        string serviceName;
        string location;

    public:
        BookingDetails(string service, string place)
            : serviceName(service), location(place) {}

        void display() const
        {
            cout << "Service: " << serviceName << endl;
            cout << "Location: " << location << endl;
        }
    };

    Booking(int id, string date)
        : bookingId(id), bookingDate(date), status("Pending") {}

    void createBooking()
    {
        cout << "Booking created." << endl;
    }

    void createBooking(const string& service)
    {
        cout << "Booking created for: " << service << endl;
    }

    void createBooking(const string& service, const string& date)
    {
        cout << "Booking created for: " << service << " on " << date << endl;
    }

    void confirmBooking() { this->status = "Confirmed"; }
    void cancelBooking() { this->status = "Cancelled"; }
    void updateStatus(const string& newStatus)
    {
        this->status = newStatus;
    }

    bool operator==(const Booking& other) const
    {
        return this->bookingId == other.bookingId;
    }
    friend ostream& operator<<(ostream& out, const Booking& booking)
    {
        out << "Booking ID: " << booking.bookingId << endl;
        out << "Booking Date: " << booking.bookingDate << endl;
        out << "Status: " << booking.status << endl;
        return out;
    }
    friend istream& operator>>(istream& in, Booking& booking)
    {
        cout << "Enter booking date: ";
        in >> booking.bookingDate;
        cout << "Enter booking status: ";
        in >> booking.status;
        return in;
    }
};

#endif
