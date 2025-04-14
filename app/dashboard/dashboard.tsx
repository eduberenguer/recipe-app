"use client";

import { useContext } from "react";
import { AuthContext } from "../context/context";

export default function Dashboard() {
  const data = useContext(AuthContext);

  return (
    <div>
      <p>{data?.user?.name}</p>
      <p>{data?.user?.email}</p>
    </div>
  );
}
