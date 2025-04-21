import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Book as BookType } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Book,
  GraduationCap,
  FileText
} from "lucide-react";
import { books as mockBooks } from '@/lib/mockData';

// Book category types
const categories = [
  { id: "neet", name: "NEET", color: "bg-pink-500" },
  { id: "jee", name: "JEE", color: "bg-blue-500" },
  { id: "nda", name: "NDA", color: "bg-green-500" },
  { id: "general", name: "General", color: "bg-purple-500" },
];

// Placeholder AdminButton component
const AdminButton = ({ onSuccess }) => {
  return (
    <Button onClick={onSuccess}>Admin Panel</Button>
  );
};


export default function Home() {
  const [, navigate] = useLocation();
  const { data: books, isLoading } = useQuery<BookType[]>({
    queryKey: ["/api/books"],
    enabled: false, // Disable until we have an actual API endpoint
  });

  // For now, use mock data until API is ready
  const featuredBooks = mockBooks.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Hero section */}
      <section className="relative">
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,#000)]" />
          <div className="container relative z-10 py-12 md:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                      Your Complete Educational Resource Hub
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[600px]">
                      Access premium study materials, textbooks, and practice papers for NEET, JEE, NDA, and more.
                    </p>
                  </div>
                  <AdminButton onSuccess={() => navigate('/admin/books')} />
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg" className="relative overflow-hidden group">
                    <Link href="/library">
                      <span className="relative z-10">Browse Library</span>
                      <BookOpen className="ml-2 h-5 w-5 relative z-10" />
                      <div className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="relative overflow-hidden group">
                    <Link href="/book-request">
                      <span className="relative z-10">Request Materials</span>
                      <div className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block w-full h-[400px]">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl filter blur-3xl opacity-70"></div>
                <div className="absolute -right-4 top-4 transform rotate-6 w-64 h-80 bg-background border shadow-lg rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/5" />
                  <div className="p-4 h-full flex flex-col">
                    <div className="w-full h-40 bg-primary/20 rounded-md mb-4"></div>
                    <div className="w-3/4 h-3 bg-muted rounded-full mb-2"></div>
                    <div className="w-1/2 h-3 bg-muted rounded-full"></div>
                    <div className="mt-auto">
                      <div className="w-full h-8 bg-muted rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-8 bottom-4 transform -rotate-6 w-64 h-80 bg-background border shadow-lg rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/5" />
                  <div className="p-4 h-full flex flex-col">
                    <div className="w-full h-40 bg-primary/10 rounded-md mb-4"></div>
                    <div className="w-3/4 h-3 bg-muted rounded-full mb-2"></div>
                    <div className="w-1/2 h-3 bg-muted rounded-full"></div>
                    <div className="mt-auto">
                      <div className="w-full h-8 bg-muted rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-background border shadow-xl rounded-lg overflow-hidden z-10">
                  <div className="absolute inset-0 bg-grid-white/5" />
                  <div className="p-4 h-full flex flex-col">
                    <div className="w-full h-40 bg-primary/30 rounded-md mb-4"></div>
                    <div className="w-3/4 h-3 bg-muted rounded-full mb-2"></div>
                    <div className="w-1/2 h-3 bg-muted rounded-full"></div>
                    <div className="mt-auto">
                      <div className="w-full h-8 bg-primary/70 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Categories</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/library">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/library?category=${category.id}`}>
              <Card className="group hover:border-primary/50 transition-all overflow-hidden h-44">
                <div className={`absolute inset-0 opacity-10 ${category.color}`} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-primary to-primary/50 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{category.name}</CardTitle>
                </CardHeader>
                <CardFooter className="absolute bottom-0 left-0 right-0">
                  <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors">
                    Browse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured books section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Books</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/library">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="border shadow-sm h-[300px] animate-pulse">
                <div className="flex flex-col h-full p-6 gap-4">
                  <div className="w-full h-32 rounded-md bg-muted/60" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded-md bg-muted/60" />
                    <div className="h-4 w-1/2 rounded-md bg-muted/60" />
                  </div>
                  <div className="mt-auto">
                    <div className="h-9 w-full rounded-md bg-muted/60" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Books"
          value={books?.length || 0}
          icon={<Book className="h-6 w-6" />}
        />
        <StatsCard
          title="Downloads"
          value="1.2k"
          icon={<Download className="h-6 w-6" />}
        />
        <StatsCard
          title="Active Users"
          value="342"
          icon={<Users className="h-6 w-6" />}
        />
      </section>

      {/* Statistics section */}
      <section className="bg-background rounded-xl border backdrop-blur-sm p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why Choose TeamGENZ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Resources</h3>
            <p className="text-muted-foreground">Handpicked and verified educational materials for optimum learning experience.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
            <p className="text-muted-foreground">Instant downloads for all study materials to learn anytime, anywhere.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Coverage</h3>
            <p className="text-muted-foreground">Resources covering all major competitive exams and academic curricula.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function BookCard({ book }: { book: any }) { // Using any for now until we fix the schema issues
  return (
    <Card className="border overflow-hidden group hover:border-primary/50 transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-secondary/20">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="w-full h-full object-cover transition-all group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {book.downloadCount && book.downloadCount > 200 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Popular
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
        <CardDescription className="line-clamp-1">{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ScrollArea className="h-10">
          <div className="flex flex-wrap gap-1 mb-2">
            {book.tags?.map((tag: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
          <Link href={`/library/${book.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}