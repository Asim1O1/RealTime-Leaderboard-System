interface SettingsPanelProps {
  settings: {
    textLength: string;
    category: string;
    gameTime: number;
  };
  handleSettingsChange: (key: string, value: string | number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  handleSettingsChange,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Game Settings</h2>
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <label
          htmlFor="text-length"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Text Length
        </label>
        <select
          id="text-length"
          value={settings.textLength}
          onChange={(e) => handleSettingsChange("textLength", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="short">Short (50-100 chars)</option>
          <option value="medium">Medium (100-200 chars)</option>
          <option value="long">Long (200-400 chars)</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="content-category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Content Category
        </label>
        <select
          id="content-category"
          value={settings.category}
          onChange={(e) => handleSettingsChange("category", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="motivational">Motivational</option>
          <option value="wisdom">Wisdom</option>
          <option value="famous-quotes">Famous Quotes</option>
          <option value="inspirational">Inspirational</option>
          <option value="success">Success</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="game-duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Game Duration
        </label>
        <select
          id="game-duration"
          value={settings.gameTime}
          onChange={(e) =>
            handleSettingsChange("gameTime", Number.parseInt(e.target.value))
          }
          className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
          <option value={120}>120 seconds</option>
        </select>
      </div>
    </div>
  </div>
);
