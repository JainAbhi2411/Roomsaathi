import React from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/blogs')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {
        // Fallback to copying URL
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'Blog post link copied to clipboard',
    });
  };

  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 xl:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate('/blogs')}
                className="mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Button>

              {/* Category Badge */}
              <Badge className="mb-4 bg-primary text-primary-foreground">
                {post.category}
              </Badge>

              {/* Title */}
              <h1 className="text-3xl xl:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="ml-auto"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative h-[300px] xl:h-[500px] rounded-xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 xl:py-16">
          <div className="container mx-auto px-4">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-4xl mx-auto prose prose-lg xl:prose-xl dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.article>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 xl:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
              >
                <h2 className="text-3xl xl:text-4xl font-bold mb-8 text-center">
                  Related <span className="gradient-text">Articles</span>
                </h2>

                <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link
                        to={`/blog/${relatedPost.id}`}
                        className="block group"
                      >
                        <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-primary-foreground">
                              {relatedPost.category}
                            </Badge>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Looking for Your <span className="gradient-text">Perfect Home</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Browse thousands of verified properties in Sikar, Jaipur, and Kota
              </p>
              <div className="flex flex-col @md:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/browse')}>
                  Browse Properties
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/blogs')}>
                  Read More Articles
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
