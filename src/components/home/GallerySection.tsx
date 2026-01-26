import { motion } from 'motion/react';

const galleryImages = [
  {
    id: 1,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/dbe1c78c-1bf2-4495-aabd-c430ff2673ec.jpg',
    alt: 'Modern PG room interior',
    className: 'col-span-2 row-span-2',
  },
  {
    id: 2,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/4568e370-e49d-40d3-aed0-d3b58a91b3cc.jpg',
    alt: 'Hostel common area',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 3,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/5c5faa7b-6de4-4eb3-ba42-f74cc6f00ff1.jpg',
    alt: 'Clean apartment bedroom',
    className: 'col-span-1 row-span-2',
  },
  {
    id: 4,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/014b602e-5e43-4b1b-8b3d-0ef9ad431032.jpg',
    alt: 'Cozy PG accommodation',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 5,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/1ce2d5e7-1a97-41c7-a850-4e8e59330042.jpg',
    alt: 'Furnished living room',
    className: 'col-span-2 row-span-1',
  },
  {
    id: 6,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/89876579-a137-4f7e-8d0c-dce104f2f7ca.jpg',
    alt: 'Student hostel room',
    className: 'col-span-1 row-span-2',
  },
  {
    id: 7,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/f8f38561-70bb-4643-8fad-5318ab4e1982.jpg',
    alt: 'Recreation room',
    className: 'col-span-1 row-span-1',
  },
  {
    id: 8,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/4351e201-fabe-4a3a-a321-59c51c64de5c.jpg',
    alt: 'PG dining area',
    className: 'col-span-1 row-span-1',
  },
];

export default function GallerySection() {
  return (
    <section className="py-12 xl:py-20 px-4 xl:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 xl:mb-12"
        >
          <h2 className="text-3xl xl:text-4xl font-bold mb-3 xl:mb-4">
            Our <span className="text-primary">Gallery</span>
          </h2>
          <p className="text-muted-foreground text-base xl:text-lg max-w-2xl mx-auto">
            Explore our collection of beautiful accommodations and spaces
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 auto-rows-[150px] xl:auto-rows-[200px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${image.className} group relative overflow-hidden rounded-2xl xl:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300`}
            >
              {/* Image with overlay */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Text overlay on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 xl:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm xl:text-base">
                    {image.alt}
                  </p>
                </div>
              </div>

              {/* Decorative corner cutout effect */}
              <div className="absolute top-0 right-0 w-8 h-8 xl:w-12 xl:h-12 bg-primary/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 xl:mt-12"
        >
          <p className="text-muted-foreground text-sm xl:text-base">
            Want to see more? Browse our complete property listings
          </p>
        </motion.div>
      </div>
    </section>
  );
}
