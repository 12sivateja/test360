export interface Question {
  _id?: any;
  id?: any;
  question?: string;
  options?: Array<string>;
  type?: QuestionType;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  answer?: string;
  isMock?: boolean;
  subject?: string;
  level?: string;
  program?: string;
  topic?: string;
  explanation?: string;
}

export enum QuestionType {
  text = 'text',
  file = 'file',
}
