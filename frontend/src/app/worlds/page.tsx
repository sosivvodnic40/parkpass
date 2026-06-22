import { redirect } from 'next/navigation';

/** Хаб /worlds дублировал каталог — перенаправляем на /parks */
export default function WorldsLegacyPage() {
  redirect('/parks');
}
