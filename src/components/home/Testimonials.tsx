
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    text: "Our stay at the oceanfront villa was beyond expectations. The attention to detail and the stunning views made our anniversary truly special. We'll definitely be booking with AurumEscape again!",
    rating: 5,
  },
  {
    id: 2,
    name: "David Chen",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    text: "The mountain cabin exceeded our expectations. It was immaculately clean, well-stocked, and the host was incredibly responsive. Perfect for our family getaway in nature.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Martinez",
    location: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    text: "As a frequent traveler, I can say that AurumEscape offers some of the most unique and luxurious properties I've ever stayed in. The booking process was seamless, and the 24/7 concierge was a fantastic touch.",
    rating: 4.5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-aurum-navy text-white">
      <div className="aurum-container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">What Our Guests Say</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Authentic experiences from travelers who have enjoyed extraordinary stays with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-aurum-navy border-aurum-gold/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-300">{testimonial.location}</p>
                  </div>
                </div>

                <div className="mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-aurum-gold">
                      {i < Math.floor(testimonial.rating) ? "★" : i < testimonial.rating ? "✬" : "☆"}
                    </span>
                  ))}
                </div>

                <p className="text-gray-200 italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
