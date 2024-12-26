// src/hooks/useClipboard.ts
import { useToast } from "@/hooks/use-toast";

const useClipboard = () => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "The message has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      toast({
        title: "Error",
        description: "Failed to copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  return { copyToClipboard };
};

export default useClipboard;