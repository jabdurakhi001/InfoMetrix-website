import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import {
  MonthEndClose,
  CLOSE_DURATION,
  CLOSE_FPS,
  CLOSE_HEIGHT,
  CLOSE_WIDTH,
} from "./remotion/MonthEndClose";

/* Embeds the Remotion composition. Plays and loops for most visitors; for
   reduced-motion users it shows the finished frame, paused. */
export function HeroFilm() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <figure>
      <div className="aspect-[640/560] w-full" aria-hidden>
        <Player
          key={reduced ? "still" : "play"}
          component={MonthEndClose}
          durationInFrames={CLOSE_DURATION}
          fps={CLOSE_FPS}
          compositionWidth={CLOSE_WIDTH}
          compositionHeight={CLOSE_HEIGHT}
          style={{ width: "100%", height: "100%" }}
          autoPlay={!reduced}
          loop={!reduced}
          initialFrame={reduced ? CLOSE_DURATION - 30 : 0}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          acknowledgeRemotionLicense
        />
      </div>
      <figcaption className="label text-muted mt-3 flex justify-between gap-4">
        <span>Fig. 1 — A month-end close, start to finish</span>
        <span>Demo data</span>
      </figcaption>
      <p className="sr-only">
        Illustration: a demo month-end close for a trucking company. Expenses for fuel, driver pay,
        maintenance, insurance, and tolls are totaled, cost per mile is calculated, and the month is
        stamped reconciled.
      </p>
    </figure>
  );
}
