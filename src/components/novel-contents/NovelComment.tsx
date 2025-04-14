import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import styles from "./NovelComment.module.css";

// 댓글 데이터 타입 정의
interface Comment {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
}

const NovelComment = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [username, setUsername] = useState("");

  // 댓글 데이터 가져오기 (예시)
  useEffect(() => {
    // 실제 구현시 API 호출로 대체
    const mockComments: Comment[] = [
      {
        id: 1,
        author: "사용자1",
        content: "정말 재미있는 소설이에요!",
        rating: 5,
        createdAt: "2023-10-15",
      },
      {
        id: 2,
        author: "사용자2",
        content: "스토리가 탄탄하고 좋네요.",
        rating: 4,
        createdAt: "2023-10-14",
      },
    ];

    setComments(mockComments);
  }, []);

  // 새 댓글 추가 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === "" || rating === 0) {
      alert("댓글 내용과 별점을 모두 입력해주세요.");
      return;
    }

    const newCommentObj: Comment = {
      id: comments.length + 1,
      author: username || "익명",
      content: newComment,
      rating,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
    setRating(0);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>댓글</h2>

      {/* 댓글 목록 */}
      <div className={styles.commentList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={styles.commentCard}
            >
              <div className={styles.commentHeader}>
                <div className={styles.authorName}>{comment.author}</div>
                <div className={styles.commentDate}>{comment.createdAt}</div>
              </div>
              <div className={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={styles.star}
                    color={index < comment.rating ? "#FFD700" : "#e4e5e9"}
                    size={16}
                  />
                ))}
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </div>
          ))
        ) : (
          <p className={styles.emptyMessage}>
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form
        onSubmit={handleSubmit}
        className={styles.commentForm}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>이름 (선택사항)</label>
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>별점</label>
          <div className={styles.starRating}>
            <div className={styles.starGroup}>
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label
                    key={index}
                    className={styles.star}
                  >
                    <input
                      type="radio"
                      name="rating"
                      className={styles.hidden}
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      color={
                        ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"
                      }
                      size={24}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
            {rating > 0 && (
              <span className={styles.ratingText}>{rating}점</span>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>댓글</label>
          <textarea
            className={styles.textarea}
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!newComment.trim() || rating === 0}
        >
          댓글 작성
        </button>
      </form>
    </div>
  );
};

export default NovelComment;
