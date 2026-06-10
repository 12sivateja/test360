import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import { Question } from '@interfaces/question.interface';
import { QuestionModel } from '@models/questions.model';
@Service()
export class QuestionService {
  public async createBulkQuestions(questionsData: Question[]): Promise<any> {
    try {
      // 1. Normalize helper
      const normalize = (text?: any) =>
        typeof text === 'string'
          ? text.trim().toLowerCase().replace(/\s+/g, ' ')
          : String(text ?? '')
              .trim()
              .toLowerCase();

      // 2. Normalize incoming data
      const normalizedData = questionsData?.map(q => {
        const normalizedOptions = (q.options || []).map(opt => (typeof opt === 'string' ? opt.trim() : String(opt).trim()));

        return {
          ...q,
          question: typeof q.question === 'string' ? q.question.trim() : String(q.question),
          answer: typeof q.answer === 'string' ? q.answer.trim() : String(q.answer),

          normalizedQuestion: normalize(q.question),
          normalizedAnswer: normalize(q.answer),
          normalizedOptions: normalizedOptions.map(opt => normalize(opt)),

          options: normalizedOptions,
          isMock: !!q.isMock,
          isActive: true,
        };
      });

      // 3. Fetch existing questions
      const existingQuestions = await QuestionModel.find({
        $or: normalizedData.map(q => ({
          question: q.question,
          answer: q.answer,
          subject: q.subject,
          level: q.level,
          isMock: q.isMock,
          isActive: true,
          program: q.program,
        })),
      })
        .collation({ locale: 'en', strength: 2 })
        .lean();

      // 4. Build lookup set
      const existingSet = new Set(
        existingQuestions.map(q => {
          const optionsKey = (q.options || []).map((opt: any) => normalize(opt)).join('|');

          return `${normalize(q.question)}|${normalize(q.answer)}|${optionsKey}|${q.subject}|${q.level}|${q.isMock}|${q.isActive}`;
        }),
      );

      const toInsert: any[] = [];
      const duplicates: any[] = [];

      // 5. Filter duplicates
      for (const q of normalizedData) {
        const optionsKey = q.normalizedOptions.join('|');

        const key = `${q.normalizedQuestion}|${q.normalizedAnswer}|${optionsKey}|${q.subject}|${q.level}|${q.isMock}|${q.isActive}`;

        if (existingSet.has(key)) {
          duplicates.push({
            question: q.question,
            answer: q.answer,
            subject: q.subject,
            level: q.level,
            isMock: q.isMock,
            program: q.program,
          });
        } else {
          toInsert.push({
            question: q.question,
            answer: q.answer,
            options: q.options,
            subject: q.subject,
            level: q.level,
            topic: q.topic,
            isMock: q.isMock,
            isActive: true,
            explanation: q.explanation,
            program: q.program,
          });

          existingSet.add(key);
        }
      }

      // 6. Insert
      let insertedDocs: any[] = [];
      if (toInsert.length > 0) {
        insertedDocs = await QuestionModel.insertMany(toInsert);
      }

      // 7. Response
      return {
        success: true,
        insertedCount: insertedDocs.length,
        duplicateCount: duplicates.length,
        data: insertedDocs.map((doc: any) => ({
          ...doc.toObject(),
          id: doc._id.toString(),
        })),
        duplicates,
        message: 'Questions processed successfully',
      };
    } catch (error: any) {
      console.log(error);

      if (error.code === 11000) {
        throw new HttpException(409, 'Duplicate question detected');
      }

      throw new HttpException(500, error.message);
    }
  }

  // create question
  public async createQuestion(questionData: Question): Promise<Question | HttpException> {
    try {
      // Check duplicate Question BEFORE insert
      const existing = await QuestionModel.findOne({
        question: questionData?.question?.trim(),
        subject: questionData.subject,
        level: questionData.level,
        isActive: true,
      });

      if (existing) {
        throw new HttpException(409, 'Question already exists (duplicate)');
      }

      const createQuestionData = await QuestionModel.create({ ...questionData });
      const questionObj = createQuestionData.toObject();

      return {
        ...questionObj,
        id: questionObj._id.toString(),
      };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new HttpException(401, 'Duplicate Error !! Question already  exists');
      }
      throw new HttpException(500, error.message);
    }
  }

  // get all questions
  public async findAllQuestions(): Promise<Question[] | HttpException> {
    try {
      const questions: Question[] = (await QuestionModel.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean()
        .then(docs =>
          docs.map(doc => ({
            ...doc,
            id: doc._id.toString(),
          })),
        )) as Array<Question>;
      return questions;
    } catch (error: any) {
      throw new HttpException(500, error.message);
    }
  }
  public async findQuestionById(questionId: string): Promise<Question | HttpException> {
    try {
      const findQuestion = await QuestionModel.findOne({ _id: questionId });
      if (!findQuestion) throw new HttpException(409, "Question doesn't exist");
      return { ...findQuestion.toObject(), id: findQuestion._id.toString() };
    } catch (error: any) {
      throw new HttpException(500, error.message);
    }
  }
  public async updateQuestion(questionId: string, questionData: Question): Promise<Question | HttpException> {
    try {
      const updateQuestionById = await QuestionModel.findByIdAndUpdate(questionId, questionData, { new: true });
      if (!updateQuestionById) throw new HttpException(409, "Question doesn't exist");
      return { ...updateQuestionById.toObject(), id: updateQuestionById._id.toString() };
    } catch (error: any) {
      throw new HttpException(500, error.message);
    }
  }
  public async deleteQuestion(questionId: string): Promise<Question | HttpException> {
    try {
      const deleteQuestionById = await QuestionModel.findByIdAndDelete(questionId);
      if (!deleteQuestionById) throw new HttpException(409, "Question doesn't exist");
      return { ...deleteQuestionById.toObject(), id: deleteQuestionById._id.toString() };
    } catch (error: any) {
      throw new HttpException(500, error.message);
    }
  }
}
