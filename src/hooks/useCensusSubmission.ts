// src/hooks/useCensusSubmission.ts
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

interface UseCensusSubmissionProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useCensusSubmission = ({ onSuccess, onError }: UseCensusSubmissionProps = {}) => {
  const { toast } = useToast();

  const submitMutation = api.census.submit.useMutation({
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message,
      });
      onSuccess?.();
    },
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      onError?.();
    },
  });

  const generateMessageMutation = api.census.generateMessage.useMutation({
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate message.",
        variant: "destructive",
      });
    },
  });

  return { submitMutation, generateMessageMutation };
};

export default useCensusSubmission;