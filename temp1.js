"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function QuizCreator() {
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [editingTimestampIndex, setEditingTimestampIndex] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  const handleAddTimestamp = () => {
    if (currentTimestamp !== null) {
      const newTimestampQuiz = {
        timestamp: currentTimestamp,
        questions: currentQuestions,
      };
      
      if (editingTimestampIndex !== null) {
        // Update existing timestamp
        const updatedTimestamps = [...timestamps];
        updatedTimestamps[editingTimestampIndex] = newTimestampQuiz;
        setTimestamps(updatedTimestamps);
        setEditingTimestampIndex(null);
      } else {
        // Add new timestamp
        setTimestamps([...timestamps, newTimestampQuiz]);
      }
      
      setCurrentTimestamp(null);
      setCurrentQuestions([]);
      setSelectedQuizType(null);
    }
  };

  const handleEditTimestamp = (index) => {
    const timestampToEdit = timestamps[index];
    setCurrentTimestamp(timestampToEdit.timestamp);
    setCurrentQuestions([...timestampToEdit.questions]);
    setEditingTimestampIndex(index);
  };

  const handleDeleteTimestamp = (index) => {
    setTimestamps(timestamps.filter((_, i) => i !== index));
  };

  const handleAddQuestion = (quiz) => {
    setCurrentQuestions([...currentQuestions, quiz]);
    setSelectedQuizType(null);
  };

  const handleDeleteQuestion = (index) => {
    setCurrentQuestions(currentQuestions.filter((_, i) => i !== index));
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
    setEditingQuestionIndex(currentQuestions[index]); 
    
  };

  const renderQuizTypeForm = () => {
    if (!selectedQuizType) return null;
  
    
  
    switch (selectedQuizType) {
      case "mcq":
        return <MultipleChoiceForm onSubmit={handleAddQuestion} />;
      case "fillBlanks":
        return <FillBlanksForm onSubmit={handleAddQuestion} />;
      case "trueFalse":
        return <TrueFalseForm onSubmit={handleAddQuestion}  />;
      case "slider":
        return <SliderForm onSubmit={handleAddQuestion} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Quiz Creator</h2>
      <div className="mb-4">
        <label>Timestamp (seconds)</label>
        <Input
          type="number"
          value={currentTimestamp || ""}
          onChange={(e) => setCurrentTimestamp(Number(e.target.value))}
          placeholder="Enter timestamp"
        />
      </div>

      {currentTimestamp !== null && (
        <>
          <Tabs>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger onClick={() => setSelectedQuizType("mcq")}>Multiple Choice</TabsTrigger>
              <TabsTrigger onClick={() => setSelectedQuizType("fillBlanks")}>Fill Blanks</TabsTrigger>
              <TabsTrigger onClick={() => setSelectedQuizType("trueFalse")}>True/False</TabsTrigger>
              <TabsTrigger onClick={() => setSelectedQuizType("slider")}>Slider</TabsTrigger>
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

      {timestamps.length > 0 && (
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

const MultipleChoiceForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const handleSubmit = () => {
    if (correctAnswer) {
      onSubmit({
        type: "mcq",
        question,
        options,
        correctAnswer,
      });
      setQuestion("");
      setOptions(["", ""]);
      setCorrectAnswer(null);
    }
  };

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((opt, index) => (
        <Input
          key={index}
          placeholder={`Option ${index + 1}`}
          value={opt}
          onChange={(e) => updateOption(index, e.target.value)}
        />
      ))}
      <Button onClick={addOption}>Add Option</Button>
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

      <Button
        onClick={handleSubmit}
        disabled={
          !question ||
          !correctAnswer ||
          options.filter((opt) => opt.trim() !== "").length < 2
        }
      >
        Add Question
      </Button>
    </div>
  );
};

const FillBlanksForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

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
        Add Question
      </Button>
    </div>
  );
};

const TrueFalseForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const handleSubmit = () => {
    if (correctAnswer) {
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

      <Button onClick={handleSubmit} disabled={!question || !correctAnswer}>
        Add Question
      </Button>
    </div>
  );
};

const SliderForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(50); // Default to midpoint of range
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  const handleSubmit = () => {
    onSubmit({
      type: "slider",
      question,
      correctAnswer,
      min,
      max,
    });
    setQuestion("");
    setCorrectAnswer(50); // Reset to default midpoint
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
            if (correctAnswer < value) setCorrectAnswer(value); // Adjust correctAnswer if out of range
          }}
        />
        <Input
          type="number"
          placeholder="Max Value"
          value={max}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMax(value);
            if (correctAnswer > value) setCorrectAnswer(value); // Adjust correctAnswer if out of range
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
        Add Question
      </Button>
    </div>
  );
};