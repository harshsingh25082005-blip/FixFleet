
#include <httplib.h>
#include <nlohmann/json.hpp>

#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <string>
#include <vector>

#include "Booking.h"
#include "Customer.h"
#include "ServiceProvider.h"
#include "Payment.h"
#include "Notification.h"

using json = nlohmann::json;

struct ProviderRow {
    int id;
    std::string name, role, service, experience, location;
    double rating, price;
    int reviews;
    bool verified, available;
};

struct BookingRow {
    int id;
    int customerId;
    int providerId;
    std::string customerName, providerName, service, date, time, location;
    double amount;
    std::unique_ptr<Booking> domain;

    BookingRow(int bookingId, int customer, int provider, std::string cName,
               std::string pName, std::string serviceName, std::string bookingDate,
               std::string bookingTime, std::string address, double price)
        : id(bookingId), customerId(customer), providerId(provider),
          customerName(std::move(cName)), providerName(std::move(pName)),
          service(std::move(serviceName)), date(std::move(bookingDate)),
          time(std::move(bookingTime)), location(std::move(address)),
          amount(price), domain(std::make_unique<Booking>(bookingId, date)) {}

    std::string status() const { return domain->getStatus(); }
};

static json providerJson(const ProviderRow& p) {
    return {
        {"id", p.id}, {"name", p.name}, {"role", p.role}, {"service", p.service},
        {"rating", p.rating}, {"reviews", p.reviews}, {"experience", p.experience},
        {"price", p.price}, {"location", p.location}, {"verified", p.verified},
        {"available", p.available}
    };
}

static json bookingJson(const BookingRow& b) {
    return {
        {"id", b.id}, {"customerId", b.customerId}, {"customerName", b.customerName},
        {"providerId", b.providerId}, {"providerName", b.providerName},
        {"service", b.service}, {"date", b.date}, {"time", b.time},
        {"scheduledAt", b.date + (b.time.empty() ? "" : ", " + b.time)},
        {"location", b.location}, {"amount", b.amount}, {"price", b.amount},
        {"status", b.status()}
    };
}

int main() {
    httplib::Server server;
    server.set_default_headers({
        {"Access-Control-Allow-Origin", "http://localhost:5173"},
        {"Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });
    server.Options(R"(/api/.*)", [](const httplib::Request&, httplib::Response& res) {
        res.status = 204;
    });

    // Keep the existing domain classes as the business-logic layer.
    Customer demoCustomer(301, "Harsh Singh", "9999999999", "harsh@example.com");
    std::map<int, std::unique_ptr<ServiceProvider>> providerObjects;
    providerObjects.emplace(205, std::make_unique<ServiceProvider>(205, "Amit Kumar", "9988776655", 5, "09:00-18:00"));
    providerObjects.emplace(208, std::make_unique<ServiceProvider>(208, "Rakesh Patel", "9876501234", 7, "08:00-17:00"));
    providerObjects.emplace(212, std::make_unique<ServiceProvider>(212, "Vikram Shah", "9876509876", 6, "10:00-19:00"));

    std::vector<ProviderRow> providers = {
        {205, "Amit Kumar", "Electrician", "Electrical", "5 years", "Within 2 km", 4.9, 500, 128, true, true},
        {208, "Rakesh Patel", "Master Plumber", "Plumbing", "7 years", "Within 3 km", 4.8, 450, 96, true, true},
        {212, "Vikram Shah", "Carpenter", "Carpentry", "6 years", "Within 4 km", 4.7, 600, 74, true, false}
    };

    std::mutex dataMutex;
    std::map<int, std::unique_ptr<BookingRow>> bookings;
    int nextBookingId = 1004;

    auto seed = [&](int id, int providerId, const std::string& service,
                    const std::string& date, const std::string& time,
                    double amount, const std::string& status) {
        const auto it = std::find_if(providers.begin(), providers.end(),
            [&](const ProviderRow& p) { return p.id == providerId; });
        const std::string providerName = it == providers.end() ? "Assigned professional" : it->name;
        auto row = std::make_unique<BookingRow>(id, 301, providerId, "Harsh Singh",
            providerName, service, date, time, "Geeta Residency, Gandhinagar", amount);
        row->domain->updateStatus(status);
        bookings.emplace(id, std::move(row));
    };
    seed(1001, 205, "Electrical Repair", "Today", "4:30 PM", 500, "Confirmed");
    seed(1002, 208, "Kitchen tap leakage", "Tomorrow", "11:00 AM", 450, "Pending");
    seed(1003, 205, "Ceiling fan installation", "12 Nov", "10:00 AM", 350, "Completed");

    server.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content(R"({"status":"ok","service":"FixFleet C++ API"})", "application/json");
    });

    server.Get("/api/services", [](const httplib::Request&, httplib::Response& res) {
        json data = json::array({
            {{"id","electrical"},{"name","Electrical"},{"detail","Wiring, switches & repairs"}},
            {{"id","plumbing"},{"name","Plumbing"},{"detail","Leaks, taps & pipelines"}},
            {{"id","carpentry"},{"name","Carpentry"},{"detail","Furniture & woodwork"}},
            {{"id","painting"},{"name","Painting"},{"detail","Walls & home makeovers"}},
            {{"id","appliance"},{"name","Appliance repair"},{"detail","AC, fridge & washing machine"}},
            {{"id","cleaning"},{"name","Fan & fixture"},{"detail","Installation & maintenance"}}
        });
        res.set_content(data.dump(), "application/json");
    });

    server.Get("/api/providers", [&](const httplib::Request&, httplib::Response& res) {
        json data = json::array();
        for (const auto& p : providers) data.push_back(providerJson(p));
        res.set_content(data.dump(), "application/json");
    });

    server.Get("/api/bookings", [&](const httplib::Request& req, httplib::Response& res) {
        int customerId = 301;
        if (req.has_param("customerId")) {
            try { customerId = std::stoi(req.get_param_value("customerId")); }
            catch (...) {
                res.status = 400;
                res.set_content(R"({"error":"Invalid customerId"})", "application/json");
                return;
            }
        }
        std::lock_guard<std::mutex> lock(dataMutex);
        json data = json::array();
        for (const auto& [id, row] : bookings)
            if (row->customerId == customerId) data.push_back(bookingJson(*row));
        res.set_content(data.dump(), "application/json");
    });

    server.Post("/api/bookings", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            const auto body = json::parse(req.body);
            const int customerId = body.value("customerId", 301);
            const int providerId = body.at("providerId").get<int>();
            const std::string customerName = body.value("customerName", "FixFleet Customer");
            const std::string service = body.at("service").get<std::string>();
            const std::string date = body.at("date").get<std::string>();
            const std::string time = body.value("time", "");
            const std::string location = body.at("location").get<std::string>();
            const double amount = body.at("amount").get<double>();

            auto provider = std::find_if(providers.begin(), providers.end(),
                [&](const ProviderRow& p) { return p.id == providerId; });
            if (provider == providers.end()) {
                res.status = 404;
                res.set_content(R"({"error":"Provider not found"})", "application/json");
                return;
            }
            if (service.empty() || date.empty() || location.empty() || amount <= 0) {
                res.status = 400;
                res.set_content(R"({"error":"Service, date, location and a positive amount are required"})", "application/json");
                return;
            }

            std::lock_guard<std::mutex> lock(dataMutex);
            const int id = nextBookingId++;
            auto row = std::make_unique<BookingRow>(id, customerId, providerId, customerName,
                provider->name, service, date, time, location, amount);
            row->domain->createBooking(service);
            json response = bookingJson(*row);
            bookings.emplace(id, std::move(row));
            res.status = 201;
            res.set_content(response.dump(), "application/json");
        } catch (const std::exception& ex) {
            res.status = 400;
            res.set_content(json{{"error", ex.what()}}.dump(), "application/json");
        }
    });

    server.Put(R"(/api/bookings/(\d+)/(accept|reject|cancel|complete))",
        [&](const httplib::Request& req, httplib::Response& res) {
            try {
                const int id = std::stoi(req.matches[1]);
                const std::string action = req.matches[2];
                std::lock_guard<std::mutex> lock(dataMutex);
                auto it = bookings.find(id);
                if (it == bookings.end()) {
                    res.status = 404;
                    res.set_content(R"({"error":"Booking not found"})", "application/json");
                    return;
                }
                BookingRow& row = *it->second;
                if (action == "accept") {
                    auto p = providerObjects.find(row.providerId);
                    if (p != providerObjects.end()) p->second->acceptRequest();
                    row.domain->confirmBooking();
                } else if (action == "reject") {
                    auto p = providerObjects.find(row.providerId);
                    if (p != providerObjects.end()) p->second->rejectRequest();
                    row.domain->updateStatus("Rejected");
                } else if (action == "cancel") {
                    row.domain->cancelBooking();
                } else {
                    row.domain->updateStatus("Completed");
                }
                res.set_content(bookingJson(row).dump(), "application/json");
            } catch (const std::exception& ex) {
                res.status = 400;
                res.set_content(json{{"error", ex.what()}}.dump(), "application/json");
            }
        });

    std::cout << "FixFleet API listening at http://localhost:18080\n";
    std::cout << "Press Ctrl+C to stop.\n";
    server.listen("0.0.0.0", 18080);
    return 0;
}
