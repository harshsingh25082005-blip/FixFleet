#ifndef USER_H
#define USER_H

#include <iostream>
#include <string>
using namespace std;

class User
{
protected:
    int userId;
    string name;
    string phone;

    static int totalUsers;

public:
    User(int id, string n, string p)
        : userId(id), name(n), phone(p)
    {
        ++totalUsers;
    }

    User(const User& other)
        : userId(other.userId), name(other.name), phone(other.phone)
    {
        ++totalUsers;
    }
    virtual ~User() = default;
    virtual void display() const
    {
        cout << "User ID: " << this->userId << endl;
        cout << "Name: " << this->name << endl;
        cout << "Phone: " << this->phone << endl;
    }

    void displayUser() const
    {
        display();
    }
    User& setName(const string& newName)
    {
        this->name = newName;
        return *this;
    }

    static int getTotalUsers()
    {
        return totalUsers;
    }
};

int User::totalUsers = 0;

#endif
