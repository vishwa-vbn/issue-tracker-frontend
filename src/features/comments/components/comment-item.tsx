import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/controls/user-avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useEditComment } from '../hooks/use-edit-comment';
import { useDeleteComment } from '../hooks/use-delete-comment';
import { formatRelativeTime } from '@/utils/format-date';
import { useAppSelector } from '@/store';
import type { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  issueId: string;
}

export function CommentItem({ comment, issueId }: CommentItemProps) {
  const user = useAppSelector((s) => s.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.body);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editCommentMutation = useEditComment();
  const deleteCommentMutation = useDeleteComment();

  const isAuthor = user?.id === comment.author.id;
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isAuthor;
  const canDelete = isAuthor || isAdmin;

  const handleSaveEdit = () => {
    if (!editedText.trim()) return;
    editCommentMutation.mutate(
      { issueId, commentId: comment.id, body: editedText.trim() },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleDelete = () => {
    deleteCommentMutation.mutate(
      { issueId, commentId: comment.id },
      {
        onSettled: () => setShowDeleteConfirm(false),
      },
    );
  };

  return (
    <div className="flex gap-3.5 group rounded-xl p-4 border border-border/70 bg-slate-50/60 hover:bg-white hover:border-border hover:shadow-sm transition-all duration-150">
      <UserAvatar name={comment.author.name} size="md" className="mt-0.5" />

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {comment.author.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-[11px] text-muted-foreground italic bg-slate-100 px-1.5 py-0.5 rounded">
                edited
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {canEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditedText(comment.body);
                  setIsEditing(true);
                }}
                className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
                aria-label="Edit comment"
              >
                <Pencil className="size-3.5" />
              </Button>
            )}
            {canDelete && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="size-7 p-0 text-muted-foreground hover:text-destructive rounded-md"
                aria-label="Delete comment"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2.5 mt-1">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[80px] text-sm bg-white border-border"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={editCommentMutation.isPending || !editedText.trim()}
                className="h-8 text-xs gap-1"
              >
                <Check className="size-3.5" />
                Save changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={editCommentMutation.isPending}
                className="h-8 text-xs gap-1"
              >
                <X className="size-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
            {comment.body}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Comment?"
        description="Are you sure you want to permanently remove this comment? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={deleteCommentMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
