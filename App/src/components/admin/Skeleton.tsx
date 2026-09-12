type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-ink/[0.06] ${className}`}
      aria-hidden="true"
    />
  );
}
