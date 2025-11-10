
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Sidebar from '../components/Sidebar'

export default async function Page() {
  const supabase = createSupabaseServerClient()
  const { data: flashcards } = await supabase.from('flashcards').select('*')

  async function createFlashcard(formData: FormData) {
    'use server'
    const supabase = createSupabaseServerClient()
    const title = formData.get('title') as string
    await supabase.from('flashcards').insert([{ title, cards: [] }])
  }

  return (
    <div className="h-screen flex text-sm text-slate-800 dark:text-slate-100">
      <Sidebar active="flashcards" />
      <main className="flex-1 flex flex-col bg-white dark:bg-slate-950">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold">Flashcards</h1>
        </div>
        <div className="p-4">
          <form
            action={createFlashcard}
            className="mb-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg"
          >
            <h2 className="text-lg font-bold mb-2">Create a new flashcard deck</h2>
            <div className="flex gap-2">
              <input
                type="text"
                name="title"
                className="flex-1 p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950"
                placeholder="Enter a title"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg"
              >
                Create
              </button>
            </div>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards?.map((flashcard) => (
              <div
                key={flashcard.id}
                className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg"
              >
                <h2 className="text-lg font-bold">{flashcard.title}</h2>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
