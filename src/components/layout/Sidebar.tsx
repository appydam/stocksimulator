
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Star, 
  ShoppingCart, 
  FileText, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${collapsed ? 'w-14' : 'w-56'} flex h-screen flex-col border-r bg-background transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 h-14 border-b">
        {!collapsed && <span className="text-xl font-bold">TradeSimulate</span>}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={collapsed ? 'mx-auto' : ''}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <TooltipProvider>
          <ul className="grid gap-1 px-2">
            <SidebarItem icon={<LayoutDashboard />} label="Dashboard" to="/" collapsed={collapsed} />
            <SidebarItem icon={<LineChart />} label="Market" to="/market" collapsed={collapsed} />
            <SidebarItem icon={<Star />} label="Watchlist" to="/watchlist" collapsed={collapsed} />
            <SidebarItem icon={<ShoppingCart />} label="Orders" to="/orders" collapsed={collapsed} />
            <SidebarItem icon={<FileText />} label="Portfolio" to="/portfolio" collapsed={collapsed} />
            <SidebarItem icon={<User />} label="Profile" to="/profile" collapsed={collapsed} />
            <SidebarItem icon={<Settings />} label="Settings" to="/settings" collapsed={collapsed} />
            <SidebarItem icon={<HelpCircle />} label="Help" to="/help" collapsed={collapsed} />
          </ul>
        </TooltipProvider>
      </nav>
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="text-center text-xs text-muted-foreground">
            <p>TradeSimulate - Paper Trading</p>
            <p>v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
}

function SidebarItem({ icon, label, to, collapsed }: SidebarItemProps) {
  return (
    <li>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link 
            to={to} 
            className={`
              flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </li>
  );
}
