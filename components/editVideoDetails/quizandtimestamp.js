"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  deleteField,
  arrayRemove,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import VideoPreviewCard from "./video-preview-card";

const MAX_HOURS = 23;

export default function QuizCreator() {
  const firestore = getFirestore();
  const { courseId, videoId } = useParams();

  const videoRef = doc(firestore, "videos", videoId);
  const timestampInputRef = useRef(null);

  const [videoDoc, setVideoDoc] = useState(null);
  const [currentHour, setCurrentHour] = useState("00");
  const [currentMinute, setCurrentMinute] = useState("00");
  const [currentSecond, setCurrentSecond] = useState("00");
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [editingTimestampIndex, setEditingTimestampIndex] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [previousTimestamp, setPreviousTimestamp] = useState(null);

  const convertSecondsToHMS = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, "0"), // Ensures 2-digit format
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const displayTime = (totalSeconds) => {
    const { hours, minutes, seconds } = convertSecondsToHMS(totalSeconds);

    // Convert to numbers to remove leading zeros
    const h = Number(hours);
    const m = Number(minutes);
    const s = Number(seconds);

    // Build time parts with correct singular/plural wording
    const parts = [];
    if (h > 0) parts.push(`${h} ${h === 1 ? "hour" : "hours"}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? "minute" : "minutes"}`);
    if (s > 0 || parts.length === 0)
      parts.push(`${s} ${s === 1 ? "second" : "seconds"}`);

    return parts.join(" ");
  };

  const handleTimeChange = (type, value) => {
    if (isNaN(value) || value < 0) return; // Prevent invalid or negative inputs

    let h = parseInt(currentHour, 10);
    let m = parseInt(currentMinute, 10);
    let s = parseInt(currentSecond, 10);

    if (type === "hour") h = Math.min(value, MAX_HOURS);
    if (type === "minute") m = value;
    if (type === "second") s = value;

    // Convert to total seconds
    let totalSeconds = h * 3600 + m * 60 + s;

    // Auto-fix overflow (seconds > 59 → add to minutes, etc.)
    h = Math.min(Math.floor(totalSeconds / 3600), MAX_HOURS);
    m = Math.floor((totalSeconds % 3600) / 60);
    s = totalSeconds % 60;

    // Update total timestamp
    setCurrentTimestamp(totalSeconds);

    // Update UI with two-digit formatting
    setCurrentHour(String(h).padStart(2, "0"));
    setCurrentMinute(String(m).padStart(2, "0"));
    setCurrentSecond(String(s).padStart(2, "0"));
  };

  useEffect(() => {
    const fetchVideo = async () => {
      const vid = await getDoc(videoRef);
      if (vid.exists()) {
        const videoData = vid.data();
        setVideoDoc(videoData);

        // If quizzes already exist, update the state
        if (videoData.quizzes) {
          const fetchedQuizzes = Object.values(videoData.quizzes);
          setTimestamps(fetchedQuizzes);
          console.log(fetchedQuizzes);
        }
      } else {
        console.log("Video not found");
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleAddTimestamp = async () => {
    if (currentTimestamp >= videoDoc.duration || currentTimestamp === 0) {
      handleCancel();
      alert("Please enter a valid timestamp");
      return;
    }

    if (editingTimestampIndex === null) {
      if (timestamps.some((item) => item.timestamp === currentTimestamp)) {
        handleCancel();
        alert("The timestamp already exists. Please update the same.");
        return;
      }
    }

    if (currentTimestamp !== null) {
      const newQuestion = {
        timestamp: currentTimestamp,
        questions: currentQuestions,
      };

      if (editingTimestampIndex !== null) {
        // If we're editing an existing timestamp, compare the new timestamp with the previous one
        const updatedTimestamps = [...timestamps];
        const updatedTimestamp = updatedTimestamps[editingTimestampIndex];

        if (currentTimestamp !== previousTimestamp) {
          // If the timestamp has changed, update Firestore with the new timestamp key
          await updateDoc(videoRef, {
            [`quizzes.${currentTimestamp}`]: newQuestion, // Update Firestore with the new timestamp
          });

          // Remove the old timestamp from Firestore
          await updateDoc(videoRef, {
            [`quizzes.${previousTimestamp}`]: deleteField(), // Remove old timestamp
          });

          // Update the state locally
          updatedTimestamp.timestamp = currentTimestamp; // Change to the new timestamp value
          updatedTimestamp.questions = currentQuestions; // Update the questions
          updatedTimestamps[editingTimestampIndex] = updatedTimestamp;
        } else {
          // If the timestamp has not changed, just update the questions
          updatedTimestamp.questions = currentQuestions;
          updatedTimestamps[editingTimestampIndex] = updatedTimestamp;

          // Update Firestore with the same timestamp key but updated questions
          await updateDoc(videoRef, {
            [`quizzes.${previousTimestamp}`]: updatedTimestamp,
          });
        }

        setTimestamps(updatedTimestamps); // Update local state
        setEditingTimestampIndex(null); // Reset editing state
        setPreviousTimestamp(null); // Clear previous timestamp
      } else {
        // If it's a new timestamp, add it to the state and Firestore
        setTimestamps((prevTimestamps) => [...prevTimestamps, newQuestion]);

        await updateDoc(videoRef, {
          [`quizzes.${currentTimestamp}`]: newQuestion, // Add new timestamp to Firestore
        });

        setPreviousTimestamp(null); // Clear previous timestamp when adding a new one
      }

      // Clear input fields after saving or updating
      setCurrentTimestamp(null);
      setCurrentQuestions([]);
      setSelectedQuizType(null);
      handleCancel();
    }
  };

  const handleEditTimestamp = (index) => {
    const timestampToEdit = timestamps[index];
    const inHours = convertSecondsToHMS(timestampToEdit.timestamp);
    setCurrentHour(inHours.hours);
    setCurrentMinute(inHours.minutes);
    setCurrentSecond(inHours.seconds);
    setPreviousTimestamp(timestampToEdit.timestamp);
    setCurrentTimestamp(timestampToEdit.timestamp);
    setCurrentQuestions([...timestampToEdit.questions]);
    setEditingTimestampIndex(index);

    setTimeout(() => {
      if (timestampInputRef.current) {
        timestampInputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Optional: Add a slight background highlight for better visibility
        timestampInputRef.current.style.transition =
          "background-color 0.5s ease-in-out";
        timestampInputRef.current.style.backgroundColor = "#fff3cd"; // Light yellow highlight

        // Remove highlight after a delay
        setTimeout(() => {
          timestampInputRef.current.style.backgroundColor = "white";
        }, 1000);
      }
    }, 100);
  };

  const handleDeleteTimestamp = async (index) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this?");
    if (!isConfirmed) return;

    const timestampToDelete = timestamps[index].timestamp;
    await updateDoc(videoRef, {
      [`quizzes.${timestampToDelete}`]: deleteField(),
    });
    setTimestamps(timestamps.filter((_, i) => i !== index));
    handleCancel();
  };

  const handleDeleteQuestion = async (index) => {
    const question = currentQuestions[index];
    const ts = timestamps[index].timestamp;
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );
    console.log(isConfirmed);
    if (isConfirmed) {
      await updateDoc(videoRef, {
        [`quizzes.${ts}.questions`]: arrayRemove(question),
      });
      const updatedQuestions = currentQuestions.filter((_, i) => i !== index);
      setCurrentQuestions(updatedQuestions);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(currentQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCurrentQuestions(items);
    console.log(items);
  };

  const handleCancel = () => {
    setCurrentTimestamp(0);
    setCurrentHour("00");
    setCurrentMinute("00");
    setCurrentSecond("00");
    setCurrentQuestions([]);
    setEditingTimestampIndex(null);
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = currentQuestions[index];
    setSelectedQuizType(questionToEdit.type);
    setEditingQuestionIndex(index);
  };

  const handleUpdateQuestion = (updatedQuiz) => {
    const updatedQuestions = [...currentQuestions];
    updatedQuestions[editingQuestionIndex] = updatedQuiz;
    setCurrentQuestions(updatedQuestions);
    setEditingQuestionIndex(null);
    setSelectedQuizType(null);
  };

  const handleAddQuestion = (quiz) => {
    setCurrentQuestions([...currentQuestions, quiz]);
    setSelectedQuizType(null);
  };

  const renderQuizTypeForm = () => {
    if (!selectedQuizType) return null;

    const existingQuestion =
      editingQuestionIndex !== null
        ? currentQuestions[editingQuestionIndex]
        : null;

    switch (selectedQuizType) {
      case "mcq":
        return (
          <MultipleChoiceForm
            onSubmit={
              editingQuestionIndex !== null
                ? handleUpdateQuestion
                : handleAddQuestion
            }
            existingQuestion={existingQuestion}
          />
        );
      case "fillBlanks":
        return (
          <FillBlanksForm
            onSubmit={
              editingQuestionIndex !== null
                ? handleUpdateQuestion
                : handleAddQuestion
            }
            existingQuestion={existingQuestion}
          />
        );
      case "trueFalse":
        return (
          <TrueFalseForm
            onSubmit={
              editingQuestionIndex !== null
                ? handleUpdateQuestion
                : handleAddQuestion
            }
            existingQuestion={existingQuestion}
          />
        );
      case "slider":
        return (
          <SliderForm
            onSubmit={
              editingQuestionIndex !== null
                ? handleUpdateQuestion
                : handleAddQuestion
            }
            existingQuestion={existingQuestion}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Quiz Creator</h2>
      {videoDoc && (
        <div>
          <VideoPreviewCard videoData={videoDoc} />
        </div>
      )}

      <div
        className="p-2 my-3 flex gap-2 items-center border rounded-lg"
        ref={timestampInputRef}
      >
        <label>Timestamp (HH:MM:SS)</label>

        <Input
          type="number"
          value={currentHour}
          onChange={(e) => handleTimeChange("hour", Number(e.target.value))}
          placeholder="HH"
          className="w-16 text-center"
        />

        <span>:</span>

        <Input
          type="number"
          value={currentMinute}
          onChange={(e) => handleTimeChange("minute", Number(e.target.value))}
          placeholder="MM"
          className="w-16 text-center"
        />

        <span>:</span>

        <Input
          type="number"
          value={currentSecond}
          onChange={(e) => handleTimeChange("second", Number(e.target.value))}
          placeholder="SS"
          className="w-16 text-center"
        />
      </div>

      {currentTimestamp !== 0 && (
        <>
          <p className="text-slate-500 text-sm mb-2">
            (Select the type of quiz you want to add)
          </p>
          <Tabs>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger
                onClick={() => setSelectedQuizType("mcq")}
                className={`${
                  selectedQuizType === "mcq"
                    ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl"
                    : "h-10"
                }`}
              >
                Multiple Choice
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSelectedQuizType("fillBlanks")}
                className={`${
                  selectedQuizType === "fillBlanks"
                    ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl"
                    : "h-10"
                }`}
              >
                Fill Blanks
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSelectedQuizType("trueFalse")}
                className={`${
                  selectedQuizType === "trueFalse"
                    ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl"
                    : "h-10"
                }`}
              >
                True/False
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSelectedQuizType("slider")}
                className={`${
                  selectedQuizType === "slider"
                    ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl"
                    : "h-10"
                }`}
              >
                Slider
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {renderQuizTypeForm()}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mt-4"
                >
                  <h3 className="font-semibold mb-2">Current Questions</h3>
                  {currentQuestions.map((q, index) => (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border rounded-lg p-2 mb-2 bg-white cursor-move flex justify-between items-center"
                        >
                          <div>
                            <p>{q.question}</p>
                            <p className="text-sm text-gray-500">{q.type}</p>
                          </div>
                          <div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleEditQuestion(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteQuestion(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            onClick={handleAddTimestamp}
            disabled={currentQuestions.length === 0}
            className="mt-4"
            variant="ghost"
          >
            {editingTimestampIndex !== null
              ? "Update Timestamp"
              : "Save Timestamp"}
          </Button>

          <Button onClick={handleCancel} className="mt-4" variant="danger">
            Cancel
          </Button>
        </>
      )}

      {videoDoc && timestamps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Saved Timestamps</h3>
          {timestamps.map((ts, index) => (
            <Card key={index} className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <h4>Timestamp: {displayTime(ts.timestamp)}</h4>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditTimestamp(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTimestamp(index)}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ts.questions.map((q, qIndex) => (
                  <div key={qIndex} className="border-b py-2">
                    <p>{q.question}</p>
                    <p className="text-sm text-gray-500">{q.type}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const MultipleChoiceForm = ({ onSubmit, existingQuestion }) => {
  // Initialize with empty array if existingQuestion is null/undefined
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [points, setPoints] = useState(1); // New state for points

  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question || "");
      setOptions(existingQuestion.options || ["", ""]);
      setCorrectAnswer(existingQuestion.correctAnswer || null);
      setPoints(existingQuestion.points || 1); // Load points if editing
    } else {
      // Reset to default state when not editing
      setQuestion("");
      setOptions(["", ""]); // Initialize with two empty options
      setCorrectAnswer(null);
    }
  }, [existingQuestion]);

  const handleSubmit = () => {
    if (correctAnswer) {
      onSubmit({
        type: "mcq",
        question,
        options,
        correctAnswer,
        points, // Include points in submission
      });
      // Only reset if we're not editing
      if (!existingQuestion) {
        setQuestion("");
        setOptions(["", ""]);
        setCorrectAnswer(null);
        setPoints(1); // Reset points
      }
    }
  };

  const addOption = () => {
    if (options.length + 1 > 4) {
      alert("You can add maximum of 4 options");
      return;
    }
    setOptions([...options, ""]);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const deleteOption = (index) => {
    if (options.length > 2) {
      // Maintain minimum of 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      // Reset correct answer if deleted option was the correct one
      if (correctAnswer === options[index]) {
        setCorrectAnswer(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((opt, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => updateOption(index, e.target.value)}
          />
          {options.length > 2 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteOption(index)}
            >
              X
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" onClick={addOption}>
        Add Option
      </Button>

      <Select
        options={options
          .filter((opt) => opt.trim() !== "")
          .map((opt) => ({
            value: opt,
            label: opt,
          }))}
        onChange={(selectedOption) =>
          setCorrectAnswer(selectedOption?.value || null)
        }
        value={
          correctAnswer ? { value: correctAnswer, label: correctAnswer } : null
        }
        placeholder="Select Correct Answer"
      />

      {/* Points Input */}
      <label className="block font-medium">Points</label>
      <p className="text-sm text-gray-500 -mt-1">
        1 - Easy, 2 - Medium, 3 - Difficult, 4 - Very Difficult
      </p>
      <Input
        type="number"
        value={points}
        onChange={(e) =>
          setPoints(Math.max(1, Math.min(4, Number(e.target.value))))
        }
        min="1"
        max="4"
        className="w-20 text-center"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={
            !question ||
            !correctAnswer ||
            options.filter((opt) => opt.trim() !== "").length < 2
          }
        >
          {existingQuestion ? "Update Question" : "Add Question"}
        </Button>
      </div>
    </div>
  );
};

const FillBlanksForm = ({ onSubmit, existingQuestion }) => {
  const [question, setQuestion] = useState(existingQuestion?.question || "");
  const [correctAnswer, setCorrectAnswer] = useState(
    existingQuestion?.correctAnswer || ""
  );
  const [points, setPoints] = useState(1); // New state for points

  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question);
      setCorrectAnswer(existingQuestion.correctAnswer);
      setPoints(existingQuestion.points || 1); // Load points if editing
    }
  }, [existingQuestion]);

  // Check if blank exists in the question
  const hasBlank = question.includes("<blank>");

  const toggleBlank = () => {
    if (hasBlank) {
      setQuestion(question.replace("<blank>", "")); // Remove blank
    } else {
      // Insert blank at the cursor position or at the end
      setQuestion((prev) => {
        const selectionStart =
          document.getElementById("question-input")?.selectionStart ||
          prev.length;
        return (
          prev.slice(0, selectionStart) + "<blank>" + prev.slice(selectionStart)
        );
      });
    }
  };

  const handleSubmit = () => {
    if (!hasBlank) {
      alert("Each fill-in-the-blank question must contain a blank.");
      return;
    }
    onSubmit({
      type: "fillBlanks",
      question,
      correctAnswer,
      points, // Include points in submission
    });
    setQuestion("");
    setCorrectAnswer("");
    setPoints(1); // Reset points
  };

  return (
    <div className="space-y-4">
      <Input
        id="question-input"
        placeholder="Enter question with blank"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <Button
        onClick={toggleBlank}
        className={
          hasBlank
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-yellow-500 hover:bg-yellow-600"
        }
      >
        {hasBlank ? "Remove Blank" : "Insert Blank"}
      </Button>

      <Input
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />

      {/* Points Input */}
      <label className="block font-medium">Points</label>
      <p className="text-sm text-gray-500 -mt-1">
        1 - Easy, 2 - Medium, 3 - Difficult, 4 - Very Difficult
      </p>
      <Input
        type="number"
        value={points}
        onChange={(e) =>
          setPoints(Math.max(1, Math.min(4, Number(e.target.value))))
        }
        min="1"
        max="4"
        className="w-20 text-center"
      />

      <Button onClick={handleSubmit} disabled={!question || !correctAnswer}>
        {existingQuestion ? "Update Question" : "Add Question"}
      </Button>
    </div>
  );
};


const TrueFalseForm = ({ onSubmit, existingQuestion }) => {
  const [question, setQuestion] = useState(existingQuestion?.question || "");
  const [correctAnswer, setCorrectAnswer] = useState(
    existingQuestion?.correctAnswer || null
  );
  const [points, setPoints] = useState(1); // New state for points

  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question);
      setCorrectAnswer(existingQuestion.correctAnswer);
      setPoints(existingQuestion.points || 1); // Load points if editing
    }
  }, [existingQuestion]);

  const handleSubmit = () => {
    if (correctAnswer !== null) {
      onSubmit({
        type: "trueFalse",
        question,
        correctAnswer,
        points, // Include points in submission
      });
      setQuestion("");
      setCorrectAnswer(null);
      setPoints(1); // Reset points
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter True/False question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Select
        options={[
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ]}
        onChange={(selectedOption) =>
          setCorrectAnswer(selectedOption?.value || null)
        }
        value={
          correctAnswer ? { value: correctAnswer, label: correctAnswer } : null
        }
        placeholder="Select Correct Answer"
      />

      {/* Points Input */}
      <label className="block font-medium">Points</label>
      <p className="text-sm text-gray-500 -mt-1">
        1 - Easy, 2 - Medium, 3 - Difficult, 4 - Very Difficult
      </p>
      <Input
        type="number"
        value={points}
        onChange={(e) =>
          setPoints(Math.max(1, Math.min(4, Number(e.target.value))))
        }
        min="1"
        max="4"
        className="w-20 text-center"
      />

      <Button
        onClick={handleSubmit}
        disabled={!question || correctAnswer === null}
      >
        {existingQuestion ? "Update Question" : "Add Question"}
      </Button>
    </div>
  );
};

const SliderForm = ({ onSubmit, existingQuestion }) => {
  const [question, setQuestion] = useState(existingQuestion?.question || "");
  const [correctAnswer, setCorrectAnswer] = useState(
    existingQuestion?.correctAnswer || 50
  );
  const [min, setMin] = useState(existingQuestion?.min || 0);
  const [max, setMax] = useState(existingQuestion?.max || 100);
  const [points, setPoints] = useState(1); // New state for point

  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question);
      setCorrectAnswer(existingQuestion.correctAnswer);
      setMin(existingQuestion.min);
      setMax(existingQuestion.max);
      setPoints(existingQuestion.points || 1); // Load points if editing
    }
  }, [existingQuestion]);

  const handleSubmit = () => {
    onSubmit({
      type: "slider",
      question,
      correctAnswer,
      min,
      max,
      points, // Include points in submission
    });
    setQuestion("");
    setCorrectAnswer(50);
    setMin(0);
    setMax(100);
  };

  const handleRangeChange = (e) => {
    const value = Number(e.target.value);
    setCorrectAnswer(value);
    setPoints(1); // Reset points
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter slider question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="Min Value"
          value={min}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMin(value);
            if (correctAnswer < value) setCorrectAnswer(value);
          }}
        />
        <Input
          type="number"
          placeholder="Max Value"
          value={max}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMax(value);
            if (correctAnswer > value) setCorrectAnswer(value);
          }}
        />
      </div>
      <div className="space-y-2">
        <label>
          <span className="font-semibold">
            Select Correct Answer: {correctAnswer}
          </span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          value={correctAnswer}
          onChange={handleRangeChange}
          className="w-full"
        />
      </div>

      {/* Points Input */}
      <label className="block font-medium">Points</label>
      <p className="text-sm text-gray-500 -mt-1">
        1 - Easy, 2 - Medium, 3 - Difficult, 4 - Very Difficult
      </p>
      <Input
        type="number"
        value={points}
        onChange={(e) =>
          setPoints(Math.max(1, Math.min(4, Number(e.target.value))))
        }
        min="1"
        max="4"
        className="w-20 text-center"
      />

      <Button onClick={handleSubmit} disabled={!question}>
        {existingQuestion ? "Update Question" : "Add Question"}
      </Button>
    </div>
  );
};
