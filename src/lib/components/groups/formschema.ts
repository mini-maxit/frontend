import { z } from 'zod';
import * as m from '$lib/paraglide/messages.js';

export const createGroupSchema = z.object({
	name: z.string().nonempty(m.form_schema_group_name_required_error_message())
});

export type CreateGroupSchema = typeof createGroupSchema;
