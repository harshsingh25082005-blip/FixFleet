# FixFleet: Multithreading implementation

## What was added
- `ThreadTasks.h` contains a reusable `ThreadTask` base class wrapping `std::thread`.
- `BookingThread` is the project-specific class-based thread task. It processes a booking asynchronously.
- `Runnable` and `NotificationRunnable` demonstrate the Runnable-style interface pattern.
- `BookingStatistics` protects a shared completed-bookings counter with `std::mutex` and `std::lock_guard`.
- The `main.cpp` demonstration starts two booking threads, joins them, and sends a notification on another thread.
- `sleep_for()` simulates work and `yield()` gives the scheduler an opportunity to run another thread.
- `ThreadState` demonstrates Created, Running, Completed, and Joined states.

## Mapping to the lab sheet
| Lab concept | C++ implementation |
|---|---|
| Create and implement threads | `std::thread` |
| Extend Thread class | `BookingThread : public ThreadTask` (custom wrapper; not a standard C++ Thread class) |
| Implement Runnable | `Runnable` interface and `NotificationRunnable` |
| Thread life cycle | `ThreadState` |
| start() | `ThreadTask::start()` |
| run() | `ThreadTask::run()` / `Runnable::run()` |
| sleep() | `std::this_thread::sleep_for()` |
| join() | `ThreadTask::join()` / `std::thread::join()` |
| yield() | `std::this_thread::yield()` |
| Synchronization | `std::mutex` and `std::lock_guard` in `BookingStatistics` |

## Important language note
The lab wording uses Java terminology. C++ does not have a built-in `Thread` class to extend or a `Runnable` interface. The project demonstrates equivalent design patterns using `std::thread` and a C++ abstract interface.

## Build
Use C++17 and link the threading library:

```bash
g++ -std=c++17 -Wall -Wextra -pedantic -pthread main.cpp -o FixFleet
./FixFleet
```

Keep all `.h` files and `main.cpp` in the same folder.
