import { useCallback, useRef, useState } from 'react'
import './App.css'

function App() {
  const [longUrl, setlongUrl] = useState("")
  const [shortUrl, setshortUrl] = useState("")
  const [IsLoading, setIsLoading] = useState(false)
  const [errorMsg, seterrorMsg] = useState("")
  const shortUrlref = useRef(null);

  const copytoClipboard = useCallback(()=> {
    shortUrlref.current?.select(); 
    window.navigator.clipboard.writeText(shortUrl);
  },[shortUrl])
  
  return (
    <>
      <div 
        className='w-full min-h-screen flex flex-col justify-center items-center bg-cover bg-no-repeat bg-center px-4 py-8'
        style={{
          backgroundImage: `url('https://i.pinimg.com/1200x/89/4e/17/894e179ca9e914ca95a31a729e7f1802.jpg')`, 
        }}
      >
        <div className='w-full max-w-md flex flex-col items-center gap-6'>
          <h1 className='text-pink-900 text-6xl md:text-8xl font-black text-center tracking-tight drop-shadow-md select-none'>
            LinkSnip
          </h1>
          <div className='w-full p-6 bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl flex flex-col gap-5'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-semibold text-gray-700 px-1'>Destination URL</label>
              <input 
                className='w-full border border-gray-300 rounded-xl p-3.5 text-gray-900 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-950 focus:border-pink-950 transition-all placeholder-gray-400'
                type="text"
                placeholder="Paste the URL Here"
                value={longUrl}
                onChange={(e)=> {setlongUrl(e.target.value)}} 
              />
            </div>
            <div>
              <button
                className='w-full py-3.5 px-4 bg-pink-800 hover:bg-pink-950 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-pink-950 focus:ring-offset-2'
                disabled={IsLoading}
                onClick={async ()=>{
                  setIsLoading(true)
                  try {
                    seterrorMsg("")
                    const response = await fetch(`${import.meta.env.VITE_API_URL}shorten`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ originalUrl: longUrl })
                    });
                    const data = await response.json();
                    if(!response.ok){
                      seterrorMsg(data.message)
                      return
                    }
                    setshortUrl(`${import.meta.env.VITE_API_URL}${data.testcode}`);
                  } catch (error) {
                    console.log(error);
                    seterrorMsg("Something Went Wrong!!. Please Try Again.")
                  } finally{
                    setIsLoading(false)
                  }
                }}
              >
                {IsLoading ? "Snapping Link......" : "Generate Short URL"}
              </button>
            </div>
            <div className='flex flex-col gap-1.5 pt-3 border-t border-gray-100'>
              <label className='text-sm font-semibold text-gray-700 px-1'>Your Short Link</label>
              <div className='relative flex items-center w-full'>
                <input 
                  ref={shortUrlref} 
                  className='w-full pr-24 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-pink-950 font-medium text-sm focus:outline-none'
                  type="text"
                  placeholder='here shorturl will appear'
                  readOnly
                  value={shortUrl}
                />
                <button 
                  onClick={copytoClipboard}
                  className='absolute right-2 px-3 py-1.5 text-xs font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all active:scale-95'
                >
                  Copy
                </button>
              </div>
              <div className='relative flex items-center'>
                  {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default App

