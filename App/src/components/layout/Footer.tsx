import Image from "next/image";
import { getPublicContacts } from "@/lib/public-data";
import LegalFooterLinks from "./LegalFooterLinks";

const SOCIAL_ICON_MAP: Record<string, string> = {
  Facebook: "/icons/icon-facebook.svg",
  Instagram: "/icons/icon-instagram.svg",
  WhatsApp: "/icons/icon-whatsapp.svg",
  TikTok: "/icons/icon-tiktok.svg",
  Twitter: "/icons/icon-x.svg",
  X: "/icons/icon-x.svg",
  YouTube: "/icons/icon-youtube.svg",
  Telegram: "/icons/icon-telegram.svg",
  Pinterest: "/icons/icon-pinterest.svg",
  Discord: "/icons/icon-discord.svg",
  Email: "/icons/icon-email.svg",
  Teléfono: "/icons/icon-phone.svg",
};

function buildSocialHref(application: string, value: string): string {
  const lower = application.toLowerCase();
  if (lower === "whatsapp") {
    const phone = value.replace(/[^0-9]/g, "");
    return `https://wa.me/${phone}`;
  }
  if (lower === "instagram") {
    return `https://instagram.com/${value.replace(/^@/, "")}`;
  }
  if (lower === "tiktok") {
    return `https://tiktok.com/@${value.replace(/^@/, "")}`;
  }
  if (lower === "twitter" || lower === "x") {
    return `https://x.com/${value.replace(/^@/, "")}`;
  }
  if (lower === "facebook") {
    return `https://facebook.com/${value.replace(/^@/, "")}`;
  }
  if (lower === "telegram") {
    const username = value.replace(/^https?:\/\/(t\.me|telegram\.me)\//, "").replace(/^@/, "");
    return `https://t.me/${username}`;
  }
  if (lower === "youtube") {
    return value.startsWith("http") ? value : `https://youtube.com/${value.replace(/^@/, "")}`;
  }
  if (lower === "email") {
    return `mailto:${value}`;
  }
  if (lower === "teléfono" || lower === "telefono" || lower === "phone") {
    return `tel:${value.replace(/[^0-9+]/g, "")}`;
  }
  return value.startsWith("http") ? value : `https://${value}`;
}

type FooterProps = {
  contacts?: Awaited<ReturnType<typeof getPublicContacts>>;
};

export default async function Footer({ contacts: contactsProp }: FooterProps) {
  const contacts = contactsProp ?? await getPublicContacts();

  const socialContacts = contacts.filter(
    (c) => SOCIAL_ICON_MAP[c.application]
  );

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
          {socialContacts.map((contact) => (
            <a
              key={contact.id}
              href={buildSocialHref(contact.application, contact.value)}
              aria-label={contact.application}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-[32px] items-center justify-center border border-background/15 transition-colors hover:border-background/40"
            >
              <Image
                src={SOCIAL_ICON_MAP[contact.application]}
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

          <LegalFooterLinks />

          <div className="flex items-center gap-4 text-[12px] text-background/35">
            <a
              href="https://diagonalstudios.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-background/70"
            >
              Desarrollado por{" "}
              <span className="font-medium text-background/55 transition-colors hover:text-background/90">
                Diagonal Studios
              </span>
            </a>
            <span>•</span>
            <a
              href="/login"
              className="flex items-center gap-1.5 transition-colors hover:text-background/70"
            >
              <Image
                src="/icons/icon-lock.svg"
                alt=""
                width={12}
                height={12}
                className="size-[12px]"
              />
              Acceso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
