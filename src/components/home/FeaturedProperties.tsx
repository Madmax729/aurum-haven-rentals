
import PropertyCard, { PropertyCardProps } from "../listings/PropertyCard";

// Mock data for featured properties
const featuredProperties: PropertyCardProps[] = [
  {
    id: "1",
    title: "Luxury Villa with Ocean View",
    location: "Malibu, California",
    price: 550,
    rating: 4.98,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isSuperHost: true,
    category: "Villa",
  },
  {
    id: "2",
    title: "Modern Downtown Apartment",
    location: "New York City, New York",
    price: 320,
    rating: 4.85,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Apartment",
  },
  {
    id: "3",
    title: "Rustic Mountain Cabin",
    location: "Aspen, Colorado",
    price: 275,
    rating: 4.92,
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isSuperHost: true,
    category: "Cabin",
  },
  {
    id: "4",
    title: "Beachfront Bungalow",
    location: "Miami Beach, Florida",
    price: 410,
    rating: 4.89,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Bungalow",
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="aurum-container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our hand-picked selection of extraordinary properties from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
