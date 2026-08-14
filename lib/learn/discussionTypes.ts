/**
 * Client-safe discussion view types (no Mongo imports).
 */

export type DiscussionPostView = {
  id: string;
  courseKey: string;
  lessonKey: string | null;
  groupId: string | null;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  upvoteCount: number;
  upvotedByMe: boolean;
  pinned: boolean;
  officialAnswerId: string | null;
  replyCount: number;
  createdAt: string;
};

export type DiscussionReplyView = {
  id: string;
  postId: string;
  body: string;
  authorId: string;
  authorName: string;
  isOfficial: boolean;
  createdAt: string;
};

export type StudyGroupView = {
  id: string;
  title: string;
  courseKey: string | null;
  description: string;
  memberIds: string[];
  memberCount: number;
  createdBy: string;
  createdAt: string;
  isMember: boolean;
};
