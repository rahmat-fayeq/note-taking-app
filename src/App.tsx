import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./components/NewNote";
import { NoteData, RawNote, Tag } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./components/NoteList";

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("notes", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("tags", []);

  const noteWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  const handleCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const handleAddTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NoteList availableTags={tags} notes={noteWithTags} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={handleCreateNote}
              onAddTag={handleAddTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
};

export default App;
