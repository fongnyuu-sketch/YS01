import React, { useState, useEffect } from 'react';
import {
  CommunityPost,
  PostCategory,
  CommunityComment,
} from '../types';
import { INITIAL_COMMUNITY_POSTS } from '../data/initialCommunityPosts';
import {
  Users,
  MessageSquare,
  Star,
  Heart,
  PlusCircle,
  Search,
  Filter,
  Flame,
  Clock,
  Send,
  Sparkles,
  Tag,
  CheckCircle2,
  X,
  ChefHat,
  BookOpen,
  Award,
} from 'lucide-react';

interface CommunityBoardProps {
  onBackToPlanner?: () => void;
}

export const CommunityBoard: React.FC<CommunityBoardProps> = ({ onBackToPlanner }) => {
  // Posts state initialized from localStorage or initial seed
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('diet_community_posts');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
    } catch {
      return INITIAL_COMMUNITY_POSTS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'comments'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Active expanded comments by post ID
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-1': true,
    'post-2': true,
  });

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, { author: string; content: string }>>({});

  // Hover state for interactive star rating
  const [hoverRating, setHoverRating] = useState<{ postId: string; star: number } | null>(null);

  // Sync posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('diet_community_posts', JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save community posts to localStorage:', e);
    }
  }, [posts]);

  // Handle like toggle
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      })
    );
  };

  // Handle interactive star rating
  const handleRatePost = (postId: string, newRating: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        let totalPoints = post.rating * post.ratingsCount;
        let newCount = post.ratingsCount;

        if (post.userRated) {
          totalPoints = totalPoints - post.userRated + newRating;
        } else {
          totalPoints = totalPoints + newRating;
          newCount += 1;
        }

        const calculatedAvg = Math.round((totalPoints / newCount) * 10) / 10;

        return {
          ...post,
          rating: calculatedAvg,
          ratingsCount: newCount,
          userRated: newRating,
        };
      })
    );
  };

  // Handle adding new comment
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = commentInputs[postId];
    if (!input || !input.content.trim()) return;

    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      author: input.author.trim() || '영양실천러',
      avatarBg: 'bg-emerald-600',
      content: input.content.trim(),
      createdAt: '방금 전',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [newComment, ...post.comments],
        };
      })
    );

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: { author: '', content: '' },
    }));

    setExpandedComments((prev) => ({
      ...prev,
      [postId]: true,
    }));
  };

  // Filter & Sort
  const filteredPosts = posts
    .filter((post) => {
      if (activeCategory !== 'all' && post.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inContent = post.content.toLowerCase().includes(q);
        const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
        const inAuthor = post.author.toLowerCase().includes(q);
        return inTitle || inContent || inTags || inAuthor;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'comments') return b.comments.length - a.comments.length;
      return 0; // default latest order
    });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <Users className="w-3.5 h-3.5" />
              <span>실시간 식단 & 건강 레시피 소통 커뮤니티</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              실천 후기 & 나만의 건강 레시피 나눔
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              사용자들의 진솔한 7일 식단 실천 후기, 직접 개발한 건강 레시피, 식단 관리 팁을 확인하고
              별점과 댓글로 자유롭게 소통해보세요!
            </p>
          </div>

          <button
            id="open-create-post-modal-btn"
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>후기 / 레시피 공유하기</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Categories, Search, Sort */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            {[
              { id: 'all', label: '전체 글', count: posts.length },
              {
                id: 'review',
                label: '식단 실천 후기',
                count: posts.filter((p) => p.category === 'review').length,
              },
              {
                id: 'recipe',
                label: '나만의 건강 레시피',
                count: posts.filter((p) => p.category === 'recipe').length,
              },
              {
                id: 'tip',
                label: '식단 관리 팁',
                count: posts.filter((p) => p.category === 'tip').length,
              },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1 opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="제목, 내용, 태그 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 text-slate-700 bg-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="latest">최신순</option>
              <option value="rating">별점 높은 순</option>
              <option value="comments">댓글 많은 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">검색 조건에 맞는 게시글이 없습니다.</p>
            <p className="text-xs text-slate-400">새로운 식단 실천 후기나 레시피를 첫 번째로 공유해보세요!</p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>첫 글 작성하기</span>
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsExpanded = Boolean(expandedComments[post.id]);
            const postComments = post.comments || [];
            const commentInput = commentInputs[post.id] || { author: '', content: '' };

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 transition-all hover:border-slate-300"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${post.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}
                    >
                      {post.author.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{post.author}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {post.authorBadge}
                        </span>
                        <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                      </div>
                      <span className="inline-block mt-0.5 text-xs font-bold text-emerald-800">
                        [{post.categoryLabel}]
                      </span>
                    </div>
                  </div>

                  {/* Star Rating Display & Interactive Trigger */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span className="text-xs font-bold text-amber-900">{post.rating}</span>
                      <span className="text-[10px] text-amber-700">({post.ratingsCount}명 평가)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">별을 클릭해 직접 평가하세요</span>
                  </div>
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {post.title}
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>
                </div>

                {/* If Recipe post, show special recipe box */}
                {post.recipeData && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-800">
                        <ChefHat className="w-4 h-4 text-emerald-600" />
                        <span>레시피 상세 정보</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        {post.recipeData.calories && (
                          <span className="text-rose-600 font-semibold flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" />
                            {post.recipeData.calories} kcal
                          </span>
                        )}
                        {post.recipeData.protein && (
                          <span className="text-blue-600 font-semibold">
                            단백질 {post.recipeData.protein}g
                          </span>
                        )}
                        {post.recipeData.cookTimeMinutes && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.recipeData.cookTimeMinutes}분 소요
                          </span>
                        )}
                      </div>
                    </div>

                    {post.recipeData.ingredients && post.recipeData.ingredients.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">필요 재료:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {post.recipeData.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {post.recipeData.steps && post.recipeData.steps.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-500">조리 순서:</span>
                        <ol className="space-y-1 text-xs text-slate-700 list-decimal list-inside">
                          {post.recipeData.steps.map((st, sidx) => (
                            <li key={sidx} className="leading-relaxed">
                              {st}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />#{tag}
                    </span>
                  ))}
                </div>

                {/* Interactive Star Rating & Action Row */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Interactive Star Giver */}
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-600 mr-1">
                      {post.userRated ? `내 평점 (${post.userRated}점)` : '별점 주기:'}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((starNum) => {
                        const isHovered =
                          hoverRating?.postId === post.id && hoverRating.star >= starNum;
                        const isFilled =
                          isHovered || (post.userRated && post.userRated >= starNum);

                        return (
                          <button
                            key={starNum}
                            type="button"
                            onMouseEnter={() =>
                              setHoverRating({ postId: post.id, star: starNum })
                            }
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => handleRatePost(post.id, starNum)}
                            className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                            title={`${starNum}점 주기`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-300 hover:text-amber-400'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions: Likes & Comments Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        post.isLiked
                          ? 'bg-rose-50 text-rose-600 border-rose-200 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                      <span>응원 {post.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>댓글 {postComments.length}개</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {isCommentsExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Add Comment Input Form */}
                    <form
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                    >
                      <input
                        type="text"
                        placeholder="닉네임 (기본: 영양실천러)"
                        value={commentInput.author}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: {
                              ...commentInput,
                              author: e.target.value,
                            },
                          }))
                        }
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 sm:w-36 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="따뜻한 응원이나 질문을 남겨보세요..."
                        value={commentInput.content}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: {
                              ...commentInput,
                              content: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={!commentInput.content.trim()}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>등록</span>
                      </button>
                    </form>

                    {/* Existing Comments */}
                    {postComments.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {postComments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5 text-xs"
                          >
                            <div
                              className={`w-6 h-6 rounded-full ${comment.avatarBg} text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5`}
                            >
                              {comment.author.slice(0, 1)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">{comment.author}</span>
                                <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                              </div>
                              <p className="text-slate-600 mt-0.5 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Write New Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmitPost={(newPost) => {
            setPosts((prev) => [newPost, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

// Modal for Creating New Post
interface CreatePostModalProps {
  onClose: () => void;
  onSubmitPost: (post: CommunityPost) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmitPost }) => {
  const [category, setCategory] = useState<PostCategory>('review');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [authorBadge, setAuthorBadge] = useState('식단 1주차');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['주간식단', '건강식']);

  // Recipe specific details
  const [isRecipe, setIsRecipe] = useState(false);
  const [calories, setCalories] = useState<number>(350);
  const [protein, setProtein] = useState<number>(25);
  const [cookTime, setCookTime] = useState<number>(15);
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');

  const handleCategoryChange = (cat: PostCategory) => {
    setCategory(cat);
    if (cat === 'recipe') setIsRecipe(true);
    else setIsRecipe(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const categoryLabels: Record<PostCategory, string> = {
      review: '식단 실천 후기',
      recipe: '나만의 건강 레시피',
      tip: '식단 관리 팁',
    };

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      category,
      categoryLabel: categoryLabels[category],
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || '영양새싹',
      authorBadge: authorBadge.trim() || '식단 실천러',
      avatarBg: 'bg-emerald-600',
      createdAt: '방금 전',
      rating: 5.0,
      ratingsCount: 1,
      likes: 1,
      comments: [],
      tags,
      recipeData:
        category === 'recipe' || isRecipe
          ? {
              calories,
              protein,
              cookTimeMinutes: cookTime,
              ingredients: ingredientsText
                ? ingredientsText.split('\n').filter((s) => s.trim().length > 0)
                : undefined,
              steps: stepsText
                ? stepsText.split('\n').filter((s) => s.trim().length > 0)
                : undefined,
            }
          : undefined,
    };

    onSubmitPost(newPost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold">커뮤니티 글 작성하기</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">카테고리 선택</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'review', label: '주간 식단 실천 후기' },
                { id: 'recipe', label: '나만의 건강 레시피' },
                { id: 'tip', label: '식단 관리 팁 & 노하우' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategoryChange(c.id as PostCategory)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    category === c.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Author & Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">작성자 닉네임</label>
              <input
                type="text"
                placeholder="예: 클린식단러"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">나만의 배지</label>
              <input
                type="text"
                placeholder="예: 2주차 다이어터, 헬스인"
                value={authorBadge}
                onChange={(e) => setAuthorBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">글 제목</label>
            <input
              type="text"
              placeholder="예: 7일간 실천해보니 아침 컨디션이 확 달라졌어요!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              내용 (실천 소감, 맛 평가, 건강 변화 등)
            </label>
            <textarea
              rows={4}
              placeholder="식단을 진행하며 느꼈던 변화, 팁, 맛있었던 메뉴에 대해 자유롭게 공유해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Recipe fields if category is recipe */}
          {category === 'recipe' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-emerald-600" />
                <span>레시피 상세 규격 (선택 입력)</span>
              </h5>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">칼로리 (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">단백질 (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">조리 시간 (분)</label>
                  <input
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  필요 재료 (줄바꿈으로 구분)
                </label>
                <textarea
                  rows={2}
                  placeholder="예:&#10;닭가슴살 100g&#10;양파 1/2개&#10;현미밥 130g"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  조리 순서 (줄바꿈으로 구분)
                </label>
                <textarea
                  rows={2}
                  placeholder="예:&#10;1. 올리브유에 양파를 볶습니다.&#10;2. 닭가슴살과 밥을 넣고 3분간 졸입니다."
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">태그</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((item) => item !== t))}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="태그 입력 후 추가 (예: 초간단, 식단후기)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
              >
                태그 추가
              </button>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              게시글 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
