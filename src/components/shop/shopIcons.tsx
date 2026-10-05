type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export function SearchIcon({ className = "h-5 w-5" }: P) {
  return <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}

export function MenuIcon({ className = "h-6 w-6" }: P) {
  return <svg viewBox="0 0 24 24" className={className} {...base}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
}

export function DropIcon({ className = "h-8 w-8" }: P) {
  return <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg>;
}

export function ClockIcon({ className = "h-8 w-8" }: P) {
  return <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

export function TruckIcon({ className = "h-8 w-8" }: P) {
  return <svg viewBox="0 0 24 24" className={className} {...base}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></svg>;
}

export function ChatIcon({ className = "h-8 w-8" }: P) {
  return <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 5h16v11H8l-4 4z" /><path d="M8 10h8M8 13h5" /></svg>;
}
