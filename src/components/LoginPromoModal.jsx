import { useState } from "react";
import { useApp } from "../context/AppContext";
import Modal from "./Modal";

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const slides = [
  {
    title: "Track your progress",
    desc: "Tick off units and PYQ questions as you finish them — your semester completion updates automatically.",
    icon: (
      <svg {...iconProps}>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: "See your CGPA instantly",
    desc: "Enter your SGPA each semester and get your CGPA, percentage, and class — plus what you need for a Distinction.",
    icon: (
      <svg {...iconProps}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: "Only your subjects",
    desc: "Set your branch and semester once — your dashboard shows exactly what's relevant to you, nothing else.",
    icon: (
      <svg {...iconProps}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: "AI answers, saved",
    desc: "Get AI explanations for PYQ questions and keep a history of everything you've asked.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
];

export default function LoginPromoModal({ open, onClose }) {
  const { signInWithGoogle } = useApp();
  const [step, setStep] = useState(0);
  const isLast = step === slides.length - 1;
  const slide = slides[step];

  function handleClose() {
    setStep(0);
    onClose();
  }

  function handleSignIn() {
    handleClose();
    signInWithGoogle("/dashboard");
  }

  return (
    <Modal open={open} onClose={handleClose} title="Why sign in?" maxWidth={420}>
      <div style={{ textAlign: "center", padding: "8px 4px 4px" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: "var(--gold-pale)",
            color: "var(--gold-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}
        >
          {slide.icon}
        </div>

        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 19,
            color: "var(--heading)",
            marginBottom: 8,
          }}
        >
          {slide.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-3)",
            lineHeight: 1.65,
            marginBottom: 22,
            maxWidth: 320,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {slide.desc}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 22 }}>
          {slides.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === step ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? "var(--gold-dim)" : "var(--border)",
                transition: "all .2s",
              }}
            />
          ))}
        </div>

        {!isLast ? (
          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => setStep((s) => s + 1)}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", gap: 8 }}
            onClick={handleSignIn}
          >
            <GoogleIcon /> Sign in with Google
          </button>
        )}
      </div>
    </Modal>
  );
}
