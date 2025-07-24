import Note from "../models/note.model.js";
export const getNotes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments(filter);

    res.json({
      notes,
      currentPage: page,
      totalPages: Math.ceil(totalNotes / limit),
      totalNotes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note && note.user.toString() === req.user._id.toString()) {
      res.json(note);
    } else {
      res.status(404);
      throw new Error("Note not found or user not authorized");
    }
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      title,
      content,
      user: req.user._id,
    });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (note && note.user.toString() === req.user._id.toString()) {
      note.title = title;
      note.content = content;
      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404);
      throw new Error("Note not found or user not authorized");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note && note.user.toString() === req.user._id.toString()) {
      await note.deleteOne();
      res.json({ message: "Note removed" });
    } else {
      res.status(404);
      throw new Error("Note not found or user not authorized");
    }
  } catch (error) {
    next(error);
  }
};
export const searchNotes = async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) return res.json([]);

    const notes = await Note.find(
      {
        user: req.user._id,
        $text: { $search: searchQuery },
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json(notes);
  } catch (error) {
    next(error);
  }
};
