import { Card } from "../ui/card";
import { Camera, Users, Download, Heart, TrendingUp } from "lucide-react";

interface StatsBarProps {
  totalPhotos: number;
  totalUsers: number;
  totalDownloads: number;
  totalLikes: number;
}

export function StatsBar({ totalPhotos, totalUsers, totalDownloads, totalLikes }: StatsBarProps) {
  const stats = [
    {
      icon: Camera,
      value: totalPhotos.toLocaleString("id-ID"),
      label: "Foto Berkualitas",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Users,
      value: totalUsers.toLocaleString("id-ID"),
      label: "Fotografer Aktif",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Download,
      value: totalDownloads.toLocaleString("id-ID"),
      label: "Total Unduhan",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Heart,
      value: totalLikes.toLocaleString("id-ID"),
      label: "Disukai",
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-50 to-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className={`p-6 text-center bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div className={`text-3xl mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stat.label}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
