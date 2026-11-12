#ifndef FIXFLEET_EXCEPTIONS_H
#define FIXFLEET_EXCEPTIONS_H

#include <stdexcept>
#include <string>


class FixFleetException : public std::runtime_error
{
public:
    explicit FixFleetException(const std::string& message)
        : std::runtime_error(message) {}
};


class InvalidBookingException : public FixFleetException
{
public:
    explicit InvalidBookingException(const std::string& message)
        : FixFleetException(message) {}
};

class SlotUnavailableException : public FixFleetException
{
public:
    explicit SlotUnavailableException(const std::string& message)
        : FixFleetException(message) {}
};

class PaymentException : public FixFleetException
{
public:
    explicit PaymentException(const std::string& message)
        : FixFleetException(message) {}
};

#endif
