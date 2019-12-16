import React from 'react';
import './App.css';
import UserComponent from '../src/widgets/user/user.component';
import EngineComponent from '../src/widgets/engine/engine.component';
import AssetsComponent from '../src/widgets/assets/assets.component';
import EnginesComponent from '../src/widgets/assets/engines/engines.component';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App(props) {
  return (
    <div className="App">
      {/* <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
      <ToastContainer />
      <UserComponent />
      <EngineComponent Url={URL} />
      <AdditionalServicePartnerComponent Url={'https://azeuw-apimhivet01.azure-api.net/fleet/api/v1/'}/>
      <AssetsComponent Url={"https://azeuw-apimhived01.azure-api.net/api/v1/"}/> */}
      {/* <EngineComponent Url={'https://azeuw-apimhived01.azure-api.net/api/v1/'} /> */}
      {/* <EnginesComponent Url={URL}></EnginesComponent> */}
      {/* <ToastContainer /> */}
      {/* <AssetsComponent Url={"https://azeuw-apimhivet01.azure-api.net/fleet/api/v1/"} /> */}
      <ToastContainer />
      <AssetsComponent Url={"https://azeuw-apimhived01.azure-api.net/api/v1/"} />
    </div>
  );
}

export default App;
