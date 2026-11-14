import { useState } from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/controls/user-avatar';
import { useAddComment } from '../hooks/use-add-comment';
import { useAppSelector } from '@/store';

interface CommentFormProps {
  issueId: string;
}

export function CommentForm({ issueId }: CommentFormProps) {
  const [text, setText] = useState('');
  const user = useAppSelector((s) => s.auth.user);
  const addCommentMutation = useAddComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addCommentMutation.mutate(
      { issueId, body: text.trim() },
      {
        onSuccess: () => {
          setText('');
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3.5 items-start">
      <UserAvatar name={user?.name} size="md" />

      <div className="flex-1 space-y-2.5">
        <Textarea
          placeholder="Add a comment or share an update..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="text-sm resize-y min-h-[85px] focus-visible:ring-primary"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!text.trim() || addCommentMutation.isPending}
            className="text-xs font-semibold gap-1.5"
          >
            <Send className="size-3.5" />
            {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
}

