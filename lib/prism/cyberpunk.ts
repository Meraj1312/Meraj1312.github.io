const cyberpunkTheme = {
  plain: {
    color: "#d8ffe2",
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#5f7d63",
        fontStyle: "italic",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "#5eff8a",
        textShadow:
          "0 0 5px rgba(94,255,138,.8), 0 0 14px rgba(94,255,138,.3)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "#8cffb5",
        textShadow: "0 0 8px rgba(140,255,181,.5)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "#b8ffb8",
        textShadow: "0 0 6px rgba(184,255,184,.35)",
      },
    },
    {
      types: ["number", "boolean"],
      style: {
        color: "#7efcd0",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "#d6ffe4",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "#b8d7bf",
      },
    },
    {
      types: ["property"],
      style: {
        color: "#82ffc6",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#98ffb8",
      },
    },
    {
      types: ["constant"],
      style: {
        color: "#6fffd8",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "#d2ffd2",
      },
    },
    {
      types: ["regex"],
      style: {
        color: "#f0ffd0",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "#5eff8a",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "#8effc3",
      },
    },
    {
      types: ["attr-value"],
      style: {
        color: "#c6ffd5",
      },
    },
    {
      types: ["selector"],
      style: {
        color: "#88ffb0",
      },
    },
    {
      types: ["inserted"],
      style: {
        color: "#76ff99",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "#ff6d6d",
      },
    },
  ],
};

export default cyberpunkTheme;