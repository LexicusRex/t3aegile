import DndListContext from "@/components/kanban/DndListContext";

export default async function ProjectsTaskPage() {
  return (
    <main className="flex flex-grow">
      <DndListContext />
    </main>
  );
}
