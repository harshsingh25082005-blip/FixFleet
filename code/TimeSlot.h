#ifndef TIMESLOT_H
#define TIMESLOT_H

#include <iostream>
#include <string>
using namespace std;

class TimeSlot
{
private:
    int slotId;
    string startTime;
    string endTime;
    bool available;

public:
    TimeSlot(int id, string start, string end)
        : slotId(id), startTime(start), endTime(end), available(true) {}

    bool checkAvailability() const { return available; }

    void reserve()
    {
        if (available)
        {
            available = false;
            cout << "Time slot reserved." << endl;
        }
        else
            cout << "Time slot is already unavailable." << endl;
    }

    void release()
    {
        available = true;
        cout << "Time slot released." << endl;
    }
};

#endif
