import { useState } from "react";
import { useJourneyStore } from "@/lib/state/useJourneyStore";

interface Props {
  onCreated: () => void;
}

export function CreateJourney({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");
  const createJourney = useJourneyStore((s) => s.createJourney);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createJourney(name.trim(), intention.trim());
    onCreated();
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0A0804",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div style={{ marginBottom: "48px" }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#E8613A",
            marginBottom: "12px",
          }}
        >
          EMBER
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#F0E8E0",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: "12px",
          }}
        >
          Begin a journey
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(240,232,224,0.5)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          A journey is a commitment you make to yourself. Name it. Set your
          intention. Show up.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "8px",
            }}
          >
            Journey Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning meditation, Daily writing..."
            maxLength={60}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              color: "#F0E8E0",
              fontSize: "16px",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#E8613A55")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "8px",
            }}
          >
            Intention{" "}
            <span style={{ opacity: 0.5, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>
              (optional)
            </span>
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Why does this matter to you?"
            rows={3}
            maxLength={200}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              color: "#F0E8E0",
              fontSize: "15px",
              outline: "none",
              fontFamily: "inherit",
              resize: "none",
              lineHeight: 1.5,
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#E8613A55")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          style={{
            marginTop: "8px",
            padding: "16px",
            background: name.trim() ? "#E8613A" : "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: "12px",
            color: name.trim() ? "#FFF8F4" : "rgba(255,255,255,0.25)",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: name.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
        >
          Light the Ember
        </button>
      </form>
    </div>
  );
}
