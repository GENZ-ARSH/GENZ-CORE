import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import { FileIcon, Download } from 'lucide-react';

interface DownloadItem {
  id: number;
  title: string;
  fileType: string;
  fileSize: string;
  icon: 'pdf' | 'excel' | 'word' | 'image' | 'other';
}

interface BookListProps {
  downloads: DownloadItem[];
  title?: string;
}

export default function BookList({ 
  downloads, 
  title = "Recently Downloaded"
}: BookListProps) {
  
  const getFileIcon = (fileType: string, icon: DownloadItem['icon']) => {
    let bgColor = 'bg-gray-100 dark:bg-gray-700';
    let iconColor;
    
    switch (icon) {
      case 'pdf':
        iconColor = 'text-red-500';
        break;
      case 'excel':
        iconColor = 'text-green-500';
        break;
      case 'word':
        iconColor = 'text-blue-500';
        break;
      case 'image':
        iconColor = 'text-purple-500';
        break;
      default:
        iconColor = 'text-gray-500';
    }
    
    return (
      <div className={`${bgColor} p-2 rounded mr-3`}>
        <FileIcon className={`${iconColor} h-5 w-5`} />
      </div>
    );
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <h2 className="font-semibold">{title}</h2>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {downloads.map((download) => (
            <div key={download.id} className="flex items-center">
              {getFileIcon(download.fileType, download.icon)}
              <div className="flex-1">
                <p className="font-medium text-sm">{download.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {download.fileType} • {download.fileSize}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
