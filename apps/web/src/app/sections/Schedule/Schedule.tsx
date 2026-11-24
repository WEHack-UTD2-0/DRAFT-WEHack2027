"use client";

import React from "react";
import "./Schedule.css";
import OrnateDivider from "@/components/OrnateDivider/Divider";

type DayKey = "Friday" | "Saturday" | "Sunday";

type ScheduleEvent = {
  id: string;
  title: string;
  description?: string;
  day: DayKey;
  start: string;
  end: string;
  type: string;
  location?: string;
  isLive?: boolean;
  accent?: string;
};

const typeColors: Record<string, string> = {
  Meal: "#F0B6D6",
  Workshop: "#A6BCFF",
  Social: "#F36F63",
  Required: "#E1D4FF",
  Logistics: "#C6DBEC",
  Sponsor: "#F0B6D6",
  Other: "#1F2A44",
};

const sampleSchedule: ScheduleEvent[] = [
  {
    id: "check-in",
    title: "Hacker Check-In & Sponsor Fair",
    description: "Arrive early, grab swag, and settle in before we kick off.",
    day: "Saturday",
    start: "8:00 AM",
    end: "11:30 AM",
    type: "Required",
    location: "ECSW Atrium",
  },
  {
    id: "team-building-meetup",
    title: "Team Building Meetup",
    description: "Join us for a fun team-building activity to kick off the hackathon!",
    day: "Saturday",
    start: "8:45 AM",
    end: "9:15 AM",
    type: "Other",
    location: "ECSW 1.365",
  },
  {
    id: "walk-ins",
    title: "Accepting Walk-Ins",
    description: "Time extended to 12:30PM for those taking the common exam",
    day: "Saturday",
    start: "9:00 AM",
    end: "11:30 AM",
    type: "Other",
    location: "ECSW Atrium",
  },
  {
    id: "opening-ceremony",
    title: "Opening Ceremony",
    description: "Welcome remarks, rules, and weekend overview.",
    day: "Saturday",
    start: "9:30 AM",
    end: "10:45 AM",
    type: "Required",
    location: "SSA Auditorium",
  },
  {
    id: "sponsor-fair",
    title: "Sponsor Fair",
    description: "Connect with sponsors, learn about opportunities, and ask questions.",
    day: "Saturday",
    start: "11:00 AM",
    end: "12:00 PM",
    type: "Sponsor",
    location: "ECSW Atrium",
  },
  {
    id: "hacking-begins",
    title: "Hacking Begins!",
    description: "",
    day: "Saturday",
    start: "11:00 AM",
    end: "",
    type: "Other",
    location: "",
  },
  {
    id: "lunch",
    title: "Lunch",
    description: "Fuel up for a full day of hacking.",
    day: "Saturday",
    start: "12:00 PM",
    end: "1:00 PM",
    type: "Meal",
    location: "Courtyard",
  },
  {
    id: "workshop-1",
    title: "[SWE] Build Your Own AI That Answers Questions from PDFs",
    description: "",
    day: "Saturday",
    start: "1:00 PM",
    end: "2:00 PM",
    type: "Workshop",
    location: "ECSW 1.355",
  },
  {
    id: "workshop-2",
    title: "[Fidelity] The impact of Cybersecurity and Threat Intelligence",
    description: "",
    day: "Saturday",
    start: "2:00 PM",
    end: "3:00 PM",
    type: "Workshop",
    location: "ECSW 1.365",
  },
  {
    id: "workshop-3",
    title: "[StateFarm] Scalability and Performance - Building Systems That Never Break A Sweat",
    description: "",
    day: "Saturday",
    start: "3:00 PM",
    end: "4:00 PM",
    type: "Workshop",
    location: "ECSW 1.355",
  },
  {
    id: "workshop-4",
    title: "[WWC] Hackathon Design Sprint: Turn Ideas into Clickable Prototypes",
    description: "",
    day: "Saturday",
    start: "4:00 PM",
    end: "5:00 PM",
    type: "Workshop",
    location: "ECSW 1.365",
  },
  {
    id: "workshop-5",
    title: "[CBRE] Beyond Leetcode - Cracking the System Design Interview",
    description: "",
    day: "Saturday",
    start: "5:00 PM",
    end: "6:00 PM",
    type: "Workshop",
    location: "ECSW 1.355",
    // isLive: true,
  },
  {
    id: "workshop-6",
    title: "[MLH] Intro to Google AI Studio and Github Copilot",
    description: "",
    day: "Saturday",
    start: "6:00 PM",
    end: "7:00 PM",
    type: "Workshop",
    location: "ECSW 1.355",
  },
  {
    id: "dinner",
    title: "Dinner",
    description: "Grab dinner and recharge.",
    day: "Saturday",
    start: "7:00 PM",
    end: "8:00 PM",
    type: "Meal",
    location: "ECSW Atrium",
  },
  {
    id: "game-hour",
    title: "GAME HOUR",
    description: "",
    day: "Saturday",
    start: "8:00 PM",
    end: "9:00 PM",
    type: "Social",
    location: "ECSW 1.365",
  },
  {
    id: "paws",
    title: "[PawsatUTD] Take a Paws",
    description: "Take a break and relax with therapy dogs",
    day: "Saturday",
    start: "9:00 PM",
    end: "10:00 PM",
    type: "Social",
    location: "ECSW 2.325",
  },
  {
    id: "activity",
    title: "Just Dance!",
    description: "Take a break and dance with others.",
    day: "Saturday",
    start: "10:00 PM",
    end: "11:30 PM",
    type: "Social",
    location: "ECSW 1.315",
  },
  {
    id: "devpost-initial",
    title: "DevPost Initial Project Submission DUE",
    description: "Create and submit your initial Devpost.",
    day: "Saturday",
    start: "11:00 PM",
    end: "",
    type: "Required",
    location: "DevPost",
  },
  {
    id: "midnight-snack",
    title: "Midnight Snack",
    description: "Grab a late-night snack and recharge.",
    day: "Saturday",
    start: "11:45 PM",
    end: "12:45 AM",
    type: "Meal",
    location: "ECSW Atrium",
  },
  {
    id: "movie",
    title: "Movie Night!",
    description: "Watch a movie and unwind.",
    day: "Sunday",
    start: "1:00 AM",
    end: "2:30 AM",
    type: "Social",
    location: "ECSW 1.315",
  },
  {
    id: "quiet-hours",
    title: "Quiet Hours",
    description: "Keep hacking or catch some sleep. Just keep it quiet!",
    day: "Sunday",
    start: "1:00 AM",
    end: "7:00 AM",
    type: "Required",
    location: "",
  },
  {
    id: "breakfast",
    title: "Breakfast",
    description: "Grab breakfast and start your day.",
    day: "Sunday",
    start: "8:00 AM",
    end: "10:00 AM",
    type: "Meal",
    location: "ECSW Atrium",
  },
  {
    id: "devpost-final",
    title: "DevPost Final Project Submission DUE",
    description: "Finalize your Devpost submission and demo link",
    day: "Sunday",
    start: "10:30 AM",
    end: "",
    type: "Required",
    location: "DevPost",
  },
  {
    id: "workshop-8",
    title: "[HackUTD] Pitching Workshop",
    description: "",
    day: "Sunday",
    start: "11:00 AM",
    end: "12:00 PM",
    type: "Workshop",
    location: "ECSW 1.355",
  },
  {
    id: "lunch-sun",
    title: "Lunch",
    description: "Grab lunch and refuel.",
    day: "Sunday",
    start: "12:00 PM",
    end: "1:00 PM",
    type: "Meal",
    location: "ECSW Atrium",
  },
  {
    id: "judging",
    title: "Judging Expo",
    description: "Present your project and demo to judges.",
    day: "Sunday",
    start: "1:00 PM",
    end: "3:00 PM",
    type: "Required",
    location: "ECSW 1.315",
  },
  {
    id: "closing-ceremony",
    title: "Closing Ceremony",
    description: "Celebrate winners and wrap up the weekend.",
    day: "Sunday",
    start: "3:30 PM",
    end: "5:00 PM",
    type: "Required",
    location: "ECSW 1.315",
  },
];

const daysInOrder: DayKey[] = ["Saturday", "Sunday"];

function groupByDay(schedule: ScheduleEvent[]) {
  return daysInOrder
    .map((day) => [day, schedule.filter((event) => event.day === day)] as const)
    .filter(([, events]) => events.length);
}

function colorFor(event: ScheduleEvent) {
  return event.accent ?? typeColors[event.type] ?? "#1F2A44";
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const num = parseInt(full, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darkenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);

  const darken = (value: number) =>
    Math.max(0, Math.round(value * (1 - amount)));

  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`;
}

const Schedule: React.FC = () => {
  return (
    <section className="schedule-section" id="Schedule">
      <div className="schedule-intro">
        <h1 className="aisle-heading">Aisle 2 · Schedule</h1>
        <OrnateDivider className="my-4" />
      </div>
    </section>
  );
};

export default Schedule;