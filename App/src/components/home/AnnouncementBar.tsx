const ANNOUNCEMENT_SEGMENTS = [
  { type: "accent", text: "20% off" },
  { type: "muted", text: "pagando en efectivo" },
  { type: "muted", text: "en toda la colección" },
  { type: "muted", text: "Perfumes Árabes" },
  { type: "muted", text: "Body Splash" },
  { type: "accent", text: "Oferta activa" },
] as const;

function AnnouncementRow() {
  return (
    <>
      {ANNOUNCEMENT_SEGMENTS.map((segment, index) => (
        <div
          key={`${segment.text}-${index}`}
          className="flex items-center whitespace-nowrap"
        >
          <span
            className={`px-5 ${
              segment.type === "accent"
                ? "font-serif text-[16px] font-bold italic leading-6 text-background"
                : "text-[10px] uppercase leading-[15px] tracking-[2.2px] text-background/60"
            }`}
          >
            {segment.text}
          </span>
          <span className="text-[12px] leading-4 text-background/25">✦</span>
        </div>
      ))}
    </>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="w-full overflow-hidden border-b border-background/10 bg-ink py-4">
      <div className="flex w-max animate-marquee">
        <AnnouncementRow />
        <AnnouncementRow />
      </div>
    </div>
  );
}
