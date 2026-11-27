"use client";
import React, { useEffect, useState } from 'react'
// @ts-ignore -- CSS side-effect imports are handled by the framework bundler.
import './Countdown.css'

function Countdown() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const target = new Date("4/11/2026 08:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setDays(d);
        setHours(h);
        setMinutes(m);
        setSeconds(s);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval); // Clear the interval on unmount
  }, [target]);


  return (
    

    <section className="timer-container" id="countdown">
        <div className="timer-group">
          <p className="countdown-heading">Unlock the Secrets of the Museum in...</p>
          <div className="countdown clock-wrapper">
            <img 
              src="/img/static/images/Group 80.png"
              alt="Countdown Clocks"
              className="clocks-image"
              loading="lazy"
              decoding="async"
            />

            {/* DAYS */}
            <p className="count-text glow days">{days}</p>

            {/* HOURS */}
            <p className="count-text glow hours">{hours}</p>

            {/* MINUTES */}
            <p className="count-text glow minutes">{minutes}</p>

            {/* SECONDS */}
            <p className="count-text glow seconds">{seconds}</p>
          </div>

      </div>
</section>
  );
}

export default Countdown;