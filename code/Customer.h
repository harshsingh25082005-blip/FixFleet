#ifndef CUSTOMER_H
#define CUSTOMER_H

#include "User.h"
class Customer : virtual public User
{
private:
    string email;

public:
    Customer(int id, string n, string p, string e)
        : User(id, n, p), email(e) {}

    
    void display() const override
    {
        cout << "User ID: " << this->userId << endl;
        cout << "Name: " << this->name << endl;
        cout << "Phone: " << this->phone << endl;
        cout << "Email: " << this->email << endl;
    }

    void displayCustomer() const
    {
        this->display();
    }

    void searchService() const
    {
        cout << this->name << " is searching for a service." << endl;
    }
    void updateEmail(const string& newEmail)
    {
        this->email = newEmail;
    }
};

#endif
