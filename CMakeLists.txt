
cmake_minimum_required(VERSION 3.20)
project(FixFleetApi LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  cpp-httplib
  GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
  GIT_TAG v0.18.3
)
FetchContent_Declare(
  nlohmann_json
  GIT_REPOSITORY https://github.com/nlohmann/json.git
  GIT_TAG v3.11.3
)
FetchContent_MakeAvailable(cpp-httplib nlohmann_json)

add_executable(fixfleet_api api_server.cpp)
target_include_directories(fixfleet_api PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_link_libraries(fixfleet_api PRIVATE httplib::httplib nlohmann_json::nlohmann_json)
if(WIN32)
  target_link_libraries(fixfleet_api PRIVATE ws2_32)
endif()
