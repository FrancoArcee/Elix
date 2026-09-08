type AnnouncementBarProps = {
  offer: {
    discount: number;
    paymentMethod: string;
    categories: string[];
  };
};

function AnnouncementRow({ offer }: { offer: AnnouncementBarProps["offer"] }) {
  const isAllCategories = offer.categories.includes("Toda la colección");

  const segments = [
    { type: "accent", text: `${offer.discount}% off` },
    { type: "muted", text: `pagando en ${offer.paymentMethod.toLowerCase()}` },
    { type: "muted", text: isAllCategories ? "en toda la colección" : offer.categories[0] },
    { type: "accent", text: "Oferta activa" },
  ];

  return (
    <>
      {segments.map((segment, index) => (
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

export default function AnnouncementBar({ offer }: AnnouncementBarProps) {
  return (
    <div className="w-full overflow-hidden border-b border-background/10 bg-ink py-4">
      <div className="flex w-max animate-marquee">
        <AnnouncementRow offer={offer} />
        <AnnouncementRow offer={offer} />
      </div>
    </div>
  );
}
