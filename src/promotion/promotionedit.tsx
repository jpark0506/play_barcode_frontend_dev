import React,{ReactElement,useState, useEffect} from 'react'
import Nav from '../common/components/nav/nav'
import TicketCreationInfo from './components/promotionedit/ticketcreationinfo'
import Step1 from './components/promotionedit/step1'
import Step2 from './components/promotionedit/step2'
import Step3 from './components/promotionedit/step3'
import FormNav from './components/promotionedit/formnav'
import Result from './components/promotionedit/result';
import store from '../store/store'
import {axiosSemiSecureAPI }from '../axios'
import { convertMerdian } from '../utils/time'
import Loading from '../common/loading'
import { useNavigate, useParams } from 'react-router-dom'
import { convertViewPromotionToPromotionCreate } from '../utils/convert/promotion'
type Props = {}

type Step = {
    title: string;
    element: ReactElement;
  };

const PromotionEdit = (props: Props) => {
    const {id} = useParams<{id:string}>();
    const navigate = useNavigate();
    const { useCreatePromotionStore } = store;
    const { getFullPromotionData,clearData,updateData } = useCreatePromotionStore();
    const [promotionUrl, setPromotionUrl] = useState<string>('/');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const fetchData = async () => {
      setIsLoading(true);
      try{
        const res = await axiosSemiSecureAPI.get(`/api/promotions/${id}`);
        if(res.data.isSuccess){
          const result = convertViewPromotionToPromotionCreate(res.data.result)
          clearData();
          updateData(result);
        }
      }
      catch(e){
        alert('프로모션 정보를 불러오는데 실패했습니다.');
        navigate('/');
      }
      finally{
        setIsLoading(false);
      }
    }

    const prev = () => {
      setCurrentStepIndex((index) => (index <= 0 ? 0 : index - 1));
    };

    const next = () => {
      setCurrentStepIndex((index) => (index >= 2 ? index : index + 1));
      if(currentStepIndex+1 == 3){
        updatePromotion();
      }
    };

    useEffect(() => {
      fetchData();
    },[])
    const uploadImage = async () => {
      let formData = new FormData();
      const file = getFullPromotionData().step1.imageList
      if(file){
        formData.append('uploadImgFileList', file[0]);
      }else{
        alert('이미지가 없습니다.')
      }
      try{
        const result = await axiosSemiSecureAPI.post('/api/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return result.data.result[0]
      }catch(e){
        alert('이미지 업로드 실패')
        //console.log(e)
      }
    }
    const updatePromotion = async () => {
        setIsLoading(true);
        
        const payload = getFullPromotionData();
        const refinedPayload = {
                ...payload.step1,
                ...payload.step2,
                ...payload.step3.billing,
                startTime: '',
                endTime: '',
              }
        
        const convertedTime = convertMerdian(refinedPayload.time)
        delete refinedPayload.time
        refinedPayload.startTime = convertedTime.startTime
        refinedPayload.endTime = convertedTime.endTime
      
        if (payload.step1.imageList && typeof payload.step1.imageList[0] !=='string') {
          const result = await uploadImage();
          refinedPayload.imageList = [result]
        }
        else{
          if(payload.step1.imageList && typeof payload.step1.imageList[0] ==='string'){
            refinedPayload.imageList = [payload.step1.imageList[0]]
          }
          else{
            alert('이미지가 없습니다.');
          }
        }
        try{
          const response = await axiosSemiSecureAPI.put(`/api/promotions/${id}`, refinedPayload);
          if(response.data.isSuccess === true){
            setPromotionUrl(`/promotion/${response.data.result}`)
            clearData();
            setIsSuccess(true);
          }
        }catch(e){
          //console.log(e)
          alert('프로모션 업데이트 실패')
        }finally{
          setIsLoading(false);
        }
      }
      
    

    const [step, setStep] = useState<Step[]>([])
    useEffect(() => {
        setStep([
            {
                title: 'STEP 1 공연 정보',
                element: <Step1 next={next} currentIndex={currentStepIndex} />,
            },
            {
                title: 'STEP 2 상세 정보',
                element: <Step2 prev={prev} next={next} currentIndex={currentStepIndex} />,
            },
            {
                title: 'STEP 3 예매 정보',
                element: <Step3 prev={prev} next={next} currentIndex={currentStepIndex} />,
            },
        ]);
    }, [currentStepIndex]);

    const title = step.map((s) => s.title);
    return (
      <div className="flex flex-col min-h-screen justify-start bg-system-background pt-20px">
        <div className='px-4'>
          <Nav/>
          <TicketCreationInfo/>
        </div>
        <div className="flex flex-col w-full">
          <FormNav title={title} currentStepIndex={currentStepIndex}/>
          {!isSuccess ? isLoading ? <Loading text={"공연을 등록중입니다."} isLoading={isLoading}/> :
            step.length !== 0 ?
            step[currentStepIndex].element : <div> No Element </div>
            :
            <Result isLoading={isLoading} isSuccess={isSuccess} promotionUrl={promotionUrl}/>  
          }
        
        </div>
        
      </div>
    )
}

export default PromotionEdit