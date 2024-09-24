export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="h-[100vh]"></section>

      {/* FOOTER */}

      <section className="footer h-[70vh] lg:h-[40vh] w-full text-sky-100 relative z-10 flex justify-center items-center flex-col ">
        <div className="w-full flex justify-center">
          <p className="h-[2px] w-[70%] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></p>
        </div>
        <div className="h-full w-full flex justify-center items-center flex-col lg:flex-row">
          <div className="flex flex-col justify-center items-center mt-11">
            <h1 className="opacity-70 text-5xl font-extrabold tracking-[7px] mb-16">
              IICBITS
            </h1>

            <ul className="flex gap-4">
              <li className="h-12 w-12 border border-sky-600 rounded-full"></li>
              <li className="h-12 w-12 border border-sky-600 rounded-full"></li>
              <li className="h-12 w-12 border border-sky-600 rounded-full"></li>
              <li className="h-12 w-12 border border-sky-600 rounded-full"></li>
            </ul>
          </div>

          <div className="flex flex-col justify-center md:ml-60">
            <h1 className="font-bold opacity-90 mb-4">USEFUL LINKS</h1>
            <ul className="flex flex-col gap-2 text-sm opacity-65 tracking-[2px]">
              <li className="">About Us</li>
              <li className="">About Us</li>
              <li className="">About Us</li>
              <li className="">About Us</li>
              <li className="">About Us</li>
            </ul>
          </div>

          <div className=" flex flex-col justify-center items-left pl-7 md:ml-28">
            <h1 className="font-bold opacity-90 mb-4">CONTACT</h1>
            <div className="tracking-[2px] text-sm">
              <p className=" flex gap-2 mb-2 opacity-65">
                <span className="">Incubation Centre, IT Building</span>
              </p>
              <p className=" flex gap-2 mb-2 opacity-65">
                {/* <MdEmail /> */}
                <span className="">iicbits@bitsindri.ac.in</span>
              </p>
            </div>
            <div className="copyright text-xs tracking-wider mt-10 opacity-50">
              Copyright &copy; 2024 Vivek Tiwari | All Rights Reserved.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
