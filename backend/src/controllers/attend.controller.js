const EventUser = require("../models/EventUser.model");
const Event = require("../models/event.model");

exports.getAttendance = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const record = await EventUser.findOne({ where: { userId, eventId } });
    const totalAttendance = await EventUser.count({
      where: { eventId, attended: true },
    });

    res.status(200).json({
      attended: record ? record.attended : false,
      totalAttendance,
    });
  } catch (err) {
    console.error("Error in getAttendance:", err);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { userId, eventId, attended } = req.body;
    if (!userId || !eventId)
      return res.status(400).json({ message: "Missing userId or eventId" });

    // ensure event exists
    let event = await Event.findByPk(eventId);
    if (!event) {
      event = await Event.create({
        id: eventId,
        title: "Untitled Event",
        attendance_count: 0,
      });
    }

    // find or create attendance record
    const [record, created] = await EventUser.findOrCreate({
      where: { userId, eventId },
      defaults: { attended },
    });

    if (!created && record.attended !== attended) {
      record.attended = attended;
      await record.save();
    }

    // recalculate total attendance
    const total = await EventUser.count({
      where: { eventId, attended: true },
    });

    // update event table
    event.attendance_count = total;
    await event.save();

    res.status(200).json({
      message: "Attendance updated",
      attended,
      totalAttendance: total,
    });
  } catch (err) {
    console.error("Error in markAttendance:", err);
    res.status(500).json({ message: "Failed to update attendance" });
  }
};
