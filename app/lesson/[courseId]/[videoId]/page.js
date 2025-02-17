"use client";
import { useParams } from "next/navigation";
import VideoQuiz from "@/components/video-quiz";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function LessonPage() {
    const firestore = getFirestore();
    const { courseId, videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [notes, setNotes] = useState("");
    const [savedNotes, setSavedNotes] = useState([]);
    const [showNotesSection, setShowNotesSection] = useState(true);
    const [showCommentsSection, setShowCommentsSection] = useState(true);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    

    useEffect(() => {
      const fetchVideo = async () =>{
        const videoRef = doc(firestore, "videos", videoId);
        const vid = await getDoc(videoRef);
        if(vid.exists()){
            const videoData = vid.data();
            setVideo(videoData);
        }
        else{
            console.log("Video not found")
        }
      }
    
      fetchVideo();
    }, [videoId])
    

    // Feedback handler
    const showTemporaryFeedback = (message) => {
        setFeedbackMessage(message);
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
    };

    // Handle Comment Submission
    const handleCommentSubmit = () => {
        if (comment.trim()) {
            setComments([
                ...comments,
                {
                    id: Date.now(),
                    text: comment,
                    timestamp: new Date().toLocaleString(),
                    user: "User",
                },
            ]);
            setComment("");
            showTemporaryFeedback("Comment posted successfully!");
        }
    };

    // Handle Notes Submission
    const handleSaveNotes = () => {
        if (notes.trim()) {
            if (editingNoteId) {
                setSavedNotes(
                    savedNotes.map((note) =>
                        note.id === editingNoteId
                            ? { ...note, text: notes, editedAt: new Date().toLocaleString() }
                            : note
                    )
                );
                setEditingNoteId(null);
                showTemporaryFeedback("Note updated successfully!");
            } else {
                setSavedNotes([
                    ...savedNotes,
                    {
                        id: Date.now(),
                        text: notes,
                        timestamp: new Date().toLocaleString(),
                    },
                ]);
                showTemporaryFeedback("Note saved successfully!");
            }
            setNotes("");
        }
    };

    // Handle Note Deletion
    const handleDeleteNote = (noteId) => {
        setSavedNotes(savedNotes.filter((note) => note.id !== noteId));
        showTemporaryFeedback("Note deleted successfully!");
    };

    // Handle Note Editing
    const handleEditNote = (note) => {
        setNotes(note.text);
        setEditingNoteId(note.id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-slate-900 min-h-14 p-4 text-white flex items-center gap-2 sticky top-0 z-50">
                <Button variant="ghost" className="text-white p-2 hover:bg-slate-800">
                    <ArrowBigLeft className="cursor-pointer" />
                    <span className="ml-2">Back to Course</span>
                </Button>
            </nav>

            {/* Video Title */}
            {video ? (
            <div className="text-2xl font-semibold mt-6 ml-8"> {video.title}</div>
            ): <></>}


            {/* Main Layout */}
            <div className="flex flex-col md:flex-row gap-6 p-8">
                {/* Left Column */}
                <div className="flex-grow space-y-6">
                    {/* Video Player & Quiz */}
                        <VideoQuiz courseId={courseId} videoId={videoId} className="w-full h-auto aspect-video" />

                    {/* Interaction Buttons */}
                    <div className="flex space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setLikes((prev) => prev + 1);
                                showTemporaryFeedback("Thanks for your feedback!");
                            }}
                            className="flex items-center space-x-2 hover:bg-blue-50 transition-colors"
                        >
                            <ThumbsUp
                                size={20}
                                className={likes > 0 ? "text-blue-500" : ""}
                            />
                            <span>{likes}</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDislikes((prev) => prev + 1);
                                showTemporaryFeedback("Thanks for your feedback!");
                            }}
                            className="flex items-center space-x-2 hover:bg-red-50 transition-colors"
                        >
                            <ThumbsDown
                                size={20}
                                className={dislikes > 0 ? "text-red-500" : ""}
                            />
                            <span>{dislikes}</span>
                        </Button>
                    </div>

                    {/* Notes Section */}
                    <Card className="shadow-lg">
                        <div
                            className="p-4 border-b flex justify-between items-center cursor-pointer"
                            onClick={() => setShowNotesSection(!showNotesSection)}
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen size={20} />
                                <h3 className="text-lg font-semibold">Notes</h3>
                            </div>
                            {showNotesSection ? (
                                <ChevronUp size={20} />
                            ) : (
                                <ChevronDown size={20} />
                            )}
                        </div>

                        {showNotesSection && (
                            <CardContent className="p-4 space-y-4">
                                <div className="space-y-3">
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Take notes for this video..."
                                        className="min-h-32 resize-y"
                                    />
                                    <Button
                                        onClick={handleSaveNotes}
                                        className="flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        {editingNoteId ? "Update Note" : "Save Note"}
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <MessageCircle size={16} />
                                        Saved Notes ({savedNotes.length})
                                    </h4>
                                    {savedNotes.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">
                                            No saved notes yet. Start taking notes!
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {savedNotes.map((note) => (
                                                <div
                                                    key={note.id}
                                                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <p className="whitespace-pre-wrap flex-grow">
                                                            {note.text}
                                                        </p>
                                                        <div className="flex gap-2 ml-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditNote(note)}
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                <Edit2 size={16} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteNote(note.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        {note.timestamp}
                                                    </div>
                                                    {note.editedAt && (
                                                        <div className="text-xs text-gray-500">
                                                            Edited: {note.editedAt}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>

                {/* Right Column: Comments Section */}
                <Card className="w-full md:w-1/3 shadow-lg">
                    <div
                        className="p-4 border-b flex justify-between items-center cursor-pointer"
                        onClick={() => setShowCommentsSection(!showCommentsSection)}
                    >
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} />
                            <h3 className="text-lg font-semibold">Comments</h3>
                        </div>
                        {showCommentsSection ? (
                            <ChevronUp size={20} />
                        ) : (
                            <ChevronDown size={20} />
                        )}
                    </div>

                    {showCommentsSection && (
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-grow"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") handleCommentSubmit();
                                    }}
                                />
                                <Button
                                    onClick={handleCommentSubmit}
                                    className="flex items-center gap-2"
                                >
                                    <Send size={16} />
                                    Post
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No comments yet. Be the first to comment!
                                    </p>
                                ) : (
                                    comments.map((cmt) => (
                                        <div
                                            key={cmt.id}
                                            className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex justify-between">
                                                <span className="font-semibold">{cmt.user}</span>
                                                <span className="text-xs text-gray-500">
                                                    {cmt.timestamp}
                                                </span>
                                            </div>
                                            <p className="mt-1">{cmt.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>
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