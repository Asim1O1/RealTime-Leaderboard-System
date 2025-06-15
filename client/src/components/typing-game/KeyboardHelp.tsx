import React from "react";

interface KeyboardHelpProps {
  onClose: () => void;
}

export const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Keyboard Shortcuts</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Enter</span>
          <span>Start/Restart game</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Ctrl + Space</span>
          <span>Start/Pause game</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Ctrl + R</span>
          <span>Reset game</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Shift + R</span>
          <span>Quick restart</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Ctrl + N</span>
          <span>New text</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Ctrl + S</span>
          <span>View scores</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Tab</span>
          <span>Toggle settings</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Ctrl + F</span>
          <span>Focus input</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Esc</span>
          <span>Pause/Close modals</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">F1</span>
          <span>Toggle this help</span>
        </div>
      </div>
    </div>
  </div>
);
