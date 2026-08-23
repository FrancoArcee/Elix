import Image from "next/image";

const BENEFITS = [
  {
    icon: "/icons/icon-shipping.svg",
    title: "Envíos Gratis",
    subtitle: "La Plata — Casco urbano",
  },
  {
    icon: "/icons/icon-verified.svg",
    title: "Productos importados",
    subtitle: "100% auténticos",
  },
  {
    icon: "/icons/icon-chat.svg",
    title: "Cotización instantánea",
    subtitle: "Con servicio particular",
  },
];

export default function Benefits() {
  return (
    <section className="border-y border-ink/10">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-ink/10">
          {BENEFITS.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`flex items-start gap-4 px-6 py-8 md:border-t-0 ${
                index > 0 ? "border-t border-ink/10" : ""
              }`}
            >
              <Image
                src={benefit.icon}
                alt=""
                width={17}
                height={17}
                className="mt-0.5 size-[17px]"
              />
              <div>
                <p className="text-[14px] font-medium leading-5 text-ink">
                  {benefit.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-[19.5px] text-muted">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
