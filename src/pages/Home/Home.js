import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./Home.scss"
import Modal from '../../components/modal/Modal';
import Header from '../../components/header/Header';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: "", username: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [receivedFiles, setReceivedFiles] = useState([])
  console.log(process.env)
  const { lastMessage: lastMessageUsers, readyState: readyStateUsers } = useWebSocket(`${process.env.REACT_APP_WS_URL}/users`);

  const { lastMessage: lastMessageRoom, readyState: readyStateRoom } = useWebSocket(roomId ? `${process.env.REACT_APP_WS_URL}/room/${roomId}` : null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleSendFile(selectedFile, selectedUser)
  };

  const formatName = (id) => {
    let splittedId = id.split(":");
    let prefNum = Number(splittedId[splittedId.length - 1].slice(0, (splittedId.length / 2) + 1));
    let sufNum = Number(splittedId[splittedId.length - 1].slice(splittedId.length / 2 + 1));

    return prefixes[prefNum % 50] + " " + suffixes[sufNum % 50]
  }

  const handleDownload = (file) => {
    const { fileName, fileData } = file;

    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setReceivedFiles(files => files.slice(1))
  };

  const handleSendFile = (file, userId) => {
    if (file && userId) {

      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;

        const fileMessage = {
          type: 'file',
          fileName: file.name,
          fileData: fileData,
          recipient: userId,
          sender: currentUser.id
        };

        const recipientRoomUrl = `${process.env.REACT_APP_WS_URL}/room/${userId}`;

        const recipientSocket = new WebSocket(recipientRoomUrl);

        recipientSocket.onopen = () => {
          recipientSocket.send(JSON.stringify(fileMessage));
          recipientSocket.close();
        };

        recipientSocket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      };

      reader.readAsDataURL(file);

      setSelectedUser(null)
    }
  };

  useEffect(() => {
    if (lastMessageUsers?.data) {

      const userData = JSON.parse(lastMessageUsers.data);

      const currentUserId = userData.current_user;
      const usersList = userData.users;

      setUsers(usersList.map(id => (
        {
          id,
          username: formatName(id)
        }
      )));

      if (currentUser.id === "") {
        setCurrentUser({
          id: currentUserId,
          username: formatName(currentUserId)
        });
        setRoomId(currentUserId);
      }

      setUsers((prevUsers) => {
        const filteredUsers = prevUsers.filter(user => usersList.includes(user.id));
        return filteredUsers;
      });
    }
  }, [lastMessageUsers]);


  useEffect(() => {
    if (lastMessageRoom?.data) {
      const newFile = lastMessageRoom.data;
      setReceivedFiles((prevFiles) => [...prevFiles, newFile]);
    }
  }, [lastMessageRoom]);

  const connectionStatusUsers = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyStateUsers];

  const connectionStatusRoom = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyStateRoom];

  return (
    <div className='home'>
      {receivedFiles.length > 0 &&
        <Modal sender={formatName(JSON.parse(receivedFiles[0]).sender)} filename={JSON.parse(receivedFiles[0]).fileName} onSave={() => handleDownload(JSON.parse(receivedFiles[0]))} onCancel={() => { setReceivedFiles(files => files.slice(1)) }} />
      }
      <Header readyStateRoom={readyStateRoom} readyStateUsers={readyStateUsers} state={true} username={currentUser.username} />

      <div className='users'>
        {users.map((user) => (
          <div className="user" id={user.id} key={user.id}>
            <label for='file-input' onClick={() => setSelectedUser(user.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
              </svg>
            </label>
            <input type="file" onChange={handleFileChange} placeholder={user.id} id='file-input' hidden />
            <p>{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const prefixes = [
  "Azure",
  "Crimson",
  "Golden",
  "Silver",
  "Emerald",
  "Scarlet",
  "Indigo",
  "Amber",
  "Ruby",
  "Sapphire",
  "Coral",
  "Ivory",
  "Jet",
  "Olive",
  "Peach",
  "Lavender",
  "Teal",
  "Onyx",
  "Cobalt",
  "Magenta",
  "Turquoise",
  "Charcoal",
  "Mint",
  "Plum",
  "Rose",
  "Walnut",
  "Lemon",
  "Fuchsia",
  "Cerulean",
  "Mahogany",
  "Periwinkle",
  "Tangerine",
  "Sepia",
  "Ash",
  "Pine",
  "Berry",
  "Sand",
  "Chestnut",
  "Lilac",
  "Copper",
  "Slate",
  "Wheat",
  "Moss",
  "Berry",
  "Honey",
  "Graphite",
  "Almond",
  "Poppy",
  "Birch",
  "Cinder"
];

const suffixes = [
  "Koi",
  "Snipe",
  "Crayfish",
  "Canidae",
  "Falcon",
  "Lynx",
  "Viper",
  "Tortoise",
  "Serpent",
  "Owl",
  "Dragon",
  "Tiger",
  "Wolf",
  "Fox",
  "Bear",
  "Hawk",
  "Shark",
  "Whale",
  "Eagle",
  "Antelope",
  "Bison",
  "Gecko",
  "Raccoon",
  "Otter",
  "Parrot",
  "Cheetah",
  "Gazelle",
  "Pelican",
  "Mantis",
  "Scorpion",
  "Tarantula",
  "Hedgehog",
  "Salamander",
  "Chameleon",
  "Squirrel",
  "Platypus",
  "Armadillo",
  "Wombat",
  "Ferret",
  "Badger",
  "Lynx",
  "Mongoose",
  "Jackal",
  "Coyote",
  "Piranha",
  "Shrimp",
  "Starfish",
  "Seahorse",
  "Ant",
  "Beetle"
];

export default Home;
