const Comment = require('../models/comments.model');
const Event = require('../models/event.model');

exports.addComment = async (req, res) => {
  try {
    console.log("Incoming comment payload:", req.body);
    console.log("Authenticated user:", req.user);

    const user_id = req.user.id;
    const { event_id, content, title, url, start_time, venue, description, pii_score, where, source, category} = req.body;

    if (!event_id || !content) {
      return res.status(400).json({ error: "Missing data." });
    }

    // Check if event exists
    let eventExists = await Event.findByPk(event_id);
    if (!eventExists) {
      console.log("Event not found. Creating in cache...");
      eventExists = await Event.create({
        id: event_id,
        title: title || "Untitled Event",
        url: url || null,
        start_time: start_time || null,
        venue: venue || null,
        location: where || null,
        category: category || "Unknown",
        description: description || null,
        pii_score: pii_score || null,
        source: source || null
      });
    }

    // Create the comment
    const comment = await Comment.create({
      user_id: user_id,
      event_id: event_id,
      content: content
    });

    return res.status(201).json({
      message: "Comment created successfully.",
      comment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      message: "Failed to add comment."
    });
  }
};

exports.getComments = async (req, res) => {
    try{
        const user_id = req.user.id;

        const comments = await Comment.findAll({
          where: { user_id },
          include: [
            {
              model: Event,
              attributes: ["title"], // only get title
            },
          ],
          order: [["create_at", "DESC"]]
        });

        res.json({ count: comments.length, comments });
    }catch(error){
        console.error("Get comment error: ",error.message);
        res.status(500).json({ error: "Failed to fetch comments."});
    }
};

exports.deleteComment = async (req, res) => {
    try{
        const user_id = req.user.id;//refers to the authenticated user
        const { title } = req.params;//refers to the id of the comment

            // Find the event by title
        const event = await Event.findOne({ where: { title } });
        if (!event) return res.status(404).json({ error: "Event not found" });

        const comment = await Comment.findOne({
          where: { user_id, event_id: event.id },
        });

        if (!comment)
      return res.status(404).json({ error: "Comment not found or unauthorized" });

        // Delete only the user's comment for that event
        await Comment.destroy({ where: { id: comment.id } });

        return res.status(200).json({ message: "Comment deleted successfully." });
      } catch (error) {
        console.error("Delete comment error:", error.message);
        res.status(500).json({ error: "Failed to delete comment." });
      }
};

exports.getCommentsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "Missing eventId parameter." });
    }

    const commentsForEvent = await Comment.findAll({
      where: { event_id: eventId },
      order: [["create_at", "DESC"]],
    });

    return res.status(200).json({
      count: commentsForEvent.length,
      comments: commentsForEvent,
    });
  } catch (err) {
    console.error("Get comments by event error:", err);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

