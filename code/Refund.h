#ifndef REFUND_H
#define REFUND_H

#include <iostream>
#include "Booking.h"
using namespace std;

class Refund
{
private:
    int refundId;
    double amount;

public:
    Refund(int id, double value) : refundId(id), amount(value) {}

    
    Refund(const Booking& booking, double value)
        : refundId(booking.getBookingId()), amount(value) {}

    void initiate() const
    {
        cout << "Refund ID " << refundId << " initiated for Rs. " << amount << endl;
    }
};

#endif
