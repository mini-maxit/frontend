import * as v from 'valibot';

/**
 * Schema for uploading a new task with archive
 */
export const UploadTaskSchema = v.object({
  title: v.pipe(v.string('Title is required'), v.nonEmpty('Title cannot be empty')),
  archive: v.instance(File, 'Task archive is required'),
  isVisible: v.optional(v.boolean(), false)
});

export type UploadTaskInput = v.InferOutput<typeof UploadTaskSchema>;

/**
 * Schema for updating task execution limits
 */
export const UpdateTaskLimitsSchema = v.object({
  taskId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid task ID')),
  languageId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid language ID')),
  timeLimit: v.pipe(
    v.number(),
    v.minValue(100, 'Time limit must be at least 100ms'),
    v.maxValue(60000, 'Time limit cannot exceed 60 seconds')
  ),
  memoryLimit: v.pipe(
    v.number(),
    v.minValue(1, 'Memory limit must be at least 1MB'),
    v.maxValue(1024, 'Memory limit cannot exceed 1024MB')
  )
});

export type UpdateTaskLimitsInput = v.InferOutput<typeof UpdateTaskLimitsSchema>;
