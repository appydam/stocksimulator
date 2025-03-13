
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, User, Moon, Sun, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/utils';

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { marketOpen, cash } = useAppSelector(state => state.trading);
  const { settings } = useAppSelector(state => state.user);
  const [isDarkMode, setIsDarkMode] = useState(settings.darkMode);

  useEffect(() => {
    // Apply dark mode from Redux state on component mount
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update Redux state
    dispatch(updateSettings({ darkMode: newDarkMode }));
    
    // Toggle dark mode class on document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="hidden md:flex items-center space-x-4">
          <h1 className="text-xl font-bold tracking-tight">TradeSimulate</h1>
          <div className={`h-2 w-2 rounded-full ${marketOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-muted-foreground">
            Market {marketOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        
        <div className="hidden md:flex items-center relative max-w-sm px-4">
          <Search className="absolute left-7 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search stocks..." 
            className="pl-8 bg-muted"
          />
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Available Cash</p>
              <p className="text-lg font-bold">{formatCurrency(cash)}</p>
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
            </Button>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full border cursor-pointer"
            onClick={handleProfileClick}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
