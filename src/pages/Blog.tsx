import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VaylanceLogo from '@/components/VaylanceLogo';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { blogArticles } from '@/content/blog';
import careerDesk from '@/assets/blog-career-desk.jpg';

export default function Blog() {
  const { slug } = useParams();
  const article = blogArticles.find((item) => item.slug === slug);
  if (slug && !article) return <NotFound />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={article ? `${article.title} | Vaylance Blog` : 'Vaylance Blog | Job Search, Resumes & Outreach'}
        description={article?.description ?? 'Practical guides to early hiring signals, honest resume tailoring and thoughtful outreach from Vaylance.'}
        canonical={`https://vaylance.com/blog${article ? `/${article.slug}` : ''}`}
      />
      <header className="border-b border-border bg-background">
        <nav aria-label="Blog navigation" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link to="/blog" aria-label="Vaylance blog" className="flex items-center gap-3 font-semibold text-xl">
            <VaylanceLogo width={34} height={34} />Vaylance
          </Link>
          <Button asChild variant="outline" className="rounded-md">
            <Link to="/dashboard">Open Vaylance <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </nav>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {article ? (
          <article className="mx-auto max-w-3xl">
            <Button asChild variant="ghost" className="mb-8 -ml-4">
              <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" />All articles</Link>
            </Button>
            <p className="mb-4 text-sm font-semibold text-primary">{article.category}</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">{article.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{article.description}</p>
            <div className="my-7 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Vaylance Editorial</span><span className="flex items-center gap-2"><Clock className="h-4 w-4" />{article.readTime}</span>
            </div>
            <div className="border-t border-border pt-8">
              {article.sections.map((section) => (
                <section key={section.heading} className="mb-10">
                  <h2 className="mb-4 text-2xl font-semibold">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph} className="mb-4 leading-8 text-muted-foreground">{paragraph}</p>)}
                </section>
              ))}
            </div>
            <div className="border-t border-border py-8">
              <h2 className="mb-5 text-xl font-semibold">Keep reading</h2>
              {blogArticles.filter((item) => item.slug !== article.slug).map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="flex items-center justify-between gap-4 border-b border-border py-4 font-medium hover:text-primary">
                  {item.title}<ArrowRight className="h-5 w-5 shrink-0" />
                </Link>
              ))}
            </div>
          </article>
        ) : (
          <>
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-sm font-semibold text-primary">THE VAYLANCE JOURNAL</p>
              <h1 className="text-4xl font-semibold sm:text-5xl">Vaylance Blog</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">A more thoughtful job search. Practical ideas for finding opportunities, telling your story and starting conversations.</p>
            </div>
            <section aria-label="Featured article" className="relative mb-12 overflow-hidden rounded-md">
              <img src={careerDesk} alt="An open notebook, newspaper and laptop on a desk" width={1536} height={1024} className="h-[430px] w-full object-cover sm:h-[390px]" />
              <div className="absolute inset-0 bg-background/90 sm:bg-background/80" />
              <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
                <p className="mb-4 text-sm font-semibold text-primary">FEATURED · JOB SEARCH</p>
                <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">{blogArticles[0].title}</h2>
                <p className="mb-6 mt-4 max-w-lg leading-relaxed text-muted-foreground">{blogArticles[0].description}</p>
                <Button asChild className="w-fit rounded-md"><Link to={`/blog/${blogArticles[0].slug}`}>Read the guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </section>
            <section aria-labelledby="latest-articles">
              <div className="mb-6 flex items-center justify-between border-b border-border pb-5"><h2 id="latest-articles" className="text-2xl font-semibold">Latest articles</h2><span className="text-sm text-muted-foreground">3 guides</span></div>
              <div className="grid gap-8 md:grid-cols-3">
                {blogArticles.map((item, index) => (
                  <article key={item.slug} className="flex flex-col border-b border-border pb-8">
                    <div className="mb-6 flex items-center justify-between"><span className="text-sm font-semibold text-primary">{item.category}</span><span className="text-sm text-muted-foreground">0{index + 1}</span></div>
                    <h3 className="mb-3 text-xl font-semibold leading-snug"><Link to={`/blog/${item.slug}`} className="hover:text-primary">{item.title}</Link></h3>
                    <p className="mb-6 flex-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{item.readTime}</span><Button asChild variant="ghost" size="sm"><Link to={`/blog/${item.slug}`}>Read article<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}