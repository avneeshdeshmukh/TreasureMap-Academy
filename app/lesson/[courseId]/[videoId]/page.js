"use client";
import { useParams } from "next/navigation";
import VideoQuiz from "@/components/video-quiz";
import { StreakIcons } from "@/components/streak-icons";
import { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  ArrowBigLeft,
  Send,
  Save,
  Trash2,
  Edit2,
  X,
  MessageCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { comment } from "postcss";

export default function LessonPage() {
  const firestore = getFirestore();
  const { courseId, videoId } = useParams();
  const userId = auth.currentUser.uid;

  const videoRef = doc(firestore, "videos", videoId);
  const VIRef = doc(firestore, "videoInteraction", videoId);

  const [video, setVideo] = useState(null);
  const [videoInt, setVideoInt] = useState(null);

  const [liked, setLiked] = useState(0);
  const [disliked, setDisliked] = useState(0);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [userFeedback, setUserFeedback] = useState(null);

  const [startFrom, setStartFrom] = useState(0);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [showNotesSection, setShowNotesSection] = useState(true);
  const [showCommentsSection, setShowCommentsSection] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [vidNotes, setVidNotes] = useState(null);

  const videoNotesRef = doc(firestore, "videoNotes", `${videoId}_${userId}`);

  const showTemporaryFeedback = (message) => {
    console.log(message);
  };

  const fetchSavedNotes = async () => {
    const docSnap = await getDoc(videoNotesRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setVidNotes(data);
      setStartFrom(data.lastProgressTime ?? 0);
      setSavedNotes(data.notes || []);
      switch (data.likeStatus) {
        case 1:
          setLiked(1);
          break;

        case -1:
          setDisliked(1);
          break;
      }
    } else {
      // Document does not exist, create it with an empty notes array
      const data = {
        videoId,
        userId,
        courseId,
        isCompleted: false,
        duration: video.duration,
        notes: [],
        likeStatus: 0,
      };

      await setDoc(videoNotesRef, data);
      setVidNotes(data);
      setSavedNotes([]); // No notes, so start with an empty array
    }
  };

  useEffect(() => {
    fetchSavedNotes();
  }, [videoId, userId]);

  const handleLike = async () => {
    if (liked) {
      setLiked(0);
      setUserFeedback(null);
      await updateDoc(VIRef, {
        likes: likeCount - 1,
      });
      await updateDoc(videoNotesRef, {
        likeStatus: 0,
      });
      setLikeCount(likeCount - 1);
    } else if (disliked) {
      setLiked(1);
      setUserFeedback("like");
      showTemporaryFeedback("Thanks for your feedback!");
      setDisliked(0);
      await updateDoc(VIRef, {
        likes: likeCount + 1,
        dislikes: dislikeCount - 1,
      });
      await updateDoc(videoNotesRef, {
        likeStatus: 1,
      });
      setLikeCount(likeCount + 1);
      setDislikeCount(dislikeCount - 1);
    } else {
      setLiked(1);
      setUserFeedback("like");
      showTemporaryFeedback("Thanks for your feedback!");
      await updateDoc(VIRef, {
        likes: likeCount + 1,
      });
      await updateDoc(videoNotesRef, {
        likeStatus: 1,
      });
      setLikeCount(likeCount + 1);
    }
  };

  const handleDislike = async () => {
    if (disliked) {
      setDisliked(0);
      setUserFeedback(null);
      await updateDoc(VIRef, {
        dislikes: dislikeCount - 1,
      });
      await updateDoc(videoNotesRef, {
        likeStatus: 0,
      });
      setDislikeCount(dislikeCount - 1);
    } else if (liked) {
      setDisliked(1);
      setUserFeedback("dislike");
      showTemporaryFeedback("Thanks for your feedback!");
      setLiked(0);
      await updateDoc(VIRef, {
        dislikes: dislikeCount + 1,
        likes: likeCount - 1,
      });
      await updateDoc(videoNotesRef, {
        likeStatus: -1,
      });
      setDislikeCount(dislikeCount + 1);
      setLikeCount(likeCount - 1);
    } else {
      setDisliked(1);
      setUserFeedback("dislike");
      showTemporaryFeedback("Thanks for your feedback!");
      await updateDoc(VIRef, {
        dislikes: dislikeCount + 1,
      });
      await updateDoc(videoNotesRef, {
        likeStatus: -1,
      });
      setDislikeCount(dislikeCount + 1);
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      const vid = await getDoc(videoRef);
      const VI = await getDoc(VIRef);
      if (vid.exists() && VI.exists()) {
        const videoData = vid.data();
        const VIData = VI.data();
        setVideo(videoData);
        setVideoInt(VIData);
        setLikeCount(VIData.likes);
        setDislikeCount(VIData.dislikes);
        setComments(VIData.comments || []);
      } else {
        console.log("Video not found");
      }
    };

    fetchVideo();
  }, [videoId]);

  // Handle Comment Submission
  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const username = userData.username;

        const newComment = {
          userId,
          username,
          text: comment,
          timestamp: new Date().toISOString(),
        };
        await updateDoc(VIRef, {
          comments: arrayUnion(newComment),
        });

        setComments([...comments, newComment]);
        setComment(""); //clear input
        showTemporaryFeedback("Comment posted Successfully!");
      } else {
        console.log("User not found");
      }
    }
  };

  // Handle Notes Submission
  const handleSaveNotes = async () => {
    if (notes.trim()) {
      const newNote = {
        timestamp: new Date().toLocaleString(),
        text: notes,
      };

      if (editingNoteIndex !== null) {
        // If editing, update the note in the array
        const updatedNotes = [...savedNotes];
        updatedNotes[editingNoteIndex] = newNote;
        await updateDoc(videoNotesRef, {
          notes: updatedNotes,
        });
        setEditingNoteIndex(null); // Clear editing state
      } else {
        // If saving a new note, append to the array
        await updateDoc(videoNotesRef, {
          notes: arrayUnion(newNote),
        });
      }

      setNotes(""); // Clear the text area
      fetchSavedNotes(); // Re-fetch saved notes after saving or updating
    }
  };

  // Handle Note Deletion
  const handleDeleteNote = async (index) => {
    const updatedNotes = savedNotes.filter((_, i) => i !== index);
    await updateDoc(videoNotesRef, {
      notes: updatedNotes,
    });
    fetchSavedNotes(); // Re-fetch saved notes after deletion
  };

  // Handle Note Editing
  const handleEditNote = (index) => {
    setNotes(savedNotes[index].text);
    setEditingNoteIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 min-h-12 sm:min-h-14 p-1 sm:p-2 md:p-4 text-white flex justify-between items-center sticky top-0 z-50">
        <div>
          <Button
            variant="ghost"
            className="text-white h-auto p-1 sm:p-2 hover:bg-slate-800 flex items-center"
          >
            <ArrowBigLeft className="cursor-pointer w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm md:text-base truncate max-w-[90px] sm:max-w-none">
              Back to Course
            </span>
          </Button>
        </div>
        <div className="flex items-center">
          <StreakIcons streak={39} coins={65} />
        </div>
      </nav>

      {/* Video Title */}
      {video ? (
        <div className="text-lg sm:text-xl md:text-2xl font-semibold mt-3 sm:mt-4 md:mt-6 px-4 sm:px-6 md:px-8">
          {video.title}
        </div>
      ) : (
        <></>
      )}

      {/* Main Layout */}
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 p-4 sm:p-6 md:p-8">
        {/* Video Player & Quiz */}
        <div className="w-full">
          {vidNotes ? (
            <VideoQuiz
              courseId={courseId}
              preview={null}
              videoId={videoId}
              startTime={startFrom}
              vidNotes={vidNotes}
              className="w-full h-auto aspect-video"
            />
          ) : (
            <></>
          )}
        </div>

        {/* Interaction Buttons */}
        <div className="flex space-x-3 sm:space-x-4">
          <Button
            variant="outline"
            onClick={handleLike}
            className="flex items-center space-x-1 sm:space-x-2 hover:bg-blue-50 transition-colors text-xs sm:text-sm"
          >
            <ThumbsUp size={16} className={liked && "text-blue-500"} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleDislike}
            className="flex items-center space-x-1 sm:space-x-2 hover:bg-red-50 transition-colors text-xs sm:text-sm"
          >
            <ThumbsDown size={16} className={disliked && "text-red-500"} />
            <span>{dislikeCount}</span>
          </Button>
        </div>

        {/* Responsive Layout for Notes and Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Notes Section */}
          <Card className="shadow-lg lg:col-span-2">
            <div
              className="p-3 sm:p-4 border-b flex justify-between items-center cursor-pointer"
              onClick={() => setShowNotesSection(!showNotesSection)}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <BookOpen size={18} />
                <h3 className="text-base sm:text-lg font-semibold">Notes</h3>
              </div>
              {showNotesSection ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {showNotesSection && (
              <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Add/Update Note Form */}
                <div className="space-y-2 sm:space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes for this video..."
                    className="min-h-24 sm:min-h-32 resize-y text-sm sm:text-base"
                  />
                  <Button
                    onClick={handleSaveNotes}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Save size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingNoteIndex !== null ? "Update Note" : "Save Note"}
                  </Button>
                </div>

                {/* Saved Notes */}
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-medium text-sm sm:text-base">
                    Saved Notes ({savedNotes.length})
                  </h4>
                  {savedNotes.length === 0 ? (
                    <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">
                      No saved notes yet. Start taking notes!
                    </p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {savedNotes.map((note, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <p className="whitespace-pre-wrap flex-grow text-sm sm:text-base">
                              {note.text}
                            </p>
                            <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditNote(index)}
                                className="text-blue-500 hover:text-blue-700 p-1"
                              >
                                <Edit2 size={14} className="sm:size-16" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNote(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 size={14} className="sm:size-16" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                            {note.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Comments Section */}
          <Card className="shadow-lg">
            <div
              className="p-3 sm:p-4 border-b flex justify-between items-center cursor-pointer"
              onClick={() => setShowCommentsSection(!showCommentsSection)}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <MessageCircle size={18} />
                <h3 className="text-base sm:text-lg font-semibold">Comments</h3>
              </div>
              {showCommentsSection ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {showCommentsSection && (
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <Input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-grow text-sm sm:text-base"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleCommentSubmit();
                    }}
                  />
                  <Button
                    onClick={handleCommentSubmit}
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Send size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Post</span>
                  </Button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((cmt, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex justify-between flex-wrap">
                          <span className="font-semibold text-sm sm:text-base">
                            {cmt.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(cmt.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm sm:text-base">{cmt.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Feedback Alert */}
      {showFeedback && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm bg-green-50 border-green-200 animate-fade-in-up">
          <AlertDescription className="text-green-800">
            {feedbackMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
