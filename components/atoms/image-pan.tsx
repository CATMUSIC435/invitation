import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


type ImagePanProps = {
    src: string;
}

export function ImagePan({ src }: ImagePanProps) {
    return (
        <TransformWrapper>
            <TransformComponent wrapperClass="transform-component">
                <div className="h-[100px] w-[100px]">
                    <img src={src} className="h-full w-auto object-cover" alt="test" />
                </div>
            </TransformComponent>
        </TransformWrapper>
    );
};