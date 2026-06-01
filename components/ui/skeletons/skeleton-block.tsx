interface SkeletonBlockProps {
  className?: string;
}

export default function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-md bg-slate-200/80
        before:absolute before:inset-0
        before:-translate-x-full
        before:animate-[shimmer_1.8s_infinite]
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/70
        before:to-transparent
        ${className}
      `}
    />
  );
}
