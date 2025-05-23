import CardSaver from "@/components/card-saver"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-red-900 dark:from-purple-900 dark:via-blue-800 dark:to-red-900 light:from-purple-100 light:via-blue-100 light:to-red-100 pattern-grid-lg pattern-blue-500/10 pattern-opacity-10">
      <CardSaver />
    </main>
  )
}
