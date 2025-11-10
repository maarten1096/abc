
import { getSupabaseServerComponentClient } from '@/lib/supabase/server';
import Flashcards from '@/components/Flashcards';

async function getFlashcards(id: number) {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from('flashcards')
    .select('*, users(*), recents(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching flashcards:', error);
    return null;
  }

  return data;
}

export default async function FlashcardsPage({ params }: { params: { id: number } }) {
  const flashcards = await getFlashcards(params.id);

  return <Flashcards flashcards={flashcards} />;
}
