import { db } from '$lib/server/db';
import type { TaskPageLoad, TaskIn, TaskOut } from '$lib/components/tasks';
import { task, taskInput, taskOutput } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const tasks = await db.select().from(task);

    const taskInputs = await db.select().from(taskInput);
    const taskOutputs = await db.select().from(taskOutput);

    const structuredTasks: TaskPageLoad[] = await Promise.all(
        tasks.map(async (dbTask) => {
            const inputs = taskInputs.filter(input => input.taskId === dbTask.id);
            const outputs = taskOutputs.filter(output => output.taskId === dbTask.id);

            // Organize the inputs and outputs as TaskInOut structure
            const inOut = {
                tasks: inputs.map((input) => {
                    const output = outputs.find(out => out.inputId === input.id)!;

                    return [
                        {
                            filepath: input.filepath,
                            content: atob(input.content) // Decode base64
                        },
                        {
                            filepath: output.filepath,
                            content: atob(output.content) // Decode base64
                        }
                    ] as [TaskIn, TaskOut];
                })
            };

            // Construct the Task object
            return {
                mainFolderPath: dbTask.mainFolderPath,
                doc: {
                    pdfFile: dbTask.documentPath,
                    contentBase64: dbTask.documentContent
                },
                inOut
            };
        })
    );

    return {
        tasks: structuredTasks
    };
};
