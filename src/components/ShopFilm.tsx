import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Player } from "@remotion/player";
import type { PlayerRef } from "@remotion/player";
import { WorkOrderClose, WO_DURATION, WO_FPS, WO_HEIGHT, WO_WIDTH } from "./remotion/WorkOrderClose";

/* Embeds the work-order Remotion composition. Loops for most visitors;
   reduced-motion users see the finished frame, paused. */
export function ShopFilm() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause the film while it is off screen, and replay it from the top on return.
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
        player.seekTo(0);
        player.play();
      }
      seen.current = true;
    } else if (seen.current) {
      player.pause();
    }
  }, [inView, reduced]);

  return (
    <figure>
      <div className="aspect-[640/600] w-full" aria-hidden ref={boxRef}>
        <Player
          ref={playerRef}
          key={reduced ? "still" : "play"}
          component={WorkOrderClose}
          durationInFrames={WO_DURATION}
          fps={WO_FPS}
          compositionWidth={WO_WIDTH}
          compositionHeight={WO_HEIGHT}
          style={{ width: "100%", height: "100%" }}
          autoPlay={!reduced}
          loop={!reduced}
          initialFrame={reduced ? WO_DURATION - 30 : 0}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          acknowledgeRemotionLicense
        />
      </div>
      <figcaption className="label text-muted mt-3 flex justify-between gap-4">
        <span>Fig. 4 — One repair order, priced and on the books</span>
        <span>Demo data</span>
      </figcaption>
      <p className="sr-only">
        Illustration: a demo repair order for a heavy-duty truck. Labor and parts lines are totaled, parts
        margin, technician efficiency, and job gross profit are calculated, and the order is stamped closed
        and synced to QuickBooks.
      </p>
    </figure>
  );
}
