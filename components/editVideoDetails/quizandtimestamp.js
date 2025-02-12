"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { getFirestore, doc, updateDoc, getDoc, deleteField, arrayRemove } from "firebase/firestore";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import VideoPreviewCard from "./video-preview-card"

export default function QuizCreator() {
  const firestore = getFirestore();
  const { courseId, videoId } = useParams();

  const videoRef = doc(firestore, "videos", videoId);
  const timestampInputRef = useRef(null);

  const [videoDoc, setVideoDoc] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [editingTimestampIndex, setEditingTimestampIndex] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [previousTimestamp, setPreviousTimestamp] = useState(null);

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
        }
      } else {
        console.log("Video not found");
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleAddTimestamp = async () => {
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
          updatedTimestamp.timestamp = currentTimestamp;  // Change to the new timestamp value
          updatedTimestamp.questions = currentQuestions;  // Update the questions
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
    }
  };

  const handleEditTimestamp = (index) => {
    const timestampToEdit = timestamps[index];
    setPreviousTimestamp(timestampToEdit.timestamp);
    setCurrentTimestamp(timestampToEdit.timestamp);
    setCurrentQuestions([...timestampToEdit.questions]);
    setEditingTimestampIndex(index);

    setTimeout(() => {
      if (timestampInputRef.current) {
        timestampInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  
        // Optional: Add a slight background highlight for better visibility
        timestampInputRef.current.style.transition = "background-color 0.5s ease-in-out";
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
  };

  const handleDeleteQuestion = async (index) => {
    const question = currentQuestions[index];
    const ts = timestamps[index].timestamp;
    const isConfirmed = window.confirm("Are you sure you want to delete this question?");
    console.log(isConfirmed)
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

    const existingQuestion = editingQuestionIndex !== null ? currentQuestions[editingQuestionIndex] : null;

    switch (selectedQuizType) {
      case "mcq":
        return <MultipleChoiceForm onSubmit={editingQuestionIndex !== null ? handleUpdateQuestion : handleAddQuestion} existingQuestion={existingQuestion} />;
      case "fillBlanks":
        return <FillBlanksForm onSubmit={editingQuestionIndex !== null ? handleUpdateQuestion : handleAddQuestion} existingQuestion={existingQuestion} />;
      case "trueFalse":
        return <TrueFalseForm onSubmit={editingQuestionIndex !== null ? handleUpdateQuestion : handleAddQuestion} existingQuestion={existingQuestion} />;
      case "slider":
        return <SliderForm onSubmit={editingQuestionIndex !== null ? handleUpdateQuestion : handleAddQuestion} existingQuestion={existingQuestion} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Quiz Creator</h2>
      {videoDoc && (<div>
        <VideoPreviewCard videoData={videoDoc} />
      </div>)}


      <div className="py-2">
        <label>Timestamp (seconds)</label>
        <Input
          type="number"
          ref={timestampInputRef}
          value={currentTimestamp || ""}
          onChange={(e) => setCurrentTimestamp(Number(e.target.value))}
          placeholder="Enter timestamp"
        />
      </div>

      {currentTimestamp !== null && (
        <>
          <p className="text-slate-500 text-sm mb-2">(Select the type of quiz you want to add)</p>
          <Tabs>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger onClick={() => setSelectedQuizType("mcq")}
                className={`${selectedQuizType === "mcq" ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl" : ""
                  }`}
              >Multiple Choice</TabsTrigger>
              <TabsTrigger onClick={() => setSelectedQuizType("fillBlanks")}
                className={`${selectedQuizType === "fillBlanks" ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl" : ""
                  }`}
              >Fill Blanks</TabsTrigger>
              <TabsTrigger onClick={() => setSelectedQuizType("trueFalse")}
                className={`${selectedQuizType === "trueFalse" ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl" : ""
                  }`}
              >True/False</TabsTrigger>
              <TabsTrigger onClick={() => setSelectedQuizType("slider")}
                className={`${selectedQuizType === "slider" ? "font-bold bg-yellow-300 text-yellow-700 h-10 rounded-xl" : ""
                  }`}
              >Slider</TabsTrigger>
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
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border p-2 mb-2 bg-white cursor-move flex justify-between items-center"
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
            {editingTimestampIndex !== null ? 'Update Timestamp' : 'Save Timestamp'}
          </Button>
        </>
      )}

      {videoDoc && timestamps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Saved Timestamps</h3>
          {timestamps.map((ts, index) => (
            <Card key={index} className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <h4>Timestamp: {ts.timestamp} seconds</h4>
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


  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question || "");
      setOptions(existingQuestion.options || ["", ""]);
      setCorrectAnswer(existingQuestion.correctAnswer || null);
    } else {
      // Reset to default state when not editing
      setQuestion("");
      setOptions(["", ""]);  // Initialize with two empty options
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
      });
      // Only reset if we're not editing
      if (!existingQuestion) {
        setQuestion("");
        setOptions(["", ""]);
        setCorrectAnswer(null);
      }
    }
  };

  const addOption = () => setOptions([...options, ""]);

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const deleteOption = (index) => {
    if (options.length > 2) {  // Maintain minimum of 2 options
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
      <Button
        variant="outline"
        onClick={addOption}
      >
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

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={
            !question ||
            !correctAnswer ||
            options.filter((opt) => opt.trim() !== "").length < 2
          }
        >
          {existingQuestion ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </div>
  );
};

const FillBlanksForm = ({ onSubmit, existingQuestion }) => {
  const [question, setQuestion] = useState(existingQuestion?.question || "");
  const [correctAnswer, setCorrectAnswer] = useState(existingQuestion?.correctAnswer || "");

  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question);
      setCorrectAnswer(existingQuestion.correctAnswer);
    }
  }, [existingQuestion]);

  const handleSubmit = () => {
    onSubmit({
      type: "fillBlanks",
      question,
      correctAnswer,
    });
    setQuestion("");
    setCorrectAnswer("");
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter question with blank"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Input
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={!question || !correctAnswer}>
        {existingQuestion ? 'Update Question' : 'Add Question'}
      </Button>
    </div>
  );
};

const TrueFalseForm = ({ onSubmit, existingQuestion }) => {
  const [question, setQuestion] = useState(existingQuestion?.question || "");
  const [correctAnswer, setCorrectAnswer] = useState(existingQuestion?.correctAnswer || null);

  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question);
      setCorrectAnswer(existingQuestion.correctAnswer);
    }
  }, [existingQuestion]);

  const handleSubmit = () => {
    if (correctAnswer !== null) {
      onSubmit({
        type: "trueFalse",
        question,
        correctAnswer,
      });
      setQuestion("");
      setCorrectAnswer(null);
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
      <Button onClick={handleSubmit} disabled={!question || correctAnswer === null}>
        {existingQuestion ? 'Update Question' : 'Add Question'}
      </Button>
    </div>
  );
};

const SliderForm = ({ onSubmit, existingQuestion }) => {
  const [question, setQuestion] = useState(existingQuestion?.question || "");
  const [correctAnswer, setCorrectAnswer] = useState(existingQuestion?.correctAnswer || 50);
  const [min, setMin] = useState(existingQuestion?.min || 0);
  const [max, setMax] = useState(existingQuestion?.max || 100);

  useEffect(() => {
    if (existingQuestion) {
      setQuestion(existingQuestion.question);
      setCorrectAnswer(existingQuestion.correctAnswer);
      setMin(existingQuestion.min);
      setMax(existingQuestion.max);
    }
  }, [existingQuestion]);

  const handleSubmit = () => {
    onSubmit({
      type: "slider",
      question,
      correctAnswer,
      min,
      max,
    });
    setQuestion("");
    setCorrectAnswer(50);
    setMin(0);
    setMax(100);
  };

  const handleRangeChange = (e) => {
    const value = Number(e.target.value);
    setCorrectAnswer(value);
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
          <span className="font-semibold">Select Correct Answer: {correctAnswer}</span>
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
      <Button onClick={handleSubmit} disabled={!question}>
        {existingQuestion ? 'Update Question' : 'Add Question'}
      </Button>
    </div>
  );
};