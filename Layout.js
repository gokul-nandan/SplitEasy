import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  CreditCard, 
  AlertCircle, 
  Settings,
  Home,
  LogOut
} from "lucide-react";
import { User } from "@/entities/User";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.log("User not logged in");
      }
    };
    loadUser();
  }, []);

  const adminNavigation = [
    { title: "Dashboard", url: createPageUrl("AdminDashboard"), icon: LayoutDashboard },
    { title: "Create Expense", url: createPageUrl("CreateExpense"), icon: Receipt },
    { title: "Manage Users", url: createPageUrl("ManageUsers"), icon: Users },
    { title: "Disputes", url: createPageUrl("AdminDisputes"), icon: AlertCircle },
  ];

  const userNavigation = [
    { title: "My Expenses", url: createPageUrl("UserDashboard"), icon: Home },
    { title: "Payment History", url: createPageUrl("PaymentHistory"), icon: CreditCard },
    { title: "My Disputes", url: createPageUrl("UserDisputes"), icon: AlertCircle },
  ];

  const navigation = currentUser?.is_admin ? adminNavigation : userNavigation;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="border-r border-slate-200 bg-white">
            <SidebarHeader className="border-b border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">SplitEasy</h2>
                  <p className="text-xs text-slate-500">
                    {currentUser?.is_admin ? "Admin Panel" : "Expense Manager"}
                  </p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                  Menu
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`
                              font-medium transition-colors duration-200 rounded-lg mb-1 relative
                              ${isActive 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-slate-600 hover:bg-slate-100'
                              }
                            `}
                          >
                            <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>}
                              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 font-semibold text-sm">
                    {currentUser?.display_name?.[0] || currentUser?.full_name?.[0] || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {currentUser?.display_name || currentUser?.full_name || "User"}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500 truncate">{currentUser?.flat_number || currentUser?.email}</p>
                    {currentUser?.is_admin && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-none">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => User.logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                  <h1 className="text-lg font-bold text-slate-900">SplitEasy</h1>
                </div>
                <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 font-semibold text-xs">
                    {currentUser?.display_name?.[0] || currentUser?.full_name?.[0] || "U"}
                  </span>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-slate-50">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
