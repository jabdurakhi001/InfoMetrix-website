import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
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

  return (
    <figure>
      <div className="aspect-[640/600] w-full" aria-hidden>
        <Player
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
