import { Users, MessageSquare, AlertTriangle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminStats = () => {
  const { getBannedUsers } = useAuth();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [bannedUsers, setBannedUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch total users
      const { count: total, error: totalError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      if (!totalError) setTotalUsers(total ?? 0);
      // Fetch banned users
      const { count: banned, error: bannedError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_banned', true);
      if (!bannedError) setBannedUsers(banned ?? 0);
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers !== null ? totalUsers.toString() : "-",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Threads",
      value: "N/A",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Reported Posts",
      value: "N/A",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Banned Users",
      value: bannedUsers !== null ? bannedUsers.toString() : "-",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
