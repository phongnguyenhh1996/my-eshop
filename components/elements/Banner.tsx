"use client";

interface BannerItem {
  img: string;
  title: string;
  rowSpan?: string;
  colSpan?: string;
}

export interface BannerProps {
  banners?: {
    left: BannerItem[];
    right: BannerItem[];
  };
}

export function Banner({ banners }: BannerProps) {
  const { left: leftBanners = [], right: rightBanners = [] } = banners || {};

  return (
    <div className="container mx-auto my-10 flex flex-col md:flex-row gap-2 lg:gap-5 p-2 mx-p-0">
      {/* Left side banners */}
      <div className="basis-1/2 grid grid-flow-col grid-rows-2 gap-2 lg:gap-5">
        {leftBanners.map((banner, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden ${banner.rowSpan === '2' ? 'row-span-2' : ''}`}
          >
            <img
              src={banner.img}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                {banner.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
      
      {/* Right side banners */}
      <div className="basis-1/2 grid grid-flow-row grid-cols-2 gap-2 lg:gap-5">
        {rightBanners.map((banner, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden ${banner.colSpan === '2' ? 'col-span-2' : ''}`}
          >
            <img
              src={banner.img}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                {banner.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
