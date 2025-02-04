"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideoPreviewCard() {
    const router = useRouter();
    const handlePreview = () => {
        router.push()
    }
  return (
    <div>
        <Card className="flex items-center justify-between p-4 w-1/3">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
          🎬
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Video Title</p>
          <p className="text-xs text-gray-800">Preview</p>
        </div>
      </div>
      
        <Button variant="ghost" size="icon" className="w-5 h-8">
          <ArrowUpRight className="h-4"/>
        </Button>
      
    </Card>
    </div>
  );
}

