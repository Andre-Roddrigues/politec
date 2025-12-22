import type { Metadata } from 'next';
import CursosPolitec from '../../components/cursos/CursosPolitec';

export const metadata: Metadata = {
  title: 'Cursos - POLITEC',
  description: 'Explore todos os cursos médios oferecidos pelo POLITEC',
};

export default function CursosPage() {
  return <CursosPolitec />;
}