#ifndef SERVICE_PROVIDER_H
#define SERVICE_PROVIDER_H

#include "User.h"
class ServiceProvider : virtual public User
{
private:
    int experience;
    string workingHours;

public:
    ServiceProvider(int id, string n, string p, int exp, string hours)
        : User(id, n, p), experience(exp), workingHours(hours) {}

    void updateJobStatus(const string& status) const
    {
        cout << "Job Status: " << status << endl;
    }
    void display() const override
    {
        cout << "User ID: " << this->userId << endl;
        cout << "Name: " << this->name << endl;
        cout << "Phone: " << this->phone << endl;
        cout << "Experience: " << this->experience << " years" << endl;
        cout << "Working Hours: " << this->workingHours << endl;
    }

    void displayProvider() const
    {
        this->display();
    }

    void acceptRequest() const
    {
        cout << this->name << " accepted the booking request." << endl;
    }

    void rejectRequest() const
    {
        cout << this->name << " rejected the booking request." << endl;
    }
};

#endif
