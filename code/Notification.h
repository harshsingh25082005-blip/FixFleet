#ifndef NOTIFICATION_H
#define NOTIFICATION_H

#include <iostream>
#include <string>
using namespace std;

class Notification
{
private:
    int notificationId;
    string message;

public:
    Notification(int id, string msg) : notificationId(id), message(msg) {}

    void send() const
    {
        cout << "Notification #" << notificationId << ": " << message << endl;
    }
};

#endif
