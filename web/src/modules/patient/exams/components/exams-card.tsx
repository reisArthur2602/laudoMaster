import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ExamCardProps {
  title: string;
  date: string;
  type: string;
  thumbnail?: string;
  onView: () => void;
  onDownload: () => void;
}

export const ExamCard = ({
  title,
  date,
  type,
  thumbnail,
  onView,
  onDownload,
}: ExamCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 border-border">
      <CardContent className="p-0">
        <div className="aspect-video bg-muted flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileText className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{type}</p>
            <p className="text-xs text-muted-foreground mt-1">{date}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onView} className="flex-1" variant="default">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={onDownload} variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
