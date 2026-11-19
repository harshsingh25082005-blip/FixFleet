#ifndef FIXFLEET_FINALLY_H
#define FIXFLEET_FINALLY_H

#include <utility>

// C++ has no built-in finally keyword. This scope guard runs its callback
// when leaving scope, including when an exception is thrown.
template <typename Function>
class FinallyBlock
{
private:
    Function action;
    bool active;

public:
    explicit FinallyBlock(Function fn)
        : action(std::move(fn)), active(true) {}

    FinallyBlock(const FinallyBlock&) = delete;
    FinallyBlock& operator=(const FinallyBlock&) = delete;

    FinallyBlock(FinallyBlock&& other) noexcept
        : action(std::move(other.action)), active(other.active)
    {
        other.active = false;
    }

    ~FinallyBlock() noexcept
    {
        if (active)
        {
            try { action(); }
            catch (...) { /* Destructors must not let exceptions escape. */ }
        }
    }
};

template <typename Function>
FinallyBlock<Function> makeFinally(Function fn)
{
    return FinallyBlock<Function>(std::move(fn));
}

#endif
