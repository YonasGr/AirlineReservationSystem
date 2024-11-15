#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <cstdlib>
#include <ctime>

void clearConsole() {
    #ifdef _WIN32
        system("cls");  // Windows
    #else
        system("clear");  // Linux/macOS
    #endif
}

using namespace std;

struct Flight
{
    int flightNumber;
    string departureTime;
    string arrivalTime;         // New member for arrival time
    string destination;
    int availableEconomySeats;
    int availableBusinessSeats;
};

struct Passenger
{
    string name;
    int flightNumber;
    string classType; // "Economy" or "Business"
    string ticketId;
};
const int MAX_FLIGHTS = 5;
const int MAX_ECONOMY_PASSENGERS = 10; // Maximum passengers for Economy
const int MAX_BUSINESS_PASSENGERS = 5;  // Maximum passengers for Business
Flight flights[MAX_FLIGHTS] = {
    {101, "08:00 AM", "10:00 AM", "DIRE DAWA", MAX_ECONOMY_PASSENGERS, MAX_BUSINESS_PASSENGERS},
    {102, "09:00 AM", "11:00 AM", "GONDER", MAX_ECONOMY_PASSENGERS, MAX_BUSINESS_PASSENGERS},
    {103, "10:00 AM", "12:00 PM", "BAHIR DAR", MAX_ECONOMY_PASSENGERS, MAX_BUSINESS_PASSENGERS},
    {104, "11:00 AM", "01:00 PM", "GAMBELLA", MAX_ECONOMY_PASSENGERS, MAX_BUSINESS_PASSENGERS},
    {105, "12:00 PM", "02:00 PM", "HAWASSA", MAX_ECONOMY_PASSENGERS, MAX_BUSINESS_PASSENGERS}
};
Passenger passengers[MAX_ECONOMY_PASSENGERS + MAX_BUSINESS_PASSENGERS];
int passengerCount = 0;
void displayFlights();
void bookTicket();
void cancelTicket();
void checkSeatAvailability();
void saveDataToFile();
void previewTicket(const Passenger& passenger);
void intro();
void modifyTicket();
string generateTicketId();
void showBoughtTickets();
int main() {
    char ch;
    intro();
   do {
    cout << "\t\t\t\t\t\t\t\t\t\t\t   *MAIN MENU*" << endl;
    cout << "----------------------------------------------\n";
    cout << "\n\t 1. Display Flights" << endl;
    cout << "\n\t 2. Buy Ticket" << endl;
    cout << "\n\t 3. Cancel Ticket" << endl;
    cout << "\n\t 4. Check Seat Availability" << endl;
    cout << "\n\t 5. Modify Ticket" << endl; // New option for modifying ticket
    cout << "\n\t 6. View All Bought Tickets" << endl;
    cout << "\n\t 0. Exit" << endl;
    cout << "----------------------------------------------\n";
    cout << "\n\t Enter your choice: ";
    cin >> ch;
    switch (ch) {
        case '1':
            displayFlights();
            break;
        case '2':
            bookTicket();
            break;
        case '3':
            cancelTicket();
            break;
        case '4':
            checkSeatAvailability();
            break;
        case '5': // New case for modifying ticket 
            modifyTicket();
            break;
        case '6':
            showBoughtTickets(); // Call new function
            break;
        case '0':
            cout << "\n\n\t THANK YOU FOR CHOOSING US!" << endl;
            return 0;
        default:
            cout << "Invalid choice. Please try again.\n";
    }
    cin.ignore();
    cout << "Press 'Enter' to return to the main menu: ";
    cin.get();
    clearConsole();
} while (ch != '0');
}
void cancelTicket() {
    clearConsole();
    string ticketId;
    cout << "Enter your Ticket ID to cancel: ";
    cin >> ticketId;
    for (int i = 0; i < passengerCount; i++)
        {
        if (passengers[i].ticketId == ticketId)
         {
            for (int j = 0; j < MAX_FLIGHTS; j++)
             {
                if (flights[j].flightNumber == passengers[i].flightNumber)
                 {
                    if (passengers[i].classType == "Economy")
                     {
                        flights[j].availableEconomySeats++;
                    }
                else if (passengers[i].classType == "Business")
                     {
                        flights[j].availableBusinessSeats++;
                    }
                    break;
                }
            }
            for (int k = i; k < passengerCount - 1; k++)
                {
                passengers[k] = passengers[k + 1];
            }
            passengerCount--;
            cout << "Ticket canceled successfully." << endl;
            saveDataToFile();
            return;
        }
    }

    cout << "Ticket ID not found." << endl;
}

void intro()
{
    cout << "\t\t\t\t\t\t\t\t\t\t\t\t*WELCOME TO ZZZ AIRLINES* \n\n";
    cout << " Developed by:\n";
    cout << "----------------------------------------------\n";
    cout <<  "1. Abrham Habtamu" << endl;
    cout <<  "2. Yonas Gizaw" << endl;
    cout <<  "3. Yonas Girma" << endl;
    cout <<  "4. Haset Shawel" << endl;
    cout <<  "5. Eleni Mosisa" << endl;
    cout << "----------------------------------------------\n";
    cout << "\nPress 'Enter' to get started: ";
    cin.get();
    clearConsole();
}
void displayFlights() {
	clearConsole();
    cout << "\t\t\t\t\t\t\t\t\t\t\t*Available Flights*\n\n";
    cout << "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n";
    cout << setw(10) << "Flight No" << setw(18) << "Departure Time" << setw(18) << "Arrival Time" << setw(22) << "Destination" << setw(22) << "Economy Seats" << setw(22) << "Business Seats" << endl;
    for (int i = 0; i < MAX_FLIGHTS; i++)
        {
        Flight* flightPtr = &flights[i]; // Using pointer to reference flight
        cout << setw(10) << flightPtr->flightNumber<< setw(15) << flightPtr->departureTime<< setw(20) << flightPtr->arrivalTime<< setw(20) << flightPtr->destination<< setw(20) << flightPtr->availableEconomySeats<< setw(20) << flightPtr->availableBusinessSeats << endl;
        cout << "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n";
         }
    saveDataToFile();
}

void bookTicket()
 {
    clearConsole();
    displayFlights();
    string name;
    int flightNumber;
    char classType;
    if (passengerCount >= (MAX_ECONOMY_PASSENGERS + MAX_BUSINESS_PASSENGERS))
        {
        cout << "All seats are fully booked." << endl;
        return;
    }
    clearConsole();
    cout << "Enter your name: ";
    cin.ignore();
    getline(cin, name);
    cout << "Enter flight number: ";
    cin >> flightNumber;
    for (int i = 0; i < MAX_FLIGHTS; i++)
        {
        if (flights[i].flightNumber == flightNumber)
         {
            cout << "Choose Seat Class ('1' for Economy, '2' for Business): ";
            cin >> classType;

            if (classType == '1') { // Economy Class
                if (flights[i].availableEconomySeats > 0)
                    {
                    flights[i].availableEconomySeats--;
                    passengers[passengerCount] = {name, flightNumber, "Economy", generateTicketId()};
                    previewTicket(passengers[passengerCount]);
                    passengerCount++;
                    saveDataToFile();
                }
                else
                    {
                    cout << "No available seats in Economy class." << endl;
                }
            }
            else if(classType == '2')
                 { // Business Class
                if (flights[i].availableBusinessSeats > 0)
                {
                    flights[i].availableBusinessSeats--;
                    passengers[passengerCount] = {name, flightNumber, "Business", generateTicketId()};
                    previewTicket(passengers[passengerCount]);
                    passengerCount++;
                    saveDataToFile();
                }
            else
                {
                    cout << "No available seats in Business class." << endl;
                }
            }
            else
                {
                cout << "Invalid class selection." << endl;
            }
            return;
        }
    }
    cout << "Flight number not found." << endl;
}

void checkSeatAvailability()
{
    clearConsole();
    cout << "Seat Availability:\n";
    cout << setw(10) << "Flight No" << setw(25) << "Destination" << setw(35) << "Available Economy Seats" << setw(35) << "Available Business Seats" << endl;
    for (int i = 0; i < MAX_FLIGHTS; i++)
        {
        Flight* flightPtr = &flights[i]; // Using pointer to reference flight
        cout << setw(10) << flightPtr->flightNumber
             << setw(25) << flightPtr->destination
             << setw(25) << flightPtr->availableEconomySeats
             << setw(25) << flightPtr->availableBusinessSeats << endl;
    }
}

void saveDataToFile()
 {
    ofstream outFile("passenger_data.txt");
    if (!outFile)
        {
        cout << "Error opening file!" << endl;
        return;
    }
    for (int i =  0; i < passengerCount; i++)
        {
        outFile << passengers[i].name << ","
                << passengers[i].flightNumber << ","
                << passengers[i].classType << ","
                << passengers[i].ticketId << endl;
    }
}
void previewTicket(const Passenger& passenger)
{
    cout << "\nTicket booked successfully." << endl;
    cout << "----------------------------------------------\n";
    cout << "Passenger Name: " << passenger.name << endl;
    cout << "Flight Number: " << passenger.flightNumber << endl;
    cout << "Class Type: " << passenger.classType << endl;
    cout << "Ticket ID: " << passenger.ticketId << endl;

    for (int i = 0; i < MAX_FLIGHTS; i++)
        {
        if (flights[i].flightNumber == passenger.flightNumber)
        {
            Flight* flightPtr = &flights[i]; // Using pointer to reference flight
            cout << "Departure Time: " << flightPtr->departureTime << endl;
            cout << "Arrival Time: " << flightPtr->arrivalTime << endl; // Displaying arrival time
            cout << "Destination: " << flightPtr->destination << endl;
            cout << "----------------------------------------------\n";
            break;
        }
    }
}

string generateTicketId()
{
    srand(time(0));
    string ticketId = "ZZ";
    for (int i = 0; i < 6; i++)
        {
        ticketId += (rand() % 10) + '0';
    }
    return ticketId;
}

void modifyTicket() {
    clearConsole();
    string ticketId;
    cout << "Enter your Ticket ID to modify: ";
    cin >> ticketId;

    for (int i = 0; i < passengerCount; i++) {
        if (passengers[i].ticketId == ticketId) {
			cout << "----------------------------------------------\n";
            cout << "\nCurrent details:\n\n";
            cout << "Passenger Name: " << passengers[i].name << endl;
            cout << "Flight Number: " << passengers[i].flightNumber << endl;
            cout << "Class Type: " << passengers[i].classType << "\n" << endl;
            cout << "----------------------------------------------\n";

            // Modify passenger name
            cout << "Do you want to change the passenger name? (y/n): ";
            char changeName;
            cin >> changeName;
            if (changeName == 'y' || changeName == 'Y') {
                cout << "Enter new name: ";
                cin.ignore();
                getline(cin, passengers[i].name);
            }

            // Modify class type
            cout << "Do you want to change the class type? (y/n): ";
            char changeClass;
            cin >> changeClass;
            if (changeClass == 'y' || changeClass == 'Y') {
                char newClassType;
                cout << "Choose new Seat Class ('1' for Economy, '2' for Business): ";
                cin >> newClassType;

                // Check current class and update accordingly
                if (newClassType == '1' && passengers[i].classType == "Business") {
                    for (int j = 0; j < MAX_FLIGHTS; j++) {
                        if (flights[j].flightNumber == passengers[i].flightNumber && flights[j].availableEconomySeats > 0) {
                            flights[j].availableBusinessSeats++;
                            flights[j].availableEconomySeats--;
                            passengers[i].classType = "Economy";
                            cout << "Class changed to Economy." << endl;
                            break;
                        } else {
                            cout << "No available seats in Economy." << endl;
                        }
                    }
                } else if (newClassType == '2' && passengers[i].classType == "Economy") {
                    for (int j = 0; j < MAX_FLIGHTS; j++) {
                        if (flights[j].flightNumber == passengers[i].flightNumber && flights[j].availableBusinessSeats > 0) {
                            flights[j].availableEconomySeats++;
                            flights[j].availableBusinessSeats--;
                            passengers[i].classType = "Business";
                            cout << "Class changed to Business." << endl;
                            break;
                        } else {
                            cout << "No available seats in Business." << endl;
                        }
                    }
                } else {
                    cout << "Invalid class selection or no seats available." << endl;
                }
            }
            saveDataToFile();
            return;
        }
    }
    cout << "Ticket ID not found." << endl;
}

void showBoughtTickets() {
    clearConsole();

    if (passengerCount == 0) {
        // No tickets have been bought
        cout << "You do not have any tickets bought. Please buy one first." << endl;
        return;
    }

    // Display details of all purchased tickets
    cout << "\nYour Purchased Tickets:\n";
    cout << "-------------------------\n";
    for (int i = 0; i < passengerCount; i++) {
        cout << "Ticket ID: " << passengers[i].ticketId << endl;
        cout << "Passenger Name: " << passengers[i].name << endl;
        cout << "Flight Number: " << passengers[i].flightNumber << endl;
        cout << "Class Type: " << passengers[i].classType << endl;

        // Retrieve flight details
        for (int j = 0; j < MAX_FLIGHTS; j++) {
            if (flights[j].flightNumber == passengers[i].flightNumber) {
                cout << "Departure Time: " << flights[j].departureTime << endl;
                cout << "Arrival Time: " << flights[j].arrivalTime << endl;
                cout << "Destination: " << flights[j].destination << endl;
                break;
            }
        }
        cout << "-------------------------\n";
    }
}

