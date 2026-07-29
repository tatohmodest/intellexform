import { redirect } from 'next/navigation';

/** Alias register path → student membership benefits + checkout. */
export default function RegisterStudentPage() {
  redirect('/membership');
}
