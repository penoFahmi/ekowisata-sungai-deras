import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { Camera, Download, Eye, Heart } from "lucide-react";

interface ProfileHeaderProps {
    user: User;
    stats: {
        totalPhotos: number;
        totalLikes: number;
        totalDownloads: number;
        totalViews: number;
    };
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
    const statItems = [
        { label: 'Total Foto', value: stats.totalPhotos, icon: Camera },
        { label: 'Total Dilihat', value: stats.totalViews, icon: Eye },
        { label: 'Total Disukai', value: stats.totalLikes, icon: Heart },
        { label: 'Total Unduhan', value: stats.totalDownloads, icon: Download },
    ];

    return (
        <>
            {/* Profile Header */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-lg">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {statItems.map((item, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-md">
                        <item.icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-2xl font-bold text-gray-800">{item.value.toLocaleString('id-ID')}</p>
                        <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
