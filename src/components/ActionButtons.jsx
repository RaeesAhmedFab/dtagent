import { RefreshCw, Pause, Play, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionButtons = ({ onRefresh, onPause, onSettings, onDelete, isPaused = false }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 cursor-pointer"
        onClick={onPause}
      >
        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
        onClick={onSettings}
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActionButtons;