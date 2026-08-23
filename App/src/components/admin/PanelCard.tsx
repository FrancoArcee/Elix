import Image from "next/image";
import Link from "next/link";

type PanelCardProps = {
  title: string;
  description: string;
  href?: string;
};

function CardContent({ title, description }: Omit<PanelCardProps, "href">) {
  return (
    <>
      <div className="flex min-w-0 flex-col items-start">
        <h2 className="font-serif text-[18px] font-bold leading-[18px] text-ink">
          {title}
        </h2>
        <p className="pt-1 text-[10px] font-medium leading-[16.25px] text-muted">
          {description}
        </p>
      </div>
      <span className="flex shrink-0 items-start pl-4">
        <Image
          src="/icons/icon-chevron-right.svg"
          alt=""
          width={14}
          height={14}
          className="size-[14px]"
        />
      </span>
    </>
  );
}

export default function PanelCard({
  title,
  description,
  href,
}: PanelCardProps) {
  const classes =
    "flex w-full items-center justify-between gap-4 border border-ink/10 bg-background px-6 py-6 text-left transition-colors md:px-8";

  if (!href) {
    return (
      <div className={`${classes} cursor-default`}>
        <CardContent title={title} description={description} />
      </div>
    );
  }

  return (
    <Link href={href} className={`${classes} hover:border-ink/35`}>
      <CardContent title={title} description={description} />
    </Link>
  );
}
