import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LibraryFiltersProps {
  classFilter: string;
  tagFilter: string;
  searchQuery: string;
  onClassChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const LibraryFilters = ({
  classFilter,
  tagFilter,
  searchQuery,
  onClassChange,
  onTagChange,
  onSearchChange,
  onReset,
}: LibraryFiltersProps) => {
  return (
    <Card className="mb-6 shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label
            htmlFor="class-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Class/Exam
          </label>
          <Select value={classFilter} onValueChange={onClassChange}>
            <SelectTrigger id="class-filter">
              <SelectValue placeholder="Select Class or Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="JEE">JEE</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
              <SelectItem value="12th">12th</SelectItem>
              <SelectItem value="11th">11th</SelectItem>
              <SelectItem value="10th">10th</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="tag-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tags
          </label>
          <Select value={tagFilter} onValueChange={onTagChange}>
            <SelectTrigger id="tag-filter">
              <SelectValue placeholder="Select Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="calculus">Calculus</SelectItem>
              <SelectItem value="mechanics">Mechanics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="ncert">NCERT</SelectItem>
              <SelectItem value="solutions">Solutions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="search-books"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Search
          </label>
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <Input
              id="search-books"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              placeholder="Search books..."
            />
          </div>
        </div>

        <div className="flex-none self-end">
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <i className="ri-refresh-line mr-2"></i>
            Reset
          </button>
        </div>
      </div>
    </Card>
  );
};

export default LibraryFilters;
