"use client";
import { useState } from "react";
import PlannerCalendar from "@/components/PlannerCalendar";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  allDay: boolean;
}

export default function PlannerPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  function handleEventAdd(newEvent: Omit<CalendarEvent, "id">) {
    const id = `${newEvent.title}-${newEvent.start?.toString()}`;
    setEvents((prev) => {
      const exists = prev.some((ev) => ev.id === id);
      if (exists) return prev;
      return [...prev, { ...newEvent, id }];
    });
  }

  function handleEventDelete(eventToDelete: CalendarEvent) {
    setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
  }

  function handleEventMove(movedEvent: CalendarEvent) {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === movedEvent.id ? { ...ev, start: movedEvent.start } : ev
      )
    );
  }

  console.log(events);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ml-4">Planner</h1>
      <PlannerCalendar
        events={events}
        onEventAdd={handleEventAdd}
        onEventDelete={handleEventDelete}
        onEventMove={handleEventMove}
      />
    </div>
  );
}
