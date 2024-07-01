import {Field, useField} from 'formik';
import {useRef, useState, useEffect} from 'react';
import upload_icon from '../../../img/upload_icon.png';
import Calendar, {CalendarProps} from 'react-calendar';
import {useFormikContext} from 'formik';
import calendar_icon_form from '../../../img/calendar_icon_form.png';
import 'react-calendar/dist/Calendar.css';
import TextareaAutosize from 'react-textarea-autosize';
export const CustomTextInput = ({label, ...props}:any) => {
  
const [field, meta] = useField(props);
  return (
    
    <div className = "mb-30px">
      <label htmlFor={props.id || props.name} className='pl-6px text-md font-normal text-system-black'>{label}</label>
      <input className='w-full mt-10px h-48px border border-gray-2 rounded-lg px-4' {...field} {...props} />
       {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm mt-2">{meta.error}</div>
      ) : null}
    </div>
  )
}
export const CustomLongTextInput = ({label, ...props}:any) => {
  
  const [field, meta] = useField(props);
  return (
    <div className = "mb-30px">
      <label htmlFor={props.id || props.name} className='pl-6px text-md font-normal text-system-black mb-10px'>{label}</label>
      <TextareaAutosize
            className="w-full bg-gray-1 mt-10px text-system-black rounded-md p-14px placeholder-gray-2"
            placeholder={props.placeholder}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            minRows={10}
          />
        {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm mt-2">{meta.error}</div>
      ) : null}
    </div>
  )
}
export const CustomFileInput = ({ label, ...props }:any) => {
  const [field, meta, helpers] = useField(props);
  const { setValues, values } = useFormikContext();
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {initialval} = props;
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialval.length) {
      const initialPreviews = initialval.map((file: File) => URL.createObjectURL(file));
      setPreviews(initialPreviews);
      helpers.setValue(initialval);
    }
  }, [initialval, helpers]);
  
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const newFilesArray = Array.from(files);
    const currentFiles = field.value || [];
    const updatedFilesArray = [...currentFiles, ...newFilesArray];
    console.log(updatedFilesArray);
    setValues({ ...values as Object, imageList: updatedFilesArray })
    helpers.setValue(updatedFilesArray); // Formik value 설정

    const newPreviews = await Promise.all(
      newFilesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject('FileReader error');
            }
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setPreviews([...previews, ...newPreviews]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handlePreviewClick = (preview: string) => {
    setCurrentPreview(preview);
    setShowFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setShowFullScreen(false);
    setCurrentPreview(null);
  };

  
  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    const newFiles = field.value.filter((_ : any, i:any) => i !== index);
    helpers.setValue(newFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input value
    }
  };

  return (
    <div className='mb-30px'>
      <label htmlFor="files" className="">{label}</label>
      <br />
     <input
        className='mt-10px'
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleChange}
         style={{ display: 'none' }}
        {...props}
      />
      <button type="button" className="custom-button" onClick={handleClick}>
        <div className='flex flex-row justify-center items-center rounded-lg border-gray-1 border-1px p-14px mt-10px hover:bg-gray-1'>
          <img src={upload_icon} className='h-4 w-4'></img>
          <div className='text-gray-3 text-sm'>
            업로드 (JPG, PNG 5MB)
          </div>
        </div>
        
      </button>
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      {previews.length > 0 && (
        <div className="inline-block w-full mt-10px overflow-x-auto whitespace-nowrap space-x-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative inline-block w-300px h-300px ">
              <img
                src={preview}
                alt={`preview ${index}`}
                className="min-w-full h-full cursor-pointer object-contain rounded-lg bg-gray-1"
                onClick={() => handlePreviewClick(preview)}
              />
               <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-psm absolute top-2 right-2 bg-system-white text-system-error hover:text-system-white hover:bg-system-error text-center border-system-error border-1px px-10px py-1 rounded-md "
                >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
        
        {showFullScreen && currentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={handleCloseFullScreen}
          >
            X
          </button>
          <img src={currentPreview} alt="fullscreen preview" className="max-w-full max-h-full" />
        </div>
      )}
      </div>
    </div>
  );
}
export const CustomDateInput = ({label, ...props}:any) => {
  const [field, meta, helpers] = useField(props);
  const {initialval} = props;
  const [hasSelected, setHasSelected] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const WEEKDAY = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  useEffect(()=>{
    if(initialval !== ''){
      setSelectedDate(new Date(initialval));
      setHasSelected(true);
    }
  },[])
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      helpers.setValue(value.toISOString().split('T')[0]); // Formik value 설정
      setShowCalendar(false);
    }
  };

  const handleButtonClick = () => {
    helpers.setTouched(true);
    setShowCalendar(!showCalendar);
  };

  const formattedDate = `${selectedDate.toLocaleDateString()} ${WEEKDAY[selectedDate.getDay()]}`;

  return (
    <div className="mb-30px">
      <label htmlFor={props.id || props.name} className='pl-6px text-md font-normal text-system-black'>{label}</label>
      <br/>
      <button
        type="button"
        className='flex flex-row justify-center items-center rounded-lg border-gray-1 border-1px p-14px mt-10px hover:bg-gray-1'
        onClick={handleButtonClick}
      >
        <div className='flex flex-row justify-center items-center'>
          <img src={calendar_icon_form} className='h-4 w-4 mr-6px'></img>
          {!meta.touched && !hasSelected ? `날짜를 선택해주세요` : formattedDate}
        </div>
      </button>
      {showCalendar && (
        <div className="calendar-container bg-white w-300px items-center" style={{ position: 'absolute', zIndex: 1000 }}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date(Date.now())}
          />
        </div>
      )}
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </div>
  )

}
export const CustomTimeInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  const { setValues, values } = useFormikContext();
  const {initialval} = props;
  const [smeridian, setsMeridian] = useState('오전');
  const [shour, setsHour] = useState(12);
  const [sminute, setsMinute] = useState(0);
  const [lmeridian, setlMeridian] = useState('오전');
  const [lhour, setlHour] = useState(12);
  const [lminute, setlMinute] = useState(0);
  const [error, setError] = useState('');
  const {setIsValidTime} = props;
  useEffect(()=>{
    if(initialval){
      const {smeridian, shour, sminute, lmeridian, lhour, lminute} = initialval;
      setsMeridian(smeridian);
      setsHour(shour);
      setsMinute(sminute);
      setlMeridian(lmeridian);
      setlHour(lhour);
      setlMinute(lminute);
    }
  },[])
  useEffect(() => {
    validateAndSetTime();
  }, [smeridian, shour, sminute, lmeridian, lhour, lminute]);

  const validateAndSetTime = () => {
    const start = parseTime(smeridian, shour, sminute);
    const end = parseTime(lmeridian, lhour, lminute);

    if (start >= end) {
      setError('종료 시간은 시작 시간보다 늦어야 합니다.');
      setIsValidTime(false);
    } else {
      setError('');
      setValues({ ...values as Object, time: { smeridian, shour, sminute, lmeridian, lhour, lminute }});
      setIsValidTime(true);
    }
  };

  const parseTime = (meridian: string, hour: number, minute: number) => {
    if (meridian === '오후' && hour !== 12) {
      hour += 12;
    }
    if (meridian === '오전' && hour === 12) {
      hour = 0;
    }
    return hour * 60 + minute;
  };

  return (
    <div className="mb-30px w-full">
      <label htmlFor={props.id || props.name} className="pl-6px text-md font-normal text-system-black">{label}</label>
      <div className="flex flex-row w-full mt-10px h-48px">
        <div className="w-1/2 flex flex-row">
          <Field as="select" 
            name="smeridian" 
            className="w-1/2 m-1 border-none outline-none text-center"
            onChange={(e : any ) => setsMeridian(e.target.value)}
            value={smeridian}
            >
            <option value="오전">오전</option>
            <option value="오후">오후</option>
          </Field>
          <div className='flex h-full w-1/2 p-1 text-center'>
            <Field as='input'
              name='shour'
              type='number'
              min={1}
              max={12}
              className='w-1/2 bg-gray-1 rounded-l-lg text-center outline-none'
              onChange={(e : any) => setsHour(e.target.value)}
              value={shour}
              />
            <span className="flex items-center justify-self-center h-full text-center bg-gray-1">:</span>
            <Field as='input'
              name='sminute'
              type='number'
              min={0}
              max={59}
              className='w-1/2 bg-gray-1 border-gray-2 rounded-r-lg text-center outline-none'
              onChange={(e : any) => setsMinute(e.target.value)}
              value={sminute}
              />
          </div>
          </div>
          <span className="self-center">~</span>
          <div className="w-1/2 flex flex-row">
            <Field as="select" 
              name="lmeridian" 
              className="w-1/2 m-1 border-none outline-none text-center"
              onChange={(e : any) => setlMeridian(e.target.value)}
              value={lmeridian}
              >
              <option value="오전">오전</option>
              <option value="오후">오후</option>
            </Field>
            <div className='flex h-full w-1/2 p-1 text-center '>
              <Field as='input'
                name='lhour'
                type='number'
                min={0}
                max={12}
                className='w-1/2 bg-gray-1 rounded-l-lg text-center outline-none'
                onChange={(e : any) => setlHour(e.target.value)}
                value={lhour}
                />
              <span className="flex items-center justify-self-center h-full text-center bg-gray-1">:</span>
              <Field as='input'
                name='lminute'
                type='number'
                min={0}
                max={59}
                className='w-1/2 bg-gray-1 border-gray-2 rounded-r-lg text-center outline-none'
                onChange={(e : any) => setlMinute(e.target.value)}
                value={lminute}
                />
            </div>
          </div>

      </div>
      {error && <div className='text-red-600 text-sm mt-2 ml-2'>{error}</div>}
      {meta.touched && meta.error ? (
        <div className='text-red-600 text-sm mt-2'>{meta.error}</div>
      ) : null}
    </div>
  );
};