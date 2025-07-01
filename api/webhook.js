const { Client } = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

const sickLeaveOptions = ["ทั้งวัน", "ครึ่งวันเช้า", "ครึ่งวันบ่าย"];

const handleEvent = async (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const text = event.message.text.trim();

  // Step 1: Detect "ลาป่วย"
  if (text === "ลาป่วย") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text:
        "กรุณาระบุรายละเอียดเพิ่มเติม เช่น อาการ และช่วงเวลาที่ต้องการลางาน\n" +
        "คุณต้องการลาในช่วงใด?\n- ทั้งวัน\n- ครึ่งวันเช้า\n- ครึ่งวันบ่าย",
    });
  }

  // Step 2: Detect one of the time options
  if (sickLeaveOptions.includes(text)) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ขอบคุณค่ะ ระบบได้รับคำขอลาของคุณเรียบร้อยแล้ว 😊",
    });
  }

  // Optional: fallback for unrecognized input
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: 'ขออภัย ระบบยังไม่เข้าใจคำนี้ กรุณาพิมพ์ "ลาป่วย" เพื่อเริ่มต้น',
  });
};

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const events = req.body.events;
      await Promise.all(events.map(handleEvent));
      res.status(200).send("OK");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
