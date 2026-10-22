#ifndef REFUND_H
#define REFUND_H

#include <iostream>
using namespace std;

class Refund
{
private:
    int refundId;
    double amount;

public:
    Refund(int id, double value) : refundId(id), amount(value) {}

    void initiate() const
    {
        cout << "Refund ID " << refundId << " initiated for Rs. " << amount << endl;
    }
};

#endif
