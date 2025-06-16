import React from "react";

interface KeyboardHelpProps {
  onClose: () => void;
}

export const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ onClose }) => (
  <div
    className="p-6 rounded-lg"
    style={{
      color: "var(--text-primary)",
      background: "var(--card-background)",
      border: "1px solid var(--card-border)",
      boxShadow: "var(--shadow-lg)",
    }}
  >
    <div className="flex justify-between items-center mb-4">
      <h3
        className="text-lg font-bold"
        style={{
          color: "var(--heading)",
        }}
      >
        Keyboard Shortcuts
      </h3>
      <button
        onClick={onClose}
        className="focus:outline-none p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        style={{
          color: "var(--text-tertiary)",
        }}
        aria-label="Close help"
      >
        ✕
      </button>
    </div>
    <div
      className="space-y-3 text-sm"
      style={{
        color: "var(--text-secondary)",
      }}
    >
      {[
        { key: "Enter", desc: "Start/Restart game" },
        { key: "Ctrl + Space", desc: "Start/Pause game" },
        { key: "Ctrl + R", desc: "Reset game" },
        { key: "Shift + R", desc: "Quick restart" },
        { key: "Ctrl + N", desc: "New text" },
        { key: "Ctrl + S", desc: "View scores" },
        { key: "Tab", desc: "Toggle settings" },
        { key: "Ctrl + F", desc: "Focus input" },
        { key: "Esc", desc: "Pause/Close modals" },
        { key: "F1", desc: "Toggle this help" },
      ].map((item) => (
        <div
          key={item.key}
          className="flex justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span
            className="font-medium min-w-[100px]"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {item.key}
          </span>
          <span>{item.desc}</span>
        </div>
      ))}
    </div>
  </div>
);
