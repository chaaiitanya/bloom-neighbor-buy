
import React from "react";

const WelcomeSection = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div
    ref={ref as React.RefObject<HTMLDivElement>}
    className="flex flex-col items-center justify-center min-h-[50vh] w-full"
    style={{ minHeight: "50svh" }}
  >
    <h1 className="text-4xl md:text-5xl font-extrabold text-green-100 mb-4 text-center drop-shadow-lg select-none">
      Sproutsly
    </h1>
  </div>
));

export default WelcomeSection;
