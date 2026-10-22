#ifndef PAYMENT_H
#define PAYMENT_H

#include <iostream>
#include <string>
using namespace std;

class Payment final
{
private:
    int paymentId;
    double amount;
    string status;

public:
    Payment(int id, double value)
        : paymentId(id), amount(value), status("Pending") {}

    void processPayment()
    {
        this->status = "Paid";
        cout << "Payment of Rs. " << this->amount << " processed." << endl;
    }

    void updateStatus(const string& newStatus)
    {
        this->status = newStatus;
    }

    void displayPayment() const
    {
        cout << "Payment ID: " << this->paymentId << endl;
        cout << "Amount: Rs. " << this->amount << endl;
        cout << "Status: " << this->status << endl;
    }
};

#endif
