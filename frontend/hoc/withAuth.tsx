import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return async function WithAuthWrapper(props: P) {
    const user = await currentUser();

    if (!user) {
      redirect("/login");
    }

    return <WrappedComponent {...(props as P)} user={user} />;
  };
}