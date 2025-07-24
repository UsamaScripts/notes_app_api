export const validateNote = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ message: "Title is required and cannot be empty." });
  }

  if (!content || content.trim() === "") {
    return res
      .status(400)
      .json({ message: "Content is required and cannot be empty." });
  }

  next();
};
