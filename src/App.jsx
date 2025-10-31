import { useState, useEffect } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/notes`;

  // fetch API URL 
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Failed to fetch notes:", err));
  }, []);


  async function handleSubmit(e) {
    e.preventDefault();

    const newNote = { title, tags };

    try {

      if (editingNoteId) {
        const res = await fetch(`${API_URL}/${editingNoteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        })

        const updatedNote = await res.json();

        setNotes(notes.map((note) => (note._id === updatedNote._id ? updatedNote : note)));

        setEditingNoteId(null);
        setTitle("")
        setTags("")
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        });

        const savedNote = await res.json();
        setNotes([...notes, savedNote]);
        setTitle("");
        setTags("");
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  }

  async function deleteNote(id) {

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }

  }

  // filter notes 
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="bg-[#d6d6d6] p-4 min-h-screen overflow-hidden ">
      {/* notes app goes here */}
      <div className="">
        {/* search notes  */}
        <div className="flex justify-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white text-xl font-medium rounded-md border border-[#8a8a8a] px-3 py-1 h-10 w-1/3" placeholder="Search notes by title..." type="text" />
        </div>

        <div className="bg-[#f0f0f0] p-4 rounded-xl mt-4 max-w-2xl mx-auto">
          {/* fields */}
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 justify-between">
                {/* title input  */}
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white text-xl rounded-md border border-[#d5d3d3] px-3 py-1 w-full" placeholder="Enter the note title..." type="text" required />
                {/* tags input */}
                <input value={tags} onChange={(e) => setTags(e.target.value)} className="bg-white text-xl rounded-md border border-[#d5d3d3] px-3 py-1 w-full" placeholder="Enter the note tags..." type="text" required />
              </div>

              {/* Add button */}
              <button
                type="submit"
                className="bg-black text-lg font-semibold text-[#f1f1f1] inline-flex items-center justify-center rounded-lg cursor-pointer transition-all hover:scale-105 hover:bg-black/85 duration-100 w-full px-2 py-1 mt-2">
                {editingNoteId ? "✏️ Update Note" : "➕ Add Note"}
              </button>
            </form>
          </div>

          {/* My Notes */}
          <h1 className="text-3xl font-semibold mt-4">My Notes</h1>
          <div className="mt-4 h-106.5 overflow-y-auto">

            {/* Notes list */}
            {filteredNotes.length === 0 ? (
              <p className="text-gray-500 mt-3 text-lg">No notes yet...</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-[#d7d7d7] flex justify-between items-center border border-[#8a8a8a] rounded-md mt-2 p-3"
                >
                  {/* left side */}
                  <div className="flex flex-col gap-2 items-start">
                    <h3 className="text-2xl font-medium">{note.title}</h3>
                    <span className="text-lg text-[#4d4c4c]">
                      Created: {new Date(note.createdAt).toLocaleString()
                      }
                    </span>
                    <span className="bg-black/70 text-[#f1f1f1] inline-flex items-center justify-center rounded-lg px-2 py-1">
                      #{note.tags}
                    </span>
                  </div>

                  {/* right side */}
                  <div className="flex gap-2">
                    {/* Edit button */}
                    <button onClick={() => { setEditingNoteId(note._id); setTitle(note.title); setTags(note.tags); }} className="bg-black text-lg text-[#f1f1f1] inline-flex items-center justify-center rounded-md cursor-pointer transition-all hover:scale-105 hover:bg-black/80 duration-100 px-2 py-0.5">Edit</button>
                    {/* delete  button */}
                    <button onClick={() => deleteNote(note._id)} className="bg-black text-lg text-[#f1f1f1] inline-flex items-center justify-center rounded-md cursor-pointer transition-all hover:scale-105 hover:bg-black/80 duration-100 px-2 py-0.5">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
