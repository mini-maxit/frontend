export const EXAMPLE_SUBMISSIONS = [
	{
		id: 1,
		task_id: 101,
		user_id: 1001,
		order: 1,
		language_id: 1,
		status: 'received',
		status_message: 'Submission received successfully.',
		submitted_at: '2025-02-16T12:30:00Z',
		checked_at: null,
		language: {
			language: 'Python',
			version: '3.10'
		},
		task: {
			id: 101,
			title: 'FizzBuzz Challenge',
			description_url: 'https://example.com/tasks/101',
			create_by: 2001
		},
		user: {
			id: 1001,
			name: 'Alice Doe',
			email: 'alice@example.com'
		}
	},
	{
		id: 2,
		task_id: 102,
		user_id: 1002,
		order: 2,
		language_id: 2,
		status: 'sent for evaluation',
		status_message: 'Submission is under review.',
		submitted_at: '2025-02-16T13:45:00Z',
		checked_at: '2025-02-16T14:00:00Z',
		language: {
			language: 'JavaScript',
			version: 'ES6'
		},
		task: {
			id: 102,
			title: 'Sorting Algorithm',
			description_url: 'https://example.com/tasks/102',
			create_by: 2002
		},
		user: {
			id: 1002,
			name: 'Bob Smith',
			email: 'bob@example.com'
		}
	},
	{
		id: 3,
		task_id: 103,
		user_id: 1003,
		order: 3,
		language_id: 3,
		status: 'evaluated',
		status_message: 'Submission evaluated. All test cases passed.',
		submitted_at: '2025-02-16T15:10:00Z',
		checked_at: '2025-02-16T15:30:00Z',
		language: {
			language: 'Java',
			version: '17'
		},
		task: {
			id: 103,
			title: 'Palindrome Checker',
			description_url: 'https://example.com/tasks/103',
			create_by: 2003
		},
		user: {
			id: 1003,
			name: 'Charlie Johnson',
			email: 'charlie@example.com'
		}
	}
];
