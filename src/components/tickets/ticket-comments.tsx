import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ticket, Comment, ResponseDetailTicket } from "@/types/ticket";
import { users } from "@/data/mockData";
import { useComment, useProfiles } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface TicketCommentsProps {
  ticketId: string;
}

export function TicketComments({ ticketId }: TicketCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const {data: profiles=[]} = useProfiles();
  const {user} = useAuth();
  const { comments, isLoading, addComment } = useComment(ticketId, user.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    await addComment.mutateAsync({
      content: newComment,
      authorId: user.id,
    });
    setNewComment("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmitComment();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment */}
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment... (Cmd/Ctrl + Enter to submit)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || addComment.isPending}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => {
              // pick user data if the comment is from logged-in user
              const findUser = profiles.find((p) => p.id === comment.authorId)
              const displayName = findUser ? findUser.name : "unknown user";
              const displayAvatar = findUser ? findUser.avatar : "";
              const displayInitial = displayName?.charAt(0) ?? "?";

              return (
                <div
                  key={comment.id}
                  className="flex gap-3 p-4 rounded-lg bg-muted/50"
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={displayAvatar} />
                    <AvatarFallback className="text-xs">
                      {displayInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}