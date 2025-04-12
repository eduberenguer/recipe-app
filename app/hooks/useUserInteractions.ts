"use client";
import { retrieveFavouritesApi } from "@/lib/api/userInteractions";
import { useReducer } from "react";
import { userInteractionsReducer } from "../context/userInteractions/userInteractionsReducer";
import { UserInteractionsTypes } from "../context/userInteractions/userInteractionsTypes";
import { Recipe } from "@/types";

export function useUserInteractions() {
  const [state, dispatch] = useReducer(userInteractionsReducer, {
    favourites: <string[]>[],
    favouritesList: <Recipe[]>[],
  });

  async function retrieveFavouritesList(userId: string) {
    const data = await retrieveFavouritesApi(userId);

    if (data) {
      dispatch({
        type: UserInteractionsTypes.SET_FAVOURITES_LIST,
        payload: data,
      });
    }

    return data;
  }

  return {
    stateFavourites: state.favourites,
    stateFavouritesList: state.favouritesList,
    retrieveFavouritesList,
  };
}
