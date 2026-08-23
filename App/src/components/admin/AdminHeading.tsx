import Link from "next/link";
import AdminButton from "./AdminButton";

type AdminHeadingProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

const ACTION_CLASSES =
  "inline-flex items-center justify-center px-4 py-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] bg-ink border border-ink text-background transition-colors hover:bg-ink/85";

export default function AdminHeading({
  title,
  actionLabel,
  actionHref,
  onAction,
}: AdminHeadingProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="font-serif text-[24px] font-bold leading-8 text-ink">
        {title}
      </h2>
      {actionLabel &&
        (actionHref ? (
          <Link href={actionHref} className={ACTION_CLASSES}>
            {actionLabel}
          </Link>
        ) : (
          <AdminButton
            variant="primary"
            className="px-4 py-2"
            onClick={onAction}
          >
            {actionLabel}
          </AdminButton>
        ))}
    </div>
  );
}
