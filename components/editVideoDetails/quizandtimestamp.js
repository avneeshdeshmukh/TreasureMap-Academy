import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Clock, Save, Type, HelpCircle } from "lucide-react";

export default function QuizCreator() {
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addQuiz = (newQuiz) => {
    setQuizzes([...quizzes, { ...newQuiz, id: Date.now() }]);
    setShowForm(false);
  };

  const removeQuiz = (id) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Video Quiz Creator
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-600"
          >
            <Plus className="w-5 h-5" />
            Add Quiz
          </Button>
        </header>

        {showForm && (
          <QuizForm onSubmit={addQuiz} onCancel={() => setShowForm(false)} />
        )}

        {/* Group quizzes by timestamp */}
        {Object.entries(
          quizzes.reduce((acc, quiz) => {
            if (!acc[quiz.timestamp]) acc[quiz.timestamp] = [];
            acc[quiz.timestamp].push(quiz);
            return acc;
          }, {})
        ).map(([timestamp, quizzesAtTimestamp]) => (
          <div key={timestamp} className="mb-8">
            <h3 className="text-slate-300 mb-2">
              Timestamp: {Math.floor(timestamp / 60)}:
              {(timestamp % 60).toString().padStart(2, "0")}
            </h3>
            <div className="space-y-4">
              {quizzesAtTimestamp.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onRemove={removeQuiz} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const QuizForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    timestamp: "",
    type: "",
    question: "",
    options: [],
    correctAnswer: "",
    points: 10,
  });

  const quizTypes = [
    { value: "multipleChoice", label: "Multiple Choice" },
    { value: "trueFalse", label: "True/False" },
    { value: "fillBlanks", label: "Fill in the Blanks" },
    { value: "hotspot", label: "Hotspot" },
    { value: "dragDrop", label: "Drag and Drop" },
    { value: "slider", label: "Slider" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Timestamp (seconds into video)
            </label>
            <input
              type="number"
              min="0"
              value={formData.timestamp}
              onChange={(e) =>
                setFormData({ ...formData, timestamp: e.target.value })
              }
              className="w-full bg-slate-700 text-white p-3 rounded-lg"
              placeholder="Enter seconds (e.g., 120)"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quiz Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full bg-slate-700 text-white p-3 rounded-lg"
            >
              <option value="">Select type</option>
              {quizTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.type && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Question
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="w-full bg-slate-700 text-white p-3 rounded-lg"
                placeholder="Enter your question"
              />
            </div>

            {/* Render specific form based on quiz type */}
            {formData.type === "multipleChoice" && (
              <MultipleChoiceForm
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {formData.type === "trueFalse" && (
              <TrueFalseForm formData={formData} setFormData={setFormData} />
            )}
            {formData.type === "fillBlanks" && (
              <FillBlanksForm formData={formData} setFormData={setFormData} />
            )}
            {formData.type === "hotspot" && (
              <HotspotForm formData={formData} setFormData={setFormData} />
            )}
            {formData.type === "dragDrop" && (
              <DragDropForm formData={formData} setFormData={setFormData} />
            )}
            {formData.type === "slider" && (
              <SliderForm formData={formData} setFormData={setFormData} />
            )}
          </>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-600"
          >
            <Save className="w-5 h-5" />
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

const MultipleChoiceForm = ({ formData, setFormData }) => {
  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    });
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({
      ...formData,
      options: updatedOptions,
    });
  };

  const removeOption = (index) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: updatedOptions,
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Options
      </label>
      {formData.options.map((option, index) => (
        <div key={index} className="flex items-center gap-4">
          <input
            type="text"
            value={option}
            onChange={(e) => updateOption(index, e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded-lg"
            placeholder={`Option ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => removeOption(index)}
            className="text-slate-400 hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
      >
        Add Option
      </button>

      <div>
        <label className="block text-sm font-medium text-slate-300 mt-4 mb-2">
          Correct Answer
        </label>
        <select
          value={formData.correctAnswer}
          onChange={(e) =>
            setFormData({ ...formData, correctAnswer: e.target.value })
          }
          className="w-full bg-slate-700 text-white p-3 rounded-lg"
        >
          <option value="">Select the correct answer</option>
          {formData.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const FillBlanksForm = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Correct Answer
    </label>
    <input
      type="text"
      value={formData.correctAnswer}
      onChange={(e) =>
        setFormData({ ...formData, correctAnswer: e.target.value })
      }
      className="w-full bg-slate-700 text-white p-3 rounded-lg"
      placeholder="Enter the correct answer"
    />
  </div>
);

const HotspotForm = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Hotspot Area (Describe or provide coordinates)
    </label>
    <textarea
      value={formData.correctAnswer}
      onChange={(e) =>
        setFormData({ ...formData, correctAnswer: e.target.value })
      }
      className="w-full bg-slate-700 text-white p-3 rounded-lg"
      placeholder="Enter hotspot description or coordinates"
    />
  </div>
);

const DragDropForm = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Drag-and-Drop Description
    </label>
    <textarea
      value={formData.correctAnswer}
      onChange={(e) =>
        setFormData({ ...formData, correctAnswer: e.target.value })
      }
      className="w-full bg-slate-700 text-white p-3 rounded-lg"
      placeholder="Describe the drag-and-drop interaction"
    />
  </div>
);

const SliderForm = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Correct Value for Slider
    </label>
    <input
      type="number"
      value={formData.correctAnswer}
      onChange={(e) =>
        setFormData({ ...formData, correctAnswer: e.target.value })
      }
      className="w-full bg-slate-700 text-white p-3 rounded-lg"
      placeholder="Enter the correct value"
    />
  </div>
);

const QuizCard = ({ quiz, onRemove }) => (
  <div className="bg-slate-800 rounded-xl p-6 flex items-start justify-between">
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-slate-400">
        <Clock className="w-4 h-4" />
        <span>
          {Math.floor(quiz.timestamp / 60)}:
          {(quiz.timestamp % 60).toString().padStart(2, "0")}
        </span>
        <Type className="w-4 h-4" />
        <span className="capitalize">{quiz.type}</span>
      </div>
      <div className="text-white font-medium">{quiz.question}</div>
    </div>
    <button
      onClick={() => onRemove(quiz.id)}
      className="text-slate-400 hover:text-slate-300"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);
