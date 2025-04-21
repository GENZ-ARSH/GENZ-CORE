import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { Book } from '@shared/schema';

interface BookCardProps {
  book: Book;
  onDownload?: (id: number) => void;
}

export default function BookCard({ book, onDownload }: BookCardProps) {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-40 overflow-hidden">
        <img 
          src={book.coverImage || 'https://placehold.co/400x300/e5e7eb/a1a1aa?text=No+Image&font=roboto'} 
          alt={`Cover for ${book.title}`}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{book.title}</h3>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Download className="h-4 w-4 mr-1" />
          <span>{book.downloadCount} downloads</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {book.tags && book.tags.slice(0, 2).map((tag, i) => (
            <Badge 
              key={i} 
              variant="secondary" 
              className="font-normal text-xs"
            >
              {tag}
            </Badge>
          ))}
          {book.class && (
            <Badge 
              variant="outline" 
              className="font-normal text-xs"
            >
              {book.class}
            </Badge>
          )}
          {book.tags && book.tags.length > 2 && (
            <Badge 
              variant="outline" 
              className="font-normal text-xs"
            >
              +{book.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <button 
          className="w-full py-1.5 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
          onClick={() => onDownload && onDownload(book.id)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </button>
      </CardFooter>
    </Card>
  );
}
