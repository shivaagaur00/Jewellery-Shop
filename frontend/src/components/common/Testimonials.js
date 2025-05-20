import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Fashion Blogger',
      content: 'The quality of jewelry at Jewelers is unmatched. I always get compliments whenever I wear their pieces.',
      rating: 5
    },
    {
      id: 2,
      name: 'Rahul Mehta',
      role: 'Happy Customer',
      content: 'Bought a gold chain for my wife\'s anniversary and she absolutely loved it! Excellent craftsmanship.',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Ananya Patel',
      role: 'Jewelry Enthusiast',
      content: 'Their silver collection is so elegant and affordable. I\'ve purchased multiple items and all are top quality.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-amber-50 p-8 rounded-lg shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(testimonial.rating) ? (
                      <StarIcon key={i} className="text-amber-400" />
                    ) : testimonial.rating % 1 !== 0 && i === Math.floor(testimonial.rating) ? (
                      <StarHalfIcon key={i} className="text-amber-400" />
                    ) : (
                      <StarIcon key={i} className="text-gray-300" />
                    )
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition">
              <ArrowBackIosIcon fontSize="small" />
            </button>
            <button className="p-2 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition">
              <ArrowForwardIosIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;