import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Download, Heart, Eye, Star, MoreHorizontal } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface PhotoCardProps {
  id: string;
  title: string;
  category: string;
  tags: string[];
  imageUrl: string;
  downloads: number;
  likes: number;
  views: number;
  photographer: string;
}

export function PhotoCard({
  title,
  category,
  tags,
  imageUrl,
  downloads,
  likes,
  views,
  photographer
}: PhotoCardProps) {
  const getCategoryGradient = (category: string) => {
    return category === "kerajinan"
      ? "from-amber-500 to-orange-600"
      : "from-blue-500 to-purple-600";
  };

  return (
    <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg">
            <Heart className="h-4 w-4 text-red-500" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Bottom Download Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button size="sm" className={`bg-gradient-to-r ${getCategoryGradient(category)} hover:scale-105 shadow-lg`}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`bg-gradient-to-r ${getCategoryGradient(category)} text-white border-0 shadow-lg`}>
            {category === "kerajinan" ? "🏺 Kerajinan" : "🏖️ Wisata"}
          </Badge>
        </div>

        {/* Quality Badge */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-lg">
            <Star className="h-3 w-3 mr-1 text-yellow-500" />
            HD
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="line-clamp-2 group-hover:text-purple-600 transition-colors">{title}</h3>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">📸</span>
          </div>
          <p className="text-muted-foreground text-sm">{photographer}</p>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs hover:bg-purple-50 hover:border-purple-200 transition-colors cursor-pointer">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-blue-50">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hover:text-purple-600 transition-colors">
              <Eye className="h-3 w-3" />
              <span>{views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className="h-3 w-3" />
              <span>{likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
              <Download className="h-3 w-3" />
              <span>{downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
