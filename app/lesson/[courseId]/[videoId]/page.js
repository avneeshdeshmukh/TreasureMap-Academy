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
import { auth } from "@/lib/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, getFirestore, updateDoc, setDoc, arrayUnion } from "firebase/firestore";

export default function LessonPage() {
    const firestore = getFirestore();
    const { courseId, videoId } = useParams();
    const userId = auth.currentUser.uid;

    const videoRef = doc(firestore, "videos", videoId);
    const VIRef = doc(firestore, "videoInteraction", videoId);

    const [video, setVideo] = useState(null);
    const [videoInt, setVideoInt] = useState(null);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userFeedback, setUserFeedback] = useState(null);
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

    const videoNotesRef = doc(firestore, "videoNotes", `${videoId}_${userId}`);

    const showTemporaryFeedback = (message) => {
        console.log(message);
    };

    const fetchSavedNotes = async () => {
        const docSnap = await getDoc(videoNotesRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setSavedNotes(data.notes || []);  // Default to an empty array if no notes
        } else {
            // Document does not exist, create it with an empty notes array
            await setDoc(videoNotesRef, {
                videoId,
                userId,
                notes: [],
            });
            setSavedNotes([]); // No notes, so start with an empty array
        }
    };

    useEffect(() => {
        fetchSavedNotes();
    }, [videoId, userId]);

    const handleLike = async () => {
        if (userFeedback === "like") {
            setLikes(0);
            setUserFeedback(null);
            await updateDoc(VIRef, {
                likes: likes - 1,
            });
        } else {
            setLikes(1);
            setDislikes(0);
            setUserFeedback("like");
            showTemporaryFeedback("Thanks for your feedback!");
            await updateDoc(VIRef, {
                likes: likes + 1,
                dislikes: dislikes > 0 ? dislikes - 1 : dislikes,
            });
        }
    };

    const handleDislike = async () => {
        if (userFeedback === "dislike") {
            setDislikes(0);
            setUserFeedback(null);
            await updateDoc(VIRef, {
                dislikes: dislikes - 1,
            });
        } else {
            setDislikes(1);
            setLikes(0);
            setUserFeedback("dislike");
            showTemporaryFeedback("Thanks for your feedback!");
            await updateDoc(VIRef, {
                dislikes: dislikes + 1,
                likes: likes > 0 ? likes - 1 : likes,
            });
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
                setLikes(VIData.likes);
                setDislikes(VIData.dislikes);
            }
            else {
                console.log("Video not found")
            }
        }

        fetchVideo();
    }, [videoId])


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
                setEditingNoteIndex(null);  // Clear editing state
            } else {
                // If saving a new note, append to the array
                await updateDoc(videoNotesRef, {
                    notes: arrayUnion(newNote),
                });
            }

            setNotes(""); // Clear the text area
            fetchSavedNotes();  // Re-fetch saved notes after saving or updating
        }
    };

    // Handle Note Deletion
    const handleDeleteNote = async (index) => {
        const updatedNotes = savedNotes.filter((_, i) => i !== index);
        await updateDoc(videoNotesRef, {
            notes: updatedNotes,
        });
        fetchSavedNotes();  // Re-fetch saved notes after deletion
    };

    // Handle Note Editing
    const handleEditNote = (index) => {
        setNotes(savedNotes[index].text);
        setEditingNoteIndex(index);
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
            ) : <></>}


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
                            onClick={handleLike}
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
                            onClick={handleDislike}
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
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen size={20} />
                                <h3 className="text-lg font-semibold">Notes</h3>
                            </div>
                            {savedNotes.length > 0 ? (
                                <ChevronUp size={20} />
                            ) : (
                                <ChevronDown size={20} />
                            )}
                        </div>

                        <CardContent className="p-4 space-y-4">
                            {/* Add/Update Note Form */}
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
                                    {editingNoteIndex !== null ? "Update Note" : "Save Note"}
                                </Button>
                            </div>

                            {/* Saved Notes */}
                            <div className="space-y-3">
                                <h4 className="font-medium">Saved Notes ({savedNotes.length})</h4>
                                {savedNotes.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No saved notes yet. Start taking notes!
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {savedNotes.map((note, index) => (
                                            <div
                                                key={index}
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
                                                            onClick={() => handleEditNote(index)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteNote(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    {note.timestamp}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
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