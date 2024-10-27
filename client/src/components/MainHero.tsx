import { FC } from 'react';
import { HeroProps, HeroVariant } from '../types/types';

const Hero: FC<HeroProps> = ({ title, imageUrl, subTitle, variant }) => {
  return (
    <div className="py-12 flex flex-col gap-8">
      {variant === HeroVariant.V1 ? (
        <div className="flex flex-col gap-4">
          {title && <h1 className="text-6xl font-bold text-center">{title}</h1>}
          {subTitle && <h1 className="text-2xl text-center">{subTitle}</h1>}
          {imageUrl && <img src={imageUrl} alt="hero" className="w-full" />}
        </div>
      ) : (
        imageUrl && (
          <div className="relative w-full">
            <img src={imageUrl} alt="hero" className="w-full opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-12">
              {title && (
                <h1 className="text-5xl font-bold text-center text-black drop-shadow-lg">
                  {title}
                </h1>
              )}
              {subTitle && (
                <h1 className="text-2xl text-center text-black drop-shadow-lg">
                  {subTitle}
                </h1>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Hero;
