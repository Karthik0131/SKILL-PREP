const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  rollno: { type: String, unique: true, required: true }, // Unique college roll number
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  quizAttempts: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
      score: { type: Number, required: true },
      attemptedAt: { type: Date, default: Date.now },
      timeTaken: { type: Number, required: true }, // Time taken in seconds
      responses: [
        {
          questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
          selectedOption: { type: Number, required: true }, // Stores index of selected option (0,1,2,3)
          isCorrect: { type: Boolean, required: true },
        }
      ],
    }
  ],

  performance: {
    weakAreas: { type: Map, of: Number, default: {} }, // Example: { "Data Structures": 40, "Probability": 60 }
    strongAreas: { type: Map, of: Number, default: {} }, // Example: { "Algorithms": 90, "Verbal": 80 }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);

module.exports = Student;
