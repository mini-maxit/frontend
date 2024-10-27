<script lang="ts">
    import { enhance } from '$app/forms';
    import { loadTask } from './taskFile.svelte';
	import type { Task } from '.';

    interface Props {
        userId: string;
        onTaskUploaded?: (task: Task) => void;
    }

    let { userId, onTaskUploaded }: Props = $props();

    let errorMessage = $state('');
    let successMessage = $state('');
    let isUploading = $state(false);
    let selectedFile: File | null = $state(null);

    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file || !file.name.endsWith('.zip')) {
            errorMessage = 'Proszę przesłać plik w formacie .zip';
            selectedFile = null;
            return;
        }

        errorMessage = '';
        selectedFile = file;
    }

    async function validateBeforeSubmit(formData: FormData) {
        if (!selectedFile) {
            return { success: false, error: 'Nie wybrano pliku' };
        }

        try {
            const taskData = await loadTask(selectedFile);
            
            // Add each part of the task data separately
            formData.append('mainFolderPath', taskData.mainFolderPath);
            formData.append('docPath', taskData.doc.pdfFile);
			formData.append('docBlob', taskData.doc.content);
            
            // For the inOut tasks, we can JSON stringify since it's just text data
            formData.append('inOutTasks', JSON.stringify(taskData.inOut));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Nieprawidłowy format pliku'
            };
        }
    }
</script>

<form
    method="POST"
    action="?/uploadTask"
    enctype="multipart/form-data"
    use:enhance={async ({ formData, cancel }) => {
        isUploading = true;

        const validation = await validateBeforeSubmit(formData);
        if (!validation.success) {
            isUploading = false;
            cancel();
            return;
        }

        formData.append('userId', userId);

        return async ({ result }) => {
            isUploading = false;
            if (result.type === 'success') {
                successMessage = 'Zadanie zostało pomyślnie zapisane';
                onTaskUploaded?.(result.data.taskId);
                selectedFile = null;
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else if (result.type === 'error') {
                errorMessage = result.error;
            }
        };
    }}
>
	<div class="task-upload">
		<div class="upload-container" class:uploading={isUploading}>
			<input
				type="file"
				name="zipFile"
				onchange={handleFileSelect}
				accept=".zip"
				disabled={isUploading}
				class="file-input"
			/>
			{#if isUploading}
				<div class="spinner"></div>
			{/if}
		</div>

		<button
			type="submit"
			class="submit-button"
			disabled={!selectedFile || isUploading}
		>
			{isUploading ? 'Przesyłanie...' : 'Prześlij zadanie'}
		</button>

		{#if errorMessage}
			<p class="message error" role="alert">
				{errorMessage}
			</p>
		{/if}

		{#if successMessage}
			<p class="message success" role="status">
				{successMessage}
			</p>
		{/if}
	</div>
</form>

<style>
	.task-upload {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	.upload-container {
		position: relative;
		padding: 1rem;
		border: 2px dashed #ccc;
		border-radius: 4px;
		text-align: center;
		transition: all 0.3s ease;
		margin-bottom: 1rem;
	}

	.upload-container:hover {
		border-color: #666;
	}

	.uploading {
		opacity: 0.7;
		pointer-events: none;
	}

	.file-input {
		width: 100%;
		padding: 0.5rem;
		cursor: pointer;
	}

	.file-input:disabled {
		cursor: not-allowed;
	}

	.submit-button {
		width: 100%;
		padding: 0.75rem;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.submit-button:hover:not(:disabled) {
		background-color: #2980b9;
	}

	.submit-button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.message {
		margin: 1rem 0;
		padding: 0.75rem;
		border-radius: 4px;
		text-align: center;
	}

	.error {
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
	}

	.success {
		color: #155724;
		background-color: #d4edda;
		border: 1px solid #c3e6cb;
	}

	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		border: 3px solid #f3f3f3;
		border-top: 3px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>