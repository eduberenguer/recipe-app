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
import { Unity } from "@/types/recipes";
import { useState } from "react";

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
  ingredientsList: { name: string; quantity: number; unity: Unity }[];
};

export default function PlannerCalendar({
  events,
  onEventAdd,
  onEventDelete,
  onEventMove,
  ingredientsList,
}: PlannerCalendarProps) {
  const router = useRouter();
  const contextUserInteraction = useContext<UserInteractionsContextType | null>(
    UserInteractionsContext
  );
  const calendarRef = useRef(null);

  const [checked, setChecked] = useState<string[]>([]);

  const toggleChecked = (name: string) => {
    setChecked((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

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
            if (onEventDelete)
              onEventDelete(eventInfo.event as unknown as CalendarEvent);
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
      <div id="external-recipes" className="w-0.6/4">
        <h3 className="font-bold mb-2">Your favorites recipes:</h3>
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
      <div className="flex-1 w-3/4">
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
              onEventMove(info.event as unknown as CalendarEvent);
            }
          }}
        />
      </div>
      <div className="w-0.5/4 bg-white rounded-2xl shadow p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
          <span className="text-2xl">🛒</span>
          Ingredients to buy:
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {ingredientsList.map((ingredient) => (
            <li
              key={ingredient.name}
              className={`flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 text-gray-800 cursor-pointer transition ${
                checked.includes(ingredient.name) ? "opacity-60" : ""
              }`}
              onClick={() => toggleChecked(ingredient.name)}
            >
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition ${
                  checked.includes(ingredient.name)
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-gray-400 bg-white"
                }`}
              >
                {checked.includes(ingredient.name) && (
                  <span className="text-white text-base">✔️</span>
                )}
              </span>
              <span
                className={`ml-1 ${
                  checked.includes(ingredient.name) ? "line-through" : ""
                }`}
              >
                {ingredient.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
