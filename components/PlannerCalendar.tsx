"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useContext, useEffect, useRef } from "react";
import {
  UserInteractionsContext,
  UserInteractionsContextType,
} from "@/app/context/context";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { GripVertical, Eye } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  allDay: boolean;
}

type PlannerCalendarProps = {
  events: CalendarEvent[];
  onEventAdd: (event: Omit<CalendarEvent, "id">) => void;
  onEventDelete: (event: CalendarEvent) => void;
  onEventMove: (event: CalendarEvent) => void;
};

export default function PlannerCalendar({
  events,
  onEventAdd,
  onEventDelete,
  onEventMove,
}: PlannerCalendarProps) {
  const router = useRouter();
  const contextUserInteraction = useContext<UserInteractionsContextType | null>(
    UserInteractionsContext
  );
  const calendarRef = useRef(null);

  useEffect(() => {
    const externalRecipes = document.getElementById("external-recipes");
    if (externalRecipes) {
      new Draggable(externalRecipes, {
        itemSelector: ".fc-draggable",
        eventData: function (eventEl) {
          return {
            title: eventEl.getAttribute("data-title"),
          };
        },
      });
    }
  }, []);

  function renderEventContent(eventInfo: EventContentArg) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span>{eventInfo.event.title}</span>
        <span
          style={{ cursor: "pointer", marginLeft: 6 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onEventDelete) onEventDelete(eventInfo.event as CalendarEvent);
          }}
          title="Delete"
        >
          <X size={14} />
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-8 p-4">
      <div id="external-recipes" className="w-1/4">
        <h3 className="font-bold mb-2">Recipes to add:</h3>
        {contextUserInteraction?.favouritesRecipes.map((interaction) => (
          <div
            key={interaction.id}
            className="fc-draggable p-2 mb-2 bg-blue-100 rounded cursor-move hover:bg-blue-200 transition-shadow shadow-sm hover:shadow-md"
            data-title={interaction.title}
            onClick={() => router.push(`/details/${interaction.id}`)}
            style={{ userSelect: "none" }}
            title={`Click to view details, or drag to the calendar`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GripVertical size={16} />
                <span>{interaction.title}</span>
              </div>
              <Eye size={16} className="text-gray-600" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridWeek"
          droppable={true}
          events={events}
          editable={true}
          eventReceive={(info) => {
            const title = info.event.title;
            const start = info.event.start;

            const id = `${title}-${start?.toString()}`;

            if (events.some((ev) => ev.id === id)) {
              info.event.remove();
              return;
            }

            onEventAdd({
              title,
              start: start!,
              allDay: true,
            });
          }}
          eventContent={renderEventContent}
          height={600}
          eventDrop={function (info) {
            if (typeof onEventMove === "function") {
              onEventMove(info.event as CalendarEvent);
            }
          }}
        />
      </div>
    </div>
  );
}
