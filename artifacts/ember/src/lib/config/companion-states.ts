export type CompanionState =
  | "present"
  | "hopeful"
  | "worried"
  | "grieving"
  | "dormant";

export interface CompanionStateConfig {
  id: CompanionState;
  label: string;
  description: string;
  message: string;
  glyph: string;
  animationHint: "pulse" | "float" | "shake" | "fade" | "still";
}

export const COMPANION_STATES: Record<CompanionState, CompanionStateConfig> = {
  present: {
    id: "present",
    label: "Present",
    description: "Your companion stands close, grounded and warm.",
    message: "I'm right here with you. You're doing it.",
    glyph: "♥",
    animationHint: "pulse",
  },
  hopeful: {
    id: "hopeful",
    label: "Hopeful",
    description: "Your companion looks ahead with quiet optimism.",
    message: "Something is building. I can feel it.",
    glyph: "◇",
    animationHint: "float",
  },
  worried: {
    id: "worried",
    label: "Worried",
    description: "Your companion grows restless, watching for your return.",
    message: "I've been waiting. Please come back.",
    glyph: "◈",
    animationHint: "shake",
  },
  grieving: {
    id: "grieving",
    label: "Grieving",
    description: "Your companion mourns what was nearly built.",
    message: "I remember what this felt like when it was alive.",
    glyph: "◉",
    animationHint: "fade",
  },
  dormant: {
    id: "dormant",
    label: "Dormant",
    description: "Your companion has gone still, waiting in the dark.",
    message: "...",
    glyph: "○",
    animationHint: "still",
  },
};

export function computeCompanionState(
  environmentState: import("./environment-states").EnvironmentState
): CompanionState {
  const map: Record<
    import("./environment-states").EnvironmentState,
    CompanionState
  > = {
    thriving: "present",
    stable: "hopeful",
    struggling: "worried",
    critical: "grieving",
    dormant: "dormant",
  };
  return map[environmentState];
}
