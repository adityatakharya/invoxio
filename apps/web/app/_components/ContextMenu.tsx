import React from 'react';
import {analyzeSentiment} from '../_api/analyzeSentiment';

interface ContextMenuProps {
  contextMenu: { show: boolean; x: number; y: number; message: string };
  closeContextMenu: () => void;
  setSentiment: (sentiment: string) => void;
  setSentimentToast: (show: boolean) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenu,
  closeContextMenu,
  setSentiment,
  setSentimentToast,
}) => {
  const handleAnalyzeSentiment = async (message: string) => {
    try {
      const result = await analyzeSentiment(message);

      setSentiment(result === 'error' ? 'Some error occurred!' : `Sentiment: ${result}`);
      setSentimentToast(true);
      closeContextMenu();
      setTimeout(() => setSentimentToast(false), 3000);

    } catch (error) {
      setSentiment('Error analyzing sentiment.');
      setSentimentToast(true);
      setTimeout(() => setSentimentToast(false), 3000);
    }
  };

  return contextMenu.show ? (
    <>
      <div
        className="context-menu absolute bg-white shadow-lg shadow-gray-800 border rounded-md z-50"
        style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
      >
        <ul>
          <li
            className="p-2 bg-gray-300 hover:bg-gray-200 cursor-pointer text-xs text-gray-800 rounded-md"
            onClick={() => handleAnalyzeSentiment(contextMenu.message)}
          >
            Analyze Sentiment
          </li>
        </ul>
      </div>
      <div onClick={closeContextMenu} className="fixed inset-0 z-30"></div>
    </>
  ) : null;
};

export default ContextMenu;
