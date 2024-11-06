import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useEffect, useRef, useState } from 'react'
import ModelView from './ModelView'
import {yellowImg} from '../utils';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import {models, sizes} from '../constants';
import { animateWithGsapTimeline } from '../utils/animations';

const Model = () => {
  
  // 2.create useState to determine the iPhone size  
  const [size, setSize] = useState('small');

  // 3.create useState to storage data of the iPhone
  const [model, setModel] = useState({
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#8f8a81', '#ffe7b9', '#6f6c64'],
    img: yellowImg
  })

  // 4.set up camera control for the model view
  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  // 5.for model
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  // 6.for rotation
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotaion, setLargeRotation] = useState(0);

  // 7.for change size of iphone
  const timeline = gsap.timeline();
  useEffect(()=> {
    if(size === 'large'){
        animateWithGsapTimeline(timeline, small, smallRotation, '#view1', '#view2', {
            x: '-100%',
            duration: 2
        });
    }

    if(size === 'small'){
        animateWithGsapTimeline(timeline, large, largeRotaion, '#view2', '#view1', {
            x: '0',
            duration: 2
        });
    }
  })
    
  // 1.use GSAP to animate heading  
  useGSAP(()=> {
    gsap.to('#heading', {
        opacity: 1,
        y: 0,
    })
  },[])

  return (
    <section className='common-padding'>
        <div className="screen-max-width">
            <h1 id='heading' className="section-heading">
                Take a closer look.
            </h1>
            <div className="flex flex-col items-center mt-5">
                <div className="w-full h-[75%] md:h-[90vh] overflow-hidden relative">
                     <ModelView
                        index={1}
                        groupRef={small}
                        gsapType='view1'
                        controlRef={cameraControlSmall}
                        setRotationState={setSmallRotation}
                        item={model}
                        size={size}
                     />
                     <ModelView 
                        index={2}
                        groupRef={large}
                        gsapType='view2'
                        controlRef={cameraControlLarge}
                        setRotationState={setLargeRotation}
                        item={model}
                        size={size}
                     />

                    <Canvas
                        className='w-full h-full'
                        style={{
                            position: 'fixed',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            overflow: 'hidden'
                        }}
                        eventSource={document.getElementById('root')}
                    >
                        <View.Port />    
                    </Canvas>       
                </div>
                <div className="mx-auto w-full">
                        <p className='text-sm font-light text-center mb-5'>{model.title}</p>
                        <div className="flex-center">
                            <ul className="color-container">
                                {models.map((item, i)=> (
                                    <li 
                                        key={i} 
                                        className='w-6 h-6 rounded-full mx-2 cursor-pointer'
                                        style={{backgroundColor: item.color[0]}}
                                        onClick={()=> setModel(item)}
                                    />
                                ))}
                            </ul>
                            <button className='size-btn-container'>
                                {sizes.map(({label, value})=> (
                                    <span 
                                        key={label}
                                        className='size-btn'
                                        style={{
                                            backgroundColor: size===value ? 'white' : 'transparent',
                                            color: size===value ? 'black' : 'white'
                                        }}
                                        onClick={()=> setSize(value)}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </button>
                        </div>
                </div>  
            </div>
        </div>
    </section>
  )
}

export default Model