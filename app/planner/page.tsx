"use client";
import { useContext, useState } from "react";
import PlannerCalendar from "@/components/PlannerCalendar";
import { Unity } from "@/types/recipes";
import {
  UserInteractionsContext,
  UserInteractionsContextType,
} from "../context/context";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  allDay: boolean;
}

export default function PlannerPage() {
  const contextUserInteraction = useContext<UserInteractionsContextType | null>(
    UserInteractionsContext
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [ingredientsList, setIngredientsList] = useState<
    { name: string; quantity: number; unity: Unity }[]
  >([]);

  function handleEventAdd(newEvent: Omit<CalendarEvent, "id">) {
    const id = `${newEvent.title}-${newEvent.start?.toString()}`;
    setEvents((prev) => {
      const exists = prev.some((ev) => ev.id === id);
      if (exists) return prev;
      return [...prev, { ...newEvent, id }];
    });

    const recipe = contextUserInteraction?.favouritesRecipes.find(
      (recipe) => recipe.title === newEvent.title
    );
    const ingredients = recipe?.ingredients ?? [];

    setIngredientsList((prev) => {
      const combined = [...prev, ...ingredients];

      const seen = new Set<string>();
      const unique = combined.filter((item) => {
        const key = item.name.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return unique;
    });
  }

  function handleEventDelete(eventToDelete: CalendarEvent) {
    const updatedEvents = events.filter((ev) => ev.id !== eventToDelete.id);
    setEvents(updatedEvents);

    const remainingTitles = updatedEvents.map((ev) => ev.title);

    const remainingIngredients = remainingTitles
      .map((title) =>
        contextUserInteraction?.favouritesRecipes.find(
          (recipe) => recipe.title === title
        )
      )
      .filter(Boolean)
      .flatMap((recipe) => recipe!.ingredients);

    const seen = new Set<string>();
    const uniqueIngredients = remainingIngredients.filter((item) => {
      const key = item.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setIngredientsList(uniqueIngredients);
  }

  function handleEventMove(movedEvent: CalendarEvent) {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === movedEvent.id ? { ...ev, start: movedEvent.start } : ev
      )
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ml-4">Planner</h1>
      <PlannerCalendar
        events={events}
        onEventAdd={handleEventAdd}
        onEventDelete={handleEventDelete}
        onEventMove={handleEventMove}
        ingredientsList={ingredientsList}
      />
    </div>
  );
}
