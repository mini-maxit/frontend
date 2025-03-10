import type { SubmissionResultData } from './backendSchemas';

export const passwordValidationRegex = new RegExp(
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export function get_submission_status_color(status: string) {
	switch (status) {
		case 'received':
			return 'bg-white';
		case 'sent for evaluation':
			return 'bg-blue-200';
		case 'evaluated':
			return 'bg-green-200';
		case 'lost':
			return 'bg-red-200';
		default:
			return 'bg-gray-200';
	}
}

export function get_submission_passed_color(result: SubmissionResultData | null) {
	if (!result) {
		return 'bg-white';
	} else if (!result.test_results) {
		return 'bg-red-200';
	} else if (result.test_results.every((test) => test.passed)) {
		return 'bg-green-200';
	} else if (result.test_results.some((test) => !test.passed)) {
		return 'bg-orange-200';
	} else {
		return 'bg-red-200';
	}
}

export function get_submission_passed_text(result: SubmissionResultData | null) {
	if (!result) {
		return '-';
	} else if (!result.test_results) {
		return '0/0';
	} else {
		const countPassed = result.test_results.filter((test) => test.passed).length;
		const countTotal = result.test_results.length;
		return `${countPassed}/${countTotal}`;
	}
}
