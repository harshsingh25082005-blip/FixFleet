#ifndef PAYMENT_H
#define PAYMENT_H

#include <iostream>
#include <string>
#include "FixFleetExceptions.h"
using namespace std;

class Payment final
{
private:
    int paymentId;
    double amount;
    string status;

public:
    Payment(int id, double value)
        : paymentId(id), amount(value), status("Pending")
    {
        if (id < 0)
            throw PaymentException("Payment ID cannot be negative.");
        if (value < 0)
            throw PaymentException("Payment amount cannot be negative.");
    }

    
    Payment(double value)
        : paymentId(0), amount(value), status("Pending")
    {
        if (value < 0)
            throw PaymentException("Payment amount cannot be negative.");
    }

    
    operator double() const { return amount; }

    void processPayment()
    {
        if (amount <= 0)
            throw PaymentException("Payment amount must be greater than zero.");

        status = "Paid";
        cout << "Payment of Rs. " << amount << " processed." << endl;
    }

    void updateStatus(const string& newStatus) { status = newStatus; }

    void displayPayment() const
    {
        cout << "Payment ID: " << paymentId << endl;
        cout << "Amount: Rs. " << amount << endl;
        cout << "Status: " << status << endl;
    }
};

#endif
