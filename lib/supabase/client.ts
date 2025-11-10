
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const mergeLocalData = async (userId: string) => {
  const localSummary = localStorage.getItem('summary');
  const localFlashcards = localStorage.getItem('flashcards');
  const localQuiz = localStorage.getItem('quiz');

  if (localSummary) {
    const { data: summaryData, error: summaryError } = await supabase
      .from('summaries')
      .insert([{ user_id: userId, title: 'Untitled Summary', content: localSummary }])
      .select('id');

    if (summaryError) {
      console.error('Error saving local summary:', summaryError);
    } else {
      const summaryId = summaryData[0].id;

      const { error: recentError } = await supabase
        .from('recents')
        .insert([{ user_id: userId, title: 'Untitled Summary', tool: 'summary', tool_id: summaryId }]);

      if (recentError) {
        console.error('Error inserting into recents:', recentError);
      } else {
        localStorage.removeItem('summary');
      }
    }
  }

  if (localFlashcards) {
    const flashcards = JSON.parse(localFlashcards);
    const { data: flashcardData, error: flashcardError } = await supabase
      .from('flashcards')
      .insert([{ user_id: userId, title: 'Untitled Flashcards', flashcards: { flashcards } }])
      .select('id');

    if (flashcardError) {
      console.error('Error saving local flashcards:', flashcardError);
    } else {
      const flashcardId = flashcardData[0].id;

      const { error: recentError } = await supabase
        .from('recents')
        .insert([{ user_id: userId, title: 'Untitled Flashcards', tool: 'flashcard', tool_id: flashcardId }]);

      if (recentError) {
        console.error('Error inserting into recents:', recentError);
      } else {
        localStorage.removeItem('flashcards');
      }
    }
  }

  if (localQuiz) {
    const quiz = JSON.parse(localQuiz);
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert([{ user_id: userId, title: 'Untitled Quiz', questions: quiz }])
      .select('id');

    if (quizError) {
      console.error('Error saving local quiz:', quizError);
    } else {
      const quizId = quizData[0].id;

      const { error: recentError } = await supabase
        .from('recents')
        .insert([{ user_id: userId, title: 'Untitled Quiz', tool: 'quiz', tool_id: quizId }]);

      if (recentError) {
        console.error('Error inserting into recents:', recentError);
      } else {
        localStorage.removeItem('quiz');
      }
    }
  }
};
