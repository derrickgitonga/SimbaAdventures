import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    text: 'The Mount Kenya expedition was life-changing. Our guide James was incredibly knowledgeable and made sure we were safe every step of the way. Summit sunrise was unforgettable!',
    tour: 'Mount Kenya Summit Expedition',
  },
  {
    name: 'Michael & Lisa Chen',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    text: 'Walking alongside elephants and zebras on our Mara safari was surreal. The Maasai guides shared stories that made the experience so rich. Already planning our next trip!',
    tour: 'Maasai Mara Walking Safari',
  },
  {
    name: 'David Okonkwo',
    location: 'Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    rating: 5,
    text: 'As an African, I thought I knew adventure. Simba Adventures showed me hidden gems I never knew existed. The Lake Turkana expedition was absolutely mind-blowing.',
    tour: 'Lake Turkana Expedition',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium uppercase tracking-wider text-sm">
            Adventurer Stories
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mt-3 mb-4">
            What Our Explorers Say
          </h2>
          <div className="w-20 h-1 rounded-full bg-accent mx-auto" />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-8 border border-primary-foreground/10"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-accent mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-primary-foreground/90 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Tour Tag */}
              <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium mb-6">
                {testimonial.tour}
              </span>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-primary-foreground/60 text-sm">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
