import React from 'react'
import checkIcon from '../../img/check_icon.png'
import { useNavigate } from 'react-router-dom';
type Props = {
  isLoading: boolean;
  isSuccess : boolean;
  promotionUrl: string;
}

const Result = (props: Props) => {

  const { isLoading, isSuccess, promotionUrl } = props;
  const navigate = useNavigate();

  return (
    <div className={`w-full bg-system-background my-24 ${
    !isLoading && isSuccess ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-1000`}>
      <div className='flex flex-col w-full items-center justify-items-center'>
        <img className='h-16 w-20 mb-8' src={checkIcon}/>
            <span className='text-lg text-primary font-bold mb-5 text-pxl'>공연이 등록되었습니다.</span>
            <button className ='bg-gray-4 text-pmd text-gray-2 py-10px px-6 rounded-xl'
              onClick={()=>navigate(promotionUrl)} >
              등록된  내 공연 보러가기
            </button>
      </div>
      
    </div>
  )
}

export default Result