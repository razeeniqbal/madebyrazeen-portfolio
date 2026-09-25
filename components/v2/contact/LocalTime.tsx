'use client';

import { useEffect, useState } from 'react';

/** Live time in Malaysia, so visitors know when a reply is realistic. Renders a static label until hydrated. */
export function LocalTime() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', weekday: 'short' });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{now ?? 'UTC+8'}</span>;
}
