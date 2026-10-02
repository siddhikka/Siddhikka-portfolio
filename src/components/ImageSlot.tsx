export default function ImageSlot({
  src,
  label,
  className = "",
}: {
  src?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`image-slot ${className}`}>
      {src ? <img src={src} alt="" /> : <span>{label}</span>}
    </div>
  );
}
