import React from 'react'
import Modal from 'react-modal';
import store from '../store/store';
import kakao_login from './img/kakao_login_button.png';
type Props = {}

const customModalStyles: ReactModal.Styles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100vh",
      zIndex: "10",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "360px",
      height: "180px",
      zIndex: "150",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      backgroundColor: "rgba(42,42,42)",
      borderColor: "rgba(42,42,42)",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      justifyContent: "center",
      overflow: "auto",
    },
  };


const KakaoModal = (props: Props) => {
    const {useModalStore, useAuthStore} = store;
    const {setToken} = useAuthStore(state => state);
    const {isOpen, closeModal} = useModalStore();

    const onClick = () => {
        setToken('login');
        closeModal();
    }
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => closeModal()}
        style={customModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div className="flex flex-col bg-gray-4 items-center justify-center w-full h-full">
          <div className="text-center text-400 text-white text-lg">
            로그인을 해주세요
          </div>
          <img src={kakao_login} onClick={onClick} className='h-45px w-full object-cover rounded-md mt-5'/>
          {/* <button
            onClick={() => closeModal()}
            className="bg-primary text-white text-400 text-lg rounded-lg mt-4 px-4 py-2"
          >
            확인
          </button> */}
        </div>
      </Modal>)
}

export default KakaoModal