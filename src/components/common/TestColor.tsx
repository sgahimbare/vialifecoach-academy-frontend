import React from "react";

const colors = [
  // ==== Brand Colors ====
  { name: "--color-primary", label: "Primary" },
  { name: "--color-primary-dark", label: "Primary Dark" },
  { name: "--color-primary-light", label: "Primary Light" },
  { name: "--color-primary-bg", label: "Primary BG" },
  { name: "--color-primary-soft", label: "Primary Soft" },
  { name: "--color-primary-soft-text", label: "Primary Soft Text" },

  { name: "--color-accent-purple", label: "Accent Purple" },
  { name: "--color-accent-purple-light", label: "Accent Purple Light" },
  { name: "--color-accent-pink", label: "Accent Pink" },
  { name: "--color-accent-green", label: "Accent Green" },

  // ==== Status Colors ====
  { name: "--color-danger", label: "Danger" },
  { name: "--color-warning", label: "Warning" },
  { name: "--color-success", label: "Success" },

  // ==== Neutrals ====
  { name: "--color-white", label: "White" },
  { name: "--color-gray-50", label: "Gray 50" },
  { name: "--color-gray-100", label: "Gray 100" },
  { name: "--color-gray-200", label: "Gray 200" },
  { name: "--color-gray-300", label: "Gray 300" },
  { name: "--color-gray-400", label: "Gray 400" },
  { name: "--color-gray-500", label: "Gray 500" },
  { name: "--color-gray-600", label: "Gray 600" },
  { name: "--color-gray-900", label: "Gray 900" },

  // ==== ShadCN Tokens ====
  { name: "--background", label: "Background" },
  { name: "--foreground", label: "Foreground" },
  { name: "--card", label: "Card" },
  { name: "--card-foreground", label: "Card Foreground" },
  { name: "--popover", label: "Popover" },
  { name: "--popover-foreground", label: "Popover Foreground" },
  { name: "--primary", label: "Primary (Token)" },
  { name: "--primary-foreground", label: "Primary Foreground" },
  { name: "--secondary", label: "Secondary" },
  { name: "--secondary-foreground", label: "Secondary Foreground" },
  { name: "--muted", label: "Muted" },
  { name: "--muted-foreground", label: "Muted Foreground" },
  { name: "--accent", label: "Accent" },
  { name: "--accent-foreground", label: "Accent Foreground" },
  { name: "--destructive", label: "Destructive" },
  { name: "--destructive-foreground", label: "Destructive Foreground" },
  { name: "--border", label: "Border" },
  { name: "--input", label: "Input" },
  { name: "--ring", label: "Ring" },
];

export function TestColor() {
  return (
    <section className="py-10 px-6">
      <h2 className="text-2xl font-bold mb-8">🎨 Design System Colors</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {colors.map((c) => (
          <div
            key={c.name}
            className="rounded-xl overflow-hidden shadow border border-border"
          >
            {/* Color Swatch */}
            <div
              className="h-20"
              style={{ backgroundColor: `var(${c.name})` }}
            />

            {/* Info */}
            <div className="p-4 text-sm">
              <div className="font-semibold">{c.label}</div>
              <div className="text-muted-foreground">{c.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
