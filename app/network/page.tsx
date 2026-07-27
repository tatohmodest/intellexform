import { redirect } from 'next/navigation';

/** Legacy URL - enterprise marketing lives at /enterprise. */
export default function NetworkRedirect() {
  redirect('/enterprise');
}
