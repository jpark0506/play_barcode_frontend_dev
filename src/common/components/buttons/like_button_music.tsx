import React from 'react'
import like_icon_true from './img/like_icon_true.png';
import like_icon_false from './img/like_icon_false.png';
type Props = {
    id : number | undefined,
    like : boolean,
    like_num : number | undefined,
    updateHeart : (id: any, value: boolean) => Promise<void>
}
const MusicLikeButton = (props: Props) => {
    const { id,like,like_num,updateHeart} = props;
    return (

            <button className=" bg-white rounded-full w-60px h-30px shadow-md border-primary"
                style={{
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                border: '1px solid rgba(30, 218, 0)'
                }} 
                onClick={()=>updateHeart(id,like)}>
                <div className='flex flex-row items-center justify-center'>
                    { like ? <img src={like_icon_true} alt="like" className="mr-1 w-18px h-4" /> :
                    <img src={like_icon_false} alt="like" className="mr-1 w-18px h-4" />}
                <span className="text-xs text-green-600">{like_num}</span>
                </div>
            </button>
    )
}

export default MusicLikeButton