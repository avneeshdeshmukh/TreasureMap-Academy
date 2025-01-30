"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function QuizCreator() {
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  useEffect(() => {
    if (editingQuestionIndex !== null) {
      const questionToEdit = currentQuestions[editingQuestionIndex];
      setSelectedQuizType(questionToEdit.type);
    }
  }, [editingQuestionIndex]);

  const handleEditQuestion = (index) => {
    setEditingQuestionIndex(index);
  };

  const handleAddQuestion = (quiz) => {
    const updatedQuestions = [...currentQuestions];
    if (editingQuestionIndex !== null) {
      updatedQuestions[editingQuestionIndex] = quiz;
      setEditingQuestionIndex(null);
    } else {
      updatedQuestions.push(quiz);
    }
    setCurrentQuestions(updatedQuestions);
    setSelectedQuizType(null);
  };

  const renderQuizTypeForm = () => {
    if (!selectedQuizType) return null;
    
    const existingQuestion = editingQuestionIndex !== null ? currentQuestions[editingQuestionIndex] : null;
    
    switch (selectedQuizType) {
      case "mcq":
        return <MultipleChoiceForm onSubmit={handleAddQuestion} existingQuestion={existingQuestion} />;
      case "fillBlanks":
        return <FillBlanksForm onSubmit={handleAddQuestion} existingQuestion={existingQuestion} />;
      case "trueFalse":
        return <TrueFalseForm onSubmit={handleAddQuestion} existingQuestion={existingQuestion} />;
      case "slider":
        return <SliderForm onSubmit={handleAddQuestion} existingQuestion={existingQuestion} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Quiz Creator</h2>
      {renderQuizTypeForm()}
      <DragDropContext>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4">
              {currentQuestions.map((q, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border p-2 mb-2 bg-white cursor-move flex justify-between items-center">
                      <div>
                        <p>{q.question}</p>
                        <p className="text-sm text-gray-500">{q.type}</p>
                      </div>
                      <div>
                        <Button size="sm" onClick={() => handleEditQuestion(index)}>Edit</Button>
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
    </div>
  );
}

const MultipleChoiceForm = ({ onSubmit, existingQuestion }) => {
  const [question, setQuestion] = useState(existingQuestion?.question || "");
  const [options, setOptions] = useState(existingQuestion?.options || ["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(existingQuestion?.correctAnswer || null);

  useEffect(() => {
    setQuestion(existingQuestion?.question || "");
    setOptions(existingQuestion?.options || ["", ""]);
    setCorrectAnswer(existingQuestion?.correctAnswer || null);
  }, [existingQuestion]);

  return (
    <div>
      <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter question" />
      <Button onClick={() => onSubmit({ type: "mcq", question, options, correctAnswer })}>Save</Button>
    </div>
  );
};

// Implement similar logic for other question types (FillBlanksForm, TrueFalseForm, SliderForm)
