import type { ReactNode } from "react";
import ImageSlot from "./ImageSlot";

export type Activity = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  tone: "wash" | "grey" | "dark" | "lavender" | "white";
  tilt: number;
  image?: string;
  icon?: "sparkle" | "microphone" | "mountain";
};

function Sparkle() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5c.6 4.6 3.9 7.9 8.5 8.5-4.6.6-7.9 3.9-8.5 8.5-.6-4.6-3.9-7.9-8.5-8.5C6.1 9.4 9.4 6.1 10 1.5Z" />
    </svg>
  );
}

function Microphone() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="7" y="1.5" width="6" height="11" rx="3" fill="currentColor" />
      <path
        d="M4 9.5a6 6 0 0 0 12 0M10 15.5v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Mountain() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M1 17 7.5 5l3.5 6 2-3L19 17Z" />
    </svg>
  );
}

const ICONS = { sparkle: Sparkle, microphone: Microphone, mountain: Mountain };

export default function ActivityCard({
  activity,
  children,
}: {
  activity: Activity;
  children?: ReactNode;
}) {
  return (
    <article
      className="activity-card"
      data-tone={activity.tone}
      style={{ "--tilt": `${activity.tilt}deg` } as React.CSSProperties}
    >
      <div className="activity-top">
        <span className="activity-number">{activity.number}</span>
        <span className="activity-icon">
          {(() => {
            const Icon = ICONS[activity.icon ?? "sparkle"];
            return <Icon />;
          })()}
        </span>
      </div>
      <div className="activity-image">
        <ImageSlot src={activity.image} label="Add photo" />
      </div>
      <div className="activity-body">
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        {children}
        <ul className="activity-tags">
          {activity.tags.map((tag, i) => (
            <li key={tag} style={{ "--tag-index": i } as React.CSSProperties}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
