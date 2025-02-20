// place files you want to import through the `$lib` alias in this folder.
export const sessionCookieName = 'auth-session';
export const passwordValidationRegex = new RegExp(
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);
