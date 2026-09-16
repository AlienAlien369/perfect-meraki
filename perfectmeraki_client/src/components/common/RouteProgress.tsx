import { useEffect, useRef, useState } from "react";
import Router from "next/router";

/**
 * A thin top-of-page progress bar tied to Next.js route transitions - the
 * global loader. Client-side navigations in the Pages Router are otherwise
 * silent, which reads as an unresponsive click on a slow connection.
 */
export default function RouteProgress() {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const start = () => {
      clearTimer();
      setVisible(true);
      setWidth(15);
      timerRef.current = setInterval(() => {
        setWidth((w) => (w < 85 ? w + (85 - w) * 0.1 : w));
      }, 150);
    };

    const done = () => {
      clearTimer();
      setWidth(100);
      window.setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 200);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", done);
    Router.events.on("routeChangeError", done);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", done);
      Router.events.off("routeChangeError", done);
      clearTimer();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[2000] h-[3px] bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-green transition-[width] duration-200 ease-out shadow-[0_0_8px_var(--color-green)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
