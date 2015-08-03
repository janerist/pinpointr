import {Socket} from "phoenix";

// let socket = new Socket("/ws")
// socket.connect()
// let chan = socket.chan("topic:subtopic", {})
// chan.join().receive("ok", resp => {
//   console.log("Joined succesffuly!", resp)
// })

let Room = {
  init(roomId) {
    console.log(roomId);
  }
};

export default Room;
