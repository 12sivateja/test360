import { QuestionController } from '@/controllers/question.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class QuestionRoute implements Routes {
  public path = '/api/questions';
  public router = Router();
  public questionController = new QuestionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.questionController.getAllQuestions);
    this.router.get('/:id', this.questionController.getQuestionById);
    this.router.post('', this.questionController.createQuestion);
    this.router.post('/bulk', this.questionController.createBulkQuestions);
    this.router.put('/:id', this.questionController.updateQuestion);
    this.router.delete('/:id', this.questionController.deleteQuestion);
  }
}
