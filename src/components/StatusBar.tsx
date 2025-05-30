
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface StatusBarProps {
  lastUpdated: string;
  nextUpdateIn: number;
  onRefresh: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ lastUpdated, nextUpdateIn, onRefresh }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-betting-darkPurple border-4 border-betting-tertiaryPurple rounded-md text-sm">
      <div className="flex items-center">
        <div className="flex items-center border-r border-betting-tertiaryPurple pr-3 mr-3">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-300">Live</span>
        </div>
        <span className="text-gray-400">
          Last updated: <span className="text-white">{lastUpdated}</span>
        </span>
        <span className="text-gray-400 ml-4">
          Next update in: <span className="text-white">{nextUpdateIn}s</span>
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-gray-300 hover:text-white">
              Actions <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-betting-darkPurple border-betting-tertiaryPurple">
            <DropdownMenuLabel className="text-white">Quick Links</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-betting-tertiaryPurple" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white">
                <Link to="/admin" className="w-full">
                  Admin Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white">
                <Link to="/results/all" className="w-full">
                  Race Results
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white">
                <Link to="/quantum-rankings" className="w-full">
                  Quantum 5D Rankings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-betting-tertiaryPurple" />
            <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white">
              <button className="w-full text-left" onClick={onRefresh}>
                Refresh Now
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 border-betting-tertiaryPurple text-white hover:bg-betting-tertiaryPurple/20" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StatusBar;
