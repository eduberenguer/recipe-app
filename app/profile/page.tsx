"use client";

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

export default function Profile() {
  const data = useContext(AuthContext);

  console.log("profile", data?.user);
  return (
    <div>
      <p>{data?.user?.name}</p>
      <p>{data?.user?.email}</p>
    </div>
  );
}
