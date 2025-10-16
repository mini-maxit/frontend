export interface Language {
  id: number;
  language: string;
  version: string;
  fileExtension: string;
}

export interface SubmitSolutionDto {
  taskID: number;
  solution: File;
  languageID: number;
}
