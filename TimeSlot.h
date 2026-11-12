#ifndef TIMESLOT_H
#define TIMESLOT_H

#include <iostream>
#include <string>
#include "FixFleetExceptions.h"
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
        : slotId(id), startTime(start), endTime(end), available(true)
    {
        if (id <= 0)
            throw InvalidBookingException("Time slot ID must be positive.");
        if (start.empty() || end.empty())
            throw InvalidBookingException("Time slot start/end time cannot be empty.");
    }

    bool checkAvailability() const { return available; }

    void reserve()
    {
        if (!available)
            throw SlotUnavailableException("This time slot is already reserved.");

        available = false;
        cout << "Time slot reserved." << endl;
    }

    void release()
    {
        available = true;
        cout << "Time slot released." << endl;
    }
};

#endif
