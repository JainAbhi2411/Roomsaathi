import { motion } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Rocket, Users, TrendingUp, Award, Globe } from 'lucide-react';

const milestones = [
  {
    year: '2024',
    icon: Lightbulb,
    title: 'The Idea',
    description: 'RoomSaathi was born from personal experiences of struggling to find safe, affordable accommodation during college years. Our founders recognized the need for a transparent, student-friendly platform.',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
  {
    year: '2024',
    icon: Rocket,
    title: 'Launch in Sikar',
    description: 'We launched our platform in Sikar with just 50 verified properties. The response was overwhelming, with hundreds of students signing up in the first month.',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    year: '2025',
    icon: Users,
    title: 'Expansion to Jaipur & Kota',
    description: 'Recognizing the demand in major educational hubs, we expanded to Jaipur and Kota. Our user base grew to over 5,000 students and 200 property owners.',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    year: '2025',
    icon: TrendingUp,
    title: 'Mobile App Launch',
    description: 'We launched our mobile app with quick listing features and management software, making it easier than ever for owners to list properties and students to find homes on the go.',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    year: '2025',
    icon: Award,
    title: 'Verification Program',
    description: 'Introduced our comprehensive property verification program, ensuring every listing meets our quality and safety standards. This became our signature feature.',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    year: '2026',
    icon: Globe,
    title: 'Growing Strong',
    description: 'Today, we serve 10,000+ students and 500+ property owners across three cities. Our vision to become India\'s most trusted student accommodation platform is becoming a reality.',
    color: 'bg-pink-500/10 text-pink-500',
  },
];

const achievements = [
  { number: '10,000+', label: 'Students Helped' },
  { number: '500+', label: 'Partner Owners' },
  { number: '1,000+', label: 'Properties Listed' },
  { number: '95%', label: 'Satisfaction Rate' },
];

export default function OurStoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 xl:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-semibold text-sm">Our Journey</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold mb-6">
                The <span className="gradient-text">RoomSaathi</span> Story
              </h1>
              <p className="text-lg xl:text-xl text-muted-foreground">
                From a simple idea to transforming student accommodation across India - here's how we got started and where we're headed
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Beginning */}
        <section className="py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <div className="grid xl:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl xl:text-4xl font-bold mb-6">
                  It Started with a <span className="gradient-text">Problem</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Like many students, our founders faced the daunting task of finding accommodation in a new city. 
                  The process was frustrating - unreliable listings, hidden costs, unverified properties, and 
                  endless back-and-forth with brokers.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  They realized that thousands of students across India face the same challenges every year. 
                  What if there was a better way? A platform that was transparent, trustworthy, and designed 
                  specifically for students?
                </p>
                <p className="text-lg text-muted-foreground">
                  That's when RoomSaathi was born - not just as a business, but as a solution to a real problem 
                  that affects millions of students.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-hover">
                  <img
                    src="https://miaoda-site-img.s3cdn.medo.dev/images/802e7f2f-f561-40ac-94e5-f096995b231e.jpg"
                    alt="Our Journey"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 xl:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Our <span className="gradient-text">Journey</span> So Far
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Key milestones that shaped RoomSaathi into what it is today
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Line */}
                  {index !== milestones.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-border xl:left-1/2 xl:-translate-x-1/2" />
                  )}

                  <div className={`mb-12 flex flex-col xl:flex-row gap-8 items-start ${
                    index % 2 === 0 ? 'xl:flex-row' : 'xl:flex-row-reverse'
                  }`}>
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'xl:text-right' : 'xl:text-left'}`}>
                      <Card className="hover:shadow-hover transition-all duration-300">
                        <CardContent className="p-6">
                          <div className={`inline-flex items-center gap-2 mb-3 ${
                            index % 2 === 0 ? 'xl:flex-row-reverse' : ''
                          }`}>
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${milestone.color}`}>
                              <milestone.icon className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden xl:flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden xl:block flex-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Our <span className="gradient-text">Impact</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Numbers that reflect our commitment to making a difference
              </p>
            </motion.div>

            <div className="grid grid-cols-2 @md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl xl:text-4xl font-bold text-primary mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Vision */}
        <section className="py-16 xl:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl xl:text-4xl font-bold mb-6">
                The Journey <span className="gradient-text">Continues</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're just getting started. Our vision is to expand to every major educational hub in India, 
                helping millions of students find their perfect home away from home. With innovative features, 
                dedicated support, and a commitment to quality, we're building the future of student accommodation.
              </p>
              <p className="text-xl font-semibold text-primary">
                Join us on this journey. Your perfect room is waiting.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
