import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPostSlice } from './Redux/Slices/postSlice';
import { dropCommentSlice, setCommentSlice } from './Redux/Slices/commentSlice';
import { dropReplySlice } from './Redux/Slices/replySlice';
import { dropPostSlice } from './Redux/Slices/postSlice';

function App() {
  const [post, setPost] = useState('')
  const [showPost, setShowPost] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [replies, setReplies] = useState({})

  const dispatch = useDispatch()
  const AllPosts = useSelector(state => state.posts)
  const AllComments = useSelector(state => state.comments)
  // const AllReplies = useSelector(state => state.replies)

  const handleCreatePostClick = () => {
    setShowPost(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newPost = formData.get('post')
    setPost(newPost)
    dispatch(setPostSlice(newPost))
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const newComment = {
      text: commentText,
      replies: [],
      replyText: ''
    }
    setComments([...comments, newComment])
    dispatch(setCommentSlice([...comments, newComment]))
    setCommentText('')
  }

  const handleReplySubmit = (e, commentIndex, replyIndex, subReplyIndex) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const replyText = formData.get('reply')
    const updatedComments = [...comments]

    if (replyIndex === undefined) {
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        replies: [
          ...updatedComments[commentIndex].replies,
          {
            text: replyText,
            subReplies: [],
          },
        ],
      };
    } else if (subReplyIndex === undefined) {
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        replies: updatedComments[commentIndex].replies.map((reply, index) =>
          index === replyIndex
            ? {
              ...reply,
              subReplies: [
                ...reply.subReplies,
                {
                  text: replyText,
                  subReplyReplies: [],
                },
              ],
            }
            : reply
        ),
      };
    } else {
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        replies: updatedComments[commentIndex].replies.map((reply, index) =>
          index === replyIndex
            ? {
              ...reply,
              subReplies: reply.subReplies.map((subReply, subIndex) =>
                subIndex === subReplyIndex
                  ? {
                    ...subReply,
                    subReplyReplies: [
                      ...subReply.subReplyReplies,
                      {
                        text: replyText,
                      },
                    ],
                  }
                  : subReply
              ),
            }
            : reply
        ),
      };
    }

    setComments(updatedComments)
    dispatch(setCommentSlice(updatedComments))

    const updatedReplies = { ...replies }

    updatedReplies[`${commentIndex}-${replyIndex}`] = updatedReplies[`${commentIndex}-${replyIndex}`]
      ? [...updatedReplies[`${commentIndex}-${replyIndex}`], replyText]
      : [replyText]

    setReplies(updatedReplies)
  }

  const handleSubReplySubmit = (e, commentIndex, replyIndex) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subReplyText = formData.get('reply');

    const updatedComments = comments.map((comment, cIndex) => {
      if (cIndex !== commentIndex) {
        return comment;
      }

      const updatedReplies = comment.replies.map((reply, rIndex) => {
        if (rIndex !== replyIndex) {
          return reply;
        }

        const subReplies = reply.subReplies ? [...reply.subReplies] : [];
        subReplies.push({
          text: subReplyText,
          subReplyReplies: [],
        });

        return {
          ...reply,
          subReplies,
        };
      });

      return {
        ...comment,
        replies: updatedReplies,
      };
    });

    setComments(updatedComments);
    dispatch(setCommentSlice(updatedComments));
  };


  const handleSubSubReplySubmit = (e, commentIndex, replyIndex, subReplyIndex, subSubReplyIndex) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subSubReplyText = formData.get('reply');

    const updatedComments = comments.map((comment, cIndex) => {
      if (cIndex !== commentIndex) {
        return comment
      }

      const updatedReplies = comment.replies.map((reply, rIndex) => {
        if (rIndex !== replyIndex) {
          return reply
        }

        const updatedSubReplies = reply.subReplies.map((subReply, sIndex) => {
          if (sIndex !== subReplyIndex) {
            return subReply
          }

          const updatedSubReplyReplies =
            subReply.subReplyReplies.length === 0
              ? [{ text: subSubReplyText }]
              : subReply.subReplyReplies.map((subSubReply, ssIndex) =>
                ssIndex === subSubReplyIndex ? { text: subSubReplyText } : subSubReply
              );

          return {
            ...subReply,
            subReplyReplies: updatedSubReplyReplies,
          };
        });

        return {
          ...reply,
          subReplies: updatedSubReplies,
        };
      });

      return {
        ...comment,
        replies: updatedReplies,
      }
    })

    setComments(updatedComments);
    dispatch(setCommentSlice(updatedComments));
  };


  const handleDeletePost = (e) => {
    e.preventDefault()
    dispatch(dropPostSlice())
    dispatch(dropCommentSlice())
    dispatch(dropReplySlice())
    setShowPost(false)
  }

  return (
    <>
      <div className='flex justify-center items-start mt-5'>
        {!showPost && (
          <button
            className='p-2 rounded bg-green-600 hover:bg-green-700'
            onClick={handleCreatePostClick}
          >
            Create Post
          </button>
        )}
      </div>
      {showPost && (
        <>
          <div className='flex justify-center'>

            <form onSubmit={handleSubmit}>
              <textarea className="border" name="post" cols="30" rows="3"></textarea>
              <button className="p-2 ml-3 bg-orange-500 hover:bg-orange-700 rounded" type="submit">Post</button>
            </form>

          </div>

        </>
      )}

      {showPost && post && (
        <>
          <div className="flex justify-center mt-4">
            <p className="font-bold text-xl text-slate-700">{post}</p>
          </div>
          <div className="flex justify-end mr-[150px]">
            <button className="p-2 bg-red-600 hover:bg-red-700 rounded" onClick={handleDeletePost}>Delete Post</button>
          </div>
        </>
      )}

      {showPost && post && (
        <div className="flex justify-center mt-4">
          <div>
            <h3>Comments:</h3>
            {comments.map((comment, commentIndex) => (
              <div key={commentIndex} className="mb-4">
                <p className="font-semibold">{comment.text}</p>
                <form onSubmit={(event) => handleReplySubmit(event, commentIndex)}>
                  <input
                    type="text"
                    name="reply"
                    placeholder="Reply to this comment"
                  />
                  <button type="submit">Reply</button>
                </form>

                {comment.replies.map((reply, replyIndex) => (
                  <div key={replyIndex} className="ml-4">
                    <p className="font-semibold">{reply.text}</p>
                    <form onSubmit={(event) => handleSubReplySubmit(event, commentIndex, replyIndex)}>
                      <input
                        type="text"
                        name="reply"
                        placeholder="Reply to this reply"
                      />
                      <button type="submit">Reply</button>
                    </form>

                    {reply.subReplies.map((subReply, subReplyIndex) => (
                      <div key={subReplyIndex} className="ml-4">
                        <p className="font-semibold">{subReply.text}</p>
                        <form onSubmit={(event) => handleSubSubReplySubmit(event, commentIndex, replyIndex, subReplyIndex)}>
                          <input
                            type="text"
                            name="reply"
                            placeholder="Reply to this sub-reply"
                          />
                          <button type="submit">Reply</button>
                        </form>

                        {subReply.subReplyReplies.map((subSubReply, subSubReplyIndex) => (
                          <div key={subSubReplyIndex} className="ml-6">
                            <p className="font-semibold">{subSubReply.text}</p>
                            <form onSubmit={(event) => handleSubSubReplySubmit(event, commentIndex, replyIndex, subReplyIndex, subSubReplyIndex)}>
                              <input
                                type="text"
                                name="reply"
                                placeholder="Reply to this sub-sub-reply"
                              />
                              <button type="submit">Reply</button>
                            </form>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment"
              />
              <button type="submit">Comment</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
