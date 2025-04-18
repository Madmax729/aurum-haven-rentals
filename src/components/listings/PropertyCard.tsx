
import { Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  isSuperHost?: boolean;
  category?: string;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  rating,
  image,
  isSuperHost = false,
  category,
}: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/listing/${id}`} className="group">
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-all-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 z-10"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
          
          {isSuperHost && (
            <Badge variant="secondary" className="absolute top-2 left-2 z-10">
              Superhost
            </Badge>
          )}
          
          {category && (
            <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm z-10">
              {category}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-card-foreground line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span>{rating}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{location}</p>
          <p className="mt-2 font-semibold">
            ${price}{" "}
            <span className="font-normal text-muted-foreground text-sm">/ night</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
