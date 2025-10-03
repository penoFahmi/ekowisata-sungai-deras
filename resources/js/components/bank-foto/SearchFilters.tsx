import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Filter, X, Sparkles, Zap, TrendingUp } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  availableTags: string[];
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange,
  availableTags
}: SearchFiltersProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
        <Input
          placeholder="Cari produk kerajinan dan wisata..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl text-base"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px] bg-white/80 border-purple-200 rounded-xl">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">🌟 Semua Kategori</SelectItem>
            <SelectItem value="kerajinan">🏺 Kerajinan</SelectItem>
            <SelectItem value="wisata">🏖️ Wisata</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] bg-white/80 border-purple-200 rounded-xl">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                Terbaru
              </div>
            </SelectItem>
            <SelectItem value="popular">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Terpopuler
              </div>
            </SelectItem>
            <SelectItem value="downloads">
              <div className="flex items-center gap-2">
                <span className="text-purple-500">⬇️</span>
                Unduhan
              </div>
            </SelectItem>
            <SelectItem value="likes">
              <div className="flex items-center gap-2">
                <span className="text-red-500">❤️</span>
                Disukai
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="bg-white/80 border-purple-200 hover:bg-purple-50 rounded-xl">
          <Filter className="h-4 w-4 mr-2 text-purple-600" />
          Filter Lanjutan
        </Button>
      </div>

      {/* Popular Tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <p className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Tag Populer:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-300 rounded-full ${
                selectedTags.includes(tag)
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                  : "border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:scale-105"
              }`}
              onClick={() => onTagToggle(tag)}
            >
              #{tag}
              {selectedTags.includes(tag) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedTags.length > 0 || selectedCategory !== "all") && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
          <span className="text-sm text-purple-700">Filter aktif:</span>
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 rounded-full">
              {selectedCategory === "kerajinan" ? "🏺 Kerajinan" : "🏖️ Wisata"}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-purple-900"
                onClick={() => onCategoryChange("all")}
              />
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 rounded-full">
              #{tag}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-900"
                onClick={() => onTagToggle(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
