import Image from "next/image";
import Link from "next/link";

const SOCIAL_ICONS = [
  { src: "/icons/icon-instagram.svg", alt: "Instagram" },
  { src: "/icons/icon-facebook.svg", alt: "Facebook" },
  { src: "/icons/icon-whatsapp.svg", alt: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="bg-ink px-4 pb-8 pt-14 md:px-6">
      <div className="mx-auto w-full max-w-[1280px]">
        <p className="font-serif text-[20px] font-bold tracking-[5px] text-background">
          ELIX
        </p>

        <p className="max-w-[384px] pt-3 text-[14px] leading-[22.75px] text-background/55">
          Especialistas en perfumería árabe y fragancias de autor. Traemos el
          arte de Oriente Medio a toda Argentina.
        </p>

        <div className="flex gap-3 pt-6">
          {SOCIAL_ICONS.map((icon) => (
            <a
              key={icon.alt}
              href="#"
              aria-label={icon.alt}
              className="flex size-[32px] items-center justify-center border border-background/15 transition-colors hover:border-background/40"
            >
              <Image
                src={icon.src}
                alt=""
                width={13}
                height={13}
                className="size-[13px]"
              />
            </a>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/10 pt-6 md:flex-row md:gap-4">
          <p className="text-[12px] text-background/35">
            © 2026 ELIX. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              href="#"
              className="text-[12px] text-background/35 transition-colors hover:text-background/70"
            >
              Términos y condiciones
            </Link>
            <Link
              href="#"
              className="text-[12px] text-background/35 transition-colors hover:text-background/70"
            >
              Política de privacidad
            </Link>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-[12px] text-background/35 transition-colors hover:text-background/70"
          >
            <Image
              src="/icons/icon-lock.svg"
              alt=""
              width={12}
              height={12}
              className="size-[12px]"
            />
            Acceso
          </Link>
        </div>
      </div>
    </footer>
  );
}
