import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Player } from "@remotion/player";
import type { PlayerRef } from "@remotion/player";
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

  // Pause the film while it is off screen.
  const boxRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerRef>(null);
  const inView = useInView(boxRef, { amount: 0.25 });
  const seen = useRef(false);
  useEffect(() => {
    const player = playerRef.current;
    if (!player || reduced) return;
    if (inView) {
      // The first time it appears, autoPlay is already running it.
      if (seen.current) {
        player.play();
      }
      seen.current = true;
    } else if (seen.current) {
      player.pause();
    }
  }, [inView, reduced]);

  return (
    <figure>
      <div className="aspect-[640/560] w-full" aria-hidden ref={boxRef}>
        <Player
          ref={playerRef}
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
