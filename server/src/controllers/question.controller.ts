import { QuestionService } from '@/services/question.service';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class QuestionController {
  private questionService = Container.get(QuestionService);

  // create bulk questions
  public createBulkQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionsData = req.body;

      // const createQuestions = await this.questionService.createBulkQuestions(questionsData);
      // res.status(201).json({ data: createQuestions, message: 'created' });

      const result = await this.questionService.createBulkQuestions(questionsData);

      // res.status(201).json({
      //   data: result.inserted,
      //   duplicates: result.duplicates,
      //   message: 'processed',
      // });

      res.status(201).json({
        success: result.success,
        insertedCount: result.insertedCount,
        duplicateCount: result.duplicateCount,
        data: result.data,
        duplicates: result.duplicates,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
  // create question
  public createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionData = req.body;
      const createQuestion = await this.questionService.createQuestion(questionData);
      res.status(201).json({ data: createQuestion, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  // get all questions
  public getAllQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questions = await this.questionService.findAllQuestions();
      res.status(200).json({ data: questions, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  // get question by id
  public getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = req.params.id;
      const question = await this.questionService.findQuestionById(questionId);
      res.status(200).json({ data: question, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  // update question
  public updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = req.params.id;
      const questionData = req.body;
      const updateQuestion = await this.questionService.updateQuestion(questionId, questionData);
      res.status(200).json({ data: updateQuestion, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  // delete question
  public deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = req.params.id;
      const deleteQuestion = await this.questionService.deleteQuestion(questionId);
      res.status(200).json({ data: deleteQuestion, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
