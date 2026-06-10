import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true, // LaTeX supported
      trim: true,
      unique: true,
    },

    options: {
      type: [String], // LaTeX options
      required: true,
      validate: {
        validator: function (v: any) {
          return v.length >= 4;
        },
        message: 'At least four options are required',
      },
    },

    answer: {
      type: String, // index of correct option
      required: true,
      min: 0,
    },

    explanation: {
      type: String, // LaTeX / markdown
    },
    topic: {
      type: String,
      required: false,
    },
    subject: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isMock: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: false,
    },
    program: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt
  },
);
export const QuestionModel = mongoose.model('Question', QuestionSchema);
