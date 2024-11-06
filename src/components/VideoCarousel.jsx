import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {replayImg, playImg, pauseImg} from '../utils';
import { ScrollTrigger } from "gsap/ScrollTrigger";

//***Do not forget this line and also import
gsap.registerPlugin(ScrollTrigger);


const VideoCarousel = () => {
  // 1.create useRef formanaging multiple tasks  
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  
  // 2.create useState to manage property for each video
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  // 5. create useState for loading data
  const [loadedData, setLoadedData] = useState([]);

  // 3. destructuring useState items which will easy to use
  const {isEnd, startPlay, videoId, isLastVideo, isPlaying} = video;

  // 8. useGSAP to play the video
  useGSAP(()=> {
    gsap.to('#slider', {
        x: `${-100 * videoId}%`,
        duration: 2,
        ease: 'power2.inOut'
    })

    gsap.to('#video', {
        scrollTrigger: {
            trigger: '#video',
            toggleActions: 'restart none none none'
        },
        onComplete: ()=> {
            setVideo((prevVideo)=>({
                ...prevVideo, 
                startPlay: true,
                isPlaying: true
            }))
        }
    })
  },[isEnd, videoId])

  // 4. create useEffect for playing the video
  useEffect(()=> {
    //4.1 when video come to the end
    if(loadedData.length > 3){
        if(!isPlaying){
            videoRef.current[videoId].pause();
        }else {
            startPlay && videoRef.current[videoId].play();
        }
    }
    
  },[startPlay, videoId, isPlaying, loadedData])

  // 9. create funtion to play the video
  const handleLoadedMetaData = (i, e) => setLoadedData((prev)=> [...prev, e])

  // 6. create useEffect for the progress of the video
  useEffect(()=>{
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if(span[videoId]){
        //animate the progress of the video (for the progress bar)
        let animation = gsap.to(span[videoId], {
            //what happend when video update
            onUpdate: ()=> {
                const progress = Math.ceil(animation.progress()*100);

                if(progress != currentProgress){
                    currentProgress = progress;

                    gsap.to(videoDivRef.current[videoId], {
                        width: window.innerWidth < 760
                            ? '10vw'
                            : window.innerWidth < 1200
                                ? '10vw'
                                : '4vw'
                    })

                    gsap.to(videoSpanRef.current[videoId], {
                        width: `${currentProgress}%`,
                        background: 'white'
                    })
                }
            },

            //what happend when video complete
            onComplete: ()=> {
                if(isPlaying) {
                    gsap.to(videoDivRef.current[videoId], {
                        width: '12px',
                    })

                    gsap.to(span[videoId], {
                        backgroundColor: '#afafaf'
                    })
                }
            }
        })

        if(videoId === 0){
            animation.restart();
        }
        const animationUpdate = ()=>{
            animation.progress(videoRef.current[videoId].currentTime/ hightlightsSlides[videoId].videoDuration)
        }
    
        if(isPlaying){
            gsap.ticker.add(animationUpdate)
        }else {
            gsap.ticker.remove(animationUpdate)
        }
    }
    
  },[videoId, startPlay])

  // 7. create handle function by using switch...case
  const handleProcess = (type,i)=>{
    switch(type){
        case 'video-end':
            setVideo((prevVideo)=>({
                ...prevVideo, isEnd:true, videoId: i+1
            }))
            break;
        
        case 'video-last':
            setVideo((prevVideo)=>({
                ...prevVideo, isLastVideo:true
            }))
            break;
        
        case 'video-reset':
            setVideo((prevVideo)=>({
                ...prevVideo, isLastVideo: false, videoId: 0
            }))
            break;

        case 'play':
            setVideo((prevVideo)=>({
                ...prevVideo, isPlaying: !prevVideo.isPlaying
            }))
            break;

        case 'pause':
            setVideo((prevVideo)=>({
                 ...prevVideo, isPlaying: !prevVideo.isPlaying
            }))
            break;
        
            default:
            return video;
    }
} 
  return (
    <>
        <div className="flex items-center">
            {hightlightsSlides.map((list, i)=> (
                <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
                    <div className="video-carousel_container">
                        <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                            <video
                                id='video'
                                playsInline={true}
                                preload='auto'
                                muted
                                className={`${list.id===2 && 'translate-x-44 pointer-events-none'}`}
                                ref={(el)=> (videoRef.current[i] = el)}
                                onEnded={()=>
                                    i!==3 
                                        ? handleProcess('video-end', i)
                                        : handleProcess('video-last')
                                }
                                onPlay={()=> {
                                    setVideo((prevVideo)=> ({
                                        ...prevVideo, isPlaying: true
                                    }))
                                }}
                                onLoadedMetadata={(e)=> handleLoadedMetaData(i, e)}
                            >
                                <source src={list.video} type='video/mp4' />
                            </video>
                        </div>
                        <div className='absolute top-12 left-[5%] z-10'>
                            {list.textLists.map((text)=> (
                                <p key={text} className='md:text-2xl text-xl font-medium'>
                                    {text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className='relative flex-center mt-10'>
            <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
                {videoRef.current.map((_,i)=>(
                    <span 
                        key={i} 
                        ref={(el)=> (videoDivRef.current[i] = el)} 
                        className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
                        >
                         <span 
                            className='absolute h-full w-full rounded-full'
                            ref={(el)=> (videoSpanRef.current[i] = el)}
                            />
                    </span>
                ))}
            </div>
            <button className='control-btn'>
                <img 
                    src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                    alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
                    onClick={isLastVideo
                        ? ()=> handleProcess('video-reset')
                        : !isPlaying
                            ? ()=> handleProcess('play')
                            : ()=> handleProcess('pause')
                    }
                />
            </button>
        </div>
    </>
  )
}

export default VideoCarousel