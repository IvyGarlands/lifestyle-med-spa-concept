/**
 * forms.ts — the contact form's shape, defined once for every page.
 *
 * FOUR FIELDS, and this is a compliance boundary rather than a design choice.
 * `ContactForm` posts to a third-party form relay with no business-associate
 * agreement, and this practice advertises HIPAA compliance. A weight field, a
 * goal-weight field, a current-medication field or a condition field would put
 * protected health information through an uncovered processor.
 *
 * It lives here so that every page which renders a form gets the same four
 * fields and the same notice. A page author cannot forget it, and there is one
 * place to change it if the practice ever moves to a covered processor.
 */
import type { FormField } from "../components/core/ContactForm.astro";

export const CONTACT_FIELDS: FormField[] = [
  { name: "name", label: "Your name", required: true, autocomplete: "name" },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    required: true,
    autocomplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    autocomplete: "email",
  },
  {
    name: "preferred_time",
    label: "Best time to reach you",
    placeholder: "e.g. Tuesday morning",
  },
];

export const PHI_NOTICE =
  "Please don't include medical details, medications, weights or health history in this form. It goes through an ordinary email service, not a clinical system. Send your name and a good time to reach you, and one of us will call you to take the rest properly.";
