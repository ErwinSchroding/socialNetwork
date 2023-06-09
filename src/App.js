import Home from "./components/Home";
import {Route, Routes} from "react-router-dom";
import Storage from "./components/Storage";
import Hello from "./components/Hello";
import AccountPage from "./components/AccountPage";
import FriendFind from "./components/FriendFind";
import Register from "./components/Register";
import FriendPage from "./components/FriendPage";
import MyFriend from "./components/MyFriend";
import ChatPage from "./components/ChatPage";
import HomePage from "./components/HomePage";
import MyFriendRequests from "./components/MyFriendRequests";
import MessagePage from "./components/MessagePage";
import Publish from "./components/Publish";
import TweetsPage from "./components/TweetsPage";
import Explore from "./components/Explore";


function App() {
  return (
      <>

          <Routes>
              <Route path="/" element={<Hello/>} exact />
              <Route path="/home" element={<Home/>} />
              <Route path="/homepage" element={<HomePage/>} />
              <Route path="/tweets" element={<TweetsPage/>} />
              <Route path="/tweets/publish" element={<Publish/>} />
              <Route path="/tweets/explore" element={<Explore/>} />
              <Route path="/account" element={<AccountPage/>} />
              <Route path="/friends" element={<FriendPage/>} />
              <Route path="/friends/find" element={<FriendFind/>} />
              <Route path="/friends/myfriend" element={<MyFriend/>} />
              <Route path="/friends/chat" element={<ChatPage/>} />
              <Route path="/friends/msg" element={<MessagePage/>} />
              <Route path="/friends/requests" element={<MyFriendRequests/>} />
              <Route path="/account/register" element={<Register/>} />

              <Route element={Error} />
          </Routes>

      </>

  );
}

export default App;
