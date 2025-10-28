"use client";

export function Banner() {
  return (
    <div className="container mx-auto my-10 flex flex-col md:flex-row gap-2 lg:gap-5 p-2 mx-p-0">
        <div className="basis-1/2 grid grid-flow-col grid-rows-2 gap-2 lg:gap-5">
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-01.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-02.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="row-span-2 relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-03.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
        </div>
        <div className="basis-1/2 grid grid-flow-row grid-cols-2 gap-2 lg:gap-5">
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-04.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-05.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="col-span-2 relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-07.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
        </div>
      </div>
  );
}
