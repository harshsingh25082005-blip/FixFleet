// Sample data for demo mode, used when the C++ REST API isn't running.
// The people and IDs follow main.cpp: Harsh Singh (301) books visits and
// Amit Kumar (205) is the electrician who accepts them. Booking 1001 is the
// Electrical Repair booking that main.cpp confirms.
import { isoDate, whenText } from './utils.js';

export const CURRENT_CUSTOMER = { id: 301, name: 'Harsh Singh', address: 'Geeta Residency, Gandhinagar' };
export const CURRENT_PROVIDER_ID = 205;

export const services = [
  { id: 1, name: 'Electrical Repair', pros: 'Electricians', blurb: 'Wiring, switchboards, fans, MCB trips' },
  { id: 2, name: 'Plumbing', pros: 'Plumbers', blurb: 'Leaks, taps, tanks, bathroom fittings' },
  { id: 3, name: 'Appliance Repair', pros: 'Appliance technicians', blurb: 'AC, fridge, washing machine, geyser' },
  { id: 4, name: 'Carpentry', pros: 'Carpenters', blurb: 'Doors, hinges, furniture fixes' },
  { id: 5, name: 'Painting', pros: 'Painters', blurb: 'Touch-ups, single rooms, damp patches' },
  { id: 6, name: 'Cleaning', pros: 'Cleaning crews', blurb: 'Deep cleaning, kitchens, bathrooms' },
];

// `busy` marks slots a provider has blocked in their own calendar: [dayOffset, time].
export const providers = [
  {
    id: 205, name: 'Amit Kumar', phone: '9988776655', service: 'Electrical Repair',
    experience: 5, workingHours: '09:00-18:00', rating: 4.8, jobsDone: 126, charge: 500,
    area: 'Sector 21, Kudasan', verified: true,
    skills: ['House wiring', 'Switchboards', 'Ceiling fans', 'Inverter setup'],
    about: 'Licensed electrician. Carries spare MCBs and switch plates, so most fixes finish in one visit.',
    busy: [[0, '10:00 AM'], [0, '11:30 AM'], [1, '02:00 PM'], [2, '11:30 AM']],
  },
  {
    id: 208, name: 'Sanjay Verma', phone: '9824011223', service: 'Electrical Repair',
    experience: 3, workingHours: '10:00-20:00', rating: 4.5, jobsDone: 48, charge: 400,
    area: 'Sargasan, Raysan', verified: false,
    skills: ['Fan installation', 'Light fittings', 'Doorbells'],
    about: 'Evening slots for people who are at work during the day.',
    busy: [[0, '02:00 PM'], [1, '06:00 PM']],
  },
  {
    id: 206, name: 'Priya Desai', phone: '9898123456', service: 'Plumbing',
    experience: 7, workingHours: '08:00-17:00', rating: 4.9, jobsDone: 210, charge: 400,
    area: 'Sargasan, Raysan', verified: true,
    skills: ['Leak repair', 'Tap fitting', 'Overhead tanks', 'Bathroom fittings'],
    about: 'Fixes leaks at the source and checks the line pressure before leaving.',
    busy: [[0, '09:00 AM'], [0, '02:00 PM'], [1, '10:00 AM']],
  },
  {
    id: 212, name: 'Deepak Yadav', phone: '9712345670', service: 'Plumbing',
    experience: 2, workingHours: '09:00-19:00', rating: 4.3, jobsDone: 31, charge: 350,
    area: 'Sector 7, Infocity', verified: true,
    skills: ['Blocked drains', 'Tap fitting', 'Flush repair'],
    about: 'Quick fixes for blocked drains and running flushes.',
    busy: [],
  },
  {
    id: 210, name: 'Imran Shaikh', phone: '9925098765', service: 'Appliance Repair',
    experience: 6, workingHours: '09:00-18:00', rating: 4.6, jobsDone: 154, charge: 550,
    area: 'Kudasan, Infocity', verified: true,
    skills: ['Split AC service', 'Refrigerators', 'Washing machines', 'Geysers'],
    about: 'Brings common spare parts for major AC and fridge brands.',
    busy: [[0, '11:30 AM'], [1, '09:00 AM'], [1, '10:00 AM']],
  },
  {
    id: 207, name: 'Ravi Patel', phone: '9879011122', service: 'Carpentry',
    experience: 9, workingHours: '10:00-19:00', rating: 4.7, jobsDone: 188, charge: 600,
    area: 'Infocity, Sector 7', verified: true,
    skills: ['Door alignment', 'Hinges and locks', 'Modular furniture', 'Shelves'],
    about: 'Works with modular and solid-wood furniture.',
    busy: [[0, '04:00 PM']],
  },
  {
    id: 211, name: 'Kavita Rao', phone: '9824556677', service: 'Painting',
    experience: 8, workingHours: '09:00-17:00', rating: 4.8, jobsDone: 97, charge: 700,
    area: 'Sector 21, Sector 22', verified: true,
    skills: ['Wall touch-ups', 'Damp treatment', 'Single rooms'],
    about: 'Visit includes colour matching and a written quote for the full job.',
    busy: [[1, '11:30 AM']],
  },
  {
    id: 209, name: 'Meena Joshi', phone: '9898776655', service: 'Cleaning',
    experience: 4, workingHours: '07:00-15:00', rating: 4.8, jobsDone: 142, charge: 800,
    area: 'Raysan, Kudasan', verified: true,
    skills: ['Kitchen deep clean', 'Bathrooms', 'Move-in cleaning'],
    about: 'Team of two with their own equipment and supplies.',
    busy: [[0, '09:00 AM'], [0, '10:00 AM']],
  },
];

export function initialBusySlots() {
  return providers.flatMap((p) => p.busy.map(([offset, time]) => `${p.id}|${isoDate(offset)}|${time}`));
}

export function initialBookings() {
  return [
    {
      id: 998, customerId: 101, customerName: 'Rahul Sharma', providerId: 205, service: 'Electrical Repair',
      date: isoDate(0), time: '04:00 PM', location: 'Shanti Nagar, Sector 21', amount: 500,
      status: 'Pending', paymentStatus: 'Pending',
    },
    {
      id: 999, customerId: 104, customerName: 'Neha Mehta', providerId: 205, service: 'Electrical Repair',
      date: isoDate(2), time: '09:00 AM', location: 'Swagat Rain Forest, Kudasan', amount: 500,
      status: 'Pending', paymentStatus: 'Pending',
    },
    {
      id: 1000, customerId: 101, customerName: 'Rahul Sharma', providerId: 205, service: 'Electrical Repair',
      date: isoDate(-4), time: '10:00 AM', location: 'Shanti Nagar, Sector 21', amount: 500,
      status: 'Completed', paymentStatus: 'Paid',
    },
    {
      id: 1001, customerId: 301, customerName: 'Harsh Singh', providerId: 205, service: 'Electrical Repair',
      date: isoDate(1), time: '10:00 AM', location: 'Geeta Residency, Gandhinagar', amount: 500,
      status: 'Confirmed', paymentStatus: 'Pending',
    },
    {
      id: 1002, customerId: 301, customerName: 'Harsh Singh', providerId: 206, service: 'Plumbing',
      date: isoDate(-6), time: '11:30 AM', location: 'Geeta Residency, Gandhinagar', amount: 400,
      status: 'Completed', paymentStatus: 'Paid',
    },
    {
      id: 1003, customerId: 301, customerName: 'Harsh Singh', providerId: 210, service: 'Appliance Repair',
      date: isoDate(-2), time: '02:00 PM', location: 'Geeta Residency, Gandhinagar', amount: 550,
      status: 'Cancelled', paymentStatus: 'Refunded',
    },
  ];
}

export function initialNotifications() {
  const hoursAgo = (h) => Date.now() - h * 3600 * 1000;
  return [
    {
      id: -1, audience: 'customer', read: false, at: hoursAgo(2),
      text: `Amit Kumar accepted your Electrical Repair visit for ${whenText(isoDate(1), '10:00 AM')}.`,
    },
    {
      id: -2, audience: 'customer', read: true, at: hoursAgo(26),
      text: '₹550 refund initiated for booking #1003. It reaches your account in 3 to 5 working days.',
    },
    {
      id: -3, audience: 'provider', read: false, at: hoursAgo(1),
      text: `New request from Neha Mehta: Electrical Repair ${whenText(isoDate(2), '09:00 AM')}.`,
    },
    {
      id: -4, audience: 'provider', read: false, at: hoursAgo(3),
      text: `New request from Rahul Sharma: Electrical Repair ${whenText(isoDate(0), '04:00 PM')}.`,
    },
  ];
}
