#ifndef FIXFLEET_TEMPLATES_H
#define FIXFLEET_TEMPLATES_H

#include <iostream>
#include <string>
using namespace std;

template <typename T>
void displayInfo(const string& label, const T& value)
{
    cout << label << value << endl;
}

#endif
