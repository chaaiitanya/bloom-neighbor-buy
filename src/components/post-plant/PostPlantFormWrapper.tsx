
// This higher-level wrapper may handle form layout (i.e., card, padding), but is not strictly necessary
import React from "react";

export default function PostPlantFormWrapper({
  children,
}: { children: React.ReactNode }) {
  return (
    <form className="p-6 space-y-5">
      {children}
    </form>
  );
}
