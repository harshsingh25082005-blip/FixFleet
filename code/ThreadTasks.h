#ifndef THREAD_TASKS_H
#define THREAD_TASKS_H

#include <atomic>
#include <chrono>
#include <iostream>
#include <mutex>
#include <stdexcept>
#include <string>
#include <thread>

#include "Booking.h"
#include "Notification.h"

// C++ has no built-in Thread base class. This project class wraps
// std::thread and provides start(), run(), and join() in a familiar form.
enum class ThreadState
{
    Created,
    Running,
    Completed,
    Joined
};

inline const char* threadStateToString(ThreadState state)
{
    switch (state)
    {
        case ThreadState::Created:  return "Created";
        case ThreadState::Running:  return "Running";
        case ThreadState::Completed:return "Completed";
        case ThreadState::Joined:   return "Joined";
    }
    return "Unknown";
}

class ThreadTask
{
private:
    std::thread worker;
    std::atomic<ThreadState> state{ThreadState::Created};

    void execute()
    {
        state.store(ThreadState::Running);
        run();
        state.store(ThreadState::Completed);
    }

protected:
    virtual void run() = 0;

public:
    ThreadTask() = default;
    ThreadTask(const ThreadTask&) = delete;
    ThreadTask& operator=(const ThreadTask&) = delete;

    virtual ~ThreadTask()
    {
        if (worker.joinable())
            worker.join();
    }

    void start()
    {
        if (state.load() != ThreadState::Created)
            throw std::logic_error("A thread task can only be started once.");

        worker = std::thread(&ThreadTask::execute, this);
    }

    void join()
    {
        if (worker.joinable())
        {
            worker.join();
            state.store(ThreadState::Joined);
        }
    }

    ThreadState getState() const
    {
        return state.load();
    }
};

// Synchronization for shared booking statistics.
// Both booking threads update the same counter, so the mutex prevents
// simultaneous writes (a data race).
class BookingStatistics
{
private:
    mutable std::mutex counterMutex;
    int completedBookings = 0;

public:
    void markCompleted()
    {
        std::lock_guard<std::mutex> lock(counterMutex);
        ++completedBookings;
    }

    int getCompletedCount() const
    {
        std::lock_guard<std::mutex> lock(counterMutex);
        return completedBookings;
    }
};

// Class-based thread task: closest C++ equivalent to extending Thread.
class BookingThread : public ThreadTask
{
private:
    Booking& booking;
    BookingStatistics& statistics;
    std::string serviceName;

protected:
    void run() override
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(250));
        std::this_thread::yield();

        booking.createBooking(serviceName);
        booking.confirmBooking();
        statistics.markCompleted();

        // Keep console output from different worker threads together.
        static std::mutex outputMutex;
        std::lock_guard<std::mutex> lock(outputMutex);
        std::cout << "Booking " << booking.getBookingId()
                  << " processed by thread "
                  << std::this_thread::get_id() << std::endl;
    }

public:
    BookingThread(Booking& b, BookingStatistics& stats, std::string service)
        : booking(b), statistics(stats), serviceName(std::move(service)) {}
};

// C++ has no Runnable interface. This abstract interface demonstrates
// the same design idea: a task exposes run(), and std::thread executes it.
class Runnable
{
public:
    virtual void run() = 0;
    virtual ~Runnable() = default;
};

class NotificationRunnable : public Runnable
{
private:
    Notification& notification;

public:
    explicit NotificationRunnable(Notification& n) : notification(n) {}

    void run() override
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(150));
        notification.send();
    }

    void operator()()
    {
        run();
    }
};

#endif
