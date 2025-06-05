import { BookOpen } from "lucide-react";

interface TextMetadataProps {
  author: string;
  category: string;
}

export const TextMetadata: React.FC<TextMetadataProps> = ({
  author,
  category,
}) => (
  <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
    <div className="flex items-center gap-2 text-indigo-800">
      <BookOpen className="h-4 w-4" />
      <span className="font-medium">
        {author} • {category}
      </span>
    </div>
  </div>
);
