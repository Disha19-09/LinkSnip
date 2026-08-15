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
      <div className='w-full min-h-screen flex flex-col justify-center items-center bg-slate-950 relative overflow-hidden px-4 py-8'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.12),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.10),transparent_50%)]' />
 
        <div className='w-full max-w-md flex flex-col items-center gap-3 relative z-10'>
          <h1 className='text-slate-100 text-5xl md:text-6xl font-bold text-center tracking-tight select-none'>
            Link<span className='text-sky-400'>Snip</span>
          </h1>
          <p className='text-slate-400 text-sm md:text-base tracking-wide'>
            Shorten. Share. Track.
          </p>
 
          <div className='w-full mt-6 p-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex flex-col gap-5'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm font-medium text-slate-400 px-1'>Destination URL</label>
              <input 
                className='w-full border border-slate-700 rounded-xl p-3.5 text-slate-100 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder-slate-600'
                type="text"
                placeholder="Paste the URL Here"
                value={longUrl}
                onChange={(e)=> {setlongUrl(e.target.value)}} 
              />
            </div>
            <div>
              <button
                className='w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-xl shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900'
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
                    setshortUrl(`${import.meta.env.VITE_API_URL}/${data.testcode}`);
                  } catch (error) {
                    console.log(error);
                    seterrorMsg("Something Went Wrong!!. Please Try Again.")
                  } finally{
                    setIsLoading(false)
                  }
                }}
              >
                {IsLoading ? "Snapping Link..." : "Generate Short URL"}
              </button>
            </div>
            <div className='flex flex-col gap-1.5 pt-3 border-t border-slate-800'>
              <label className='text-sm font-medium text-slate-400 px-1'>Your Short Link</label>
              <div className='relative flex items-center w-full'>
                <input 
                  ref={shortUrlref} 
                  className='w-full pr-20 pl-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sky-400 placeholder:text-slate-600 font-medium text-sm focus:outline-none'
                  type="text"
                  placeholder='Your short link will appear here'
                  readOnly
                  value={shortUrl}
                />
                <button 
                  onClick={copytoClipboard}
                  className='absolute right-2 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all active:scale-95'
                >
                  Copy
                </button>
              </div>
              {errorMsg && <p className="text-red-400 text-sm px-1">{errorMsg}</p>}
            </div>
          </div>
          <p className='text-slate-600 text-xs mt-4 text-center'>
            Built with React, Express & MongoDB ·{' '}
            <a 
              href="https://github.com/Disha19-09/LinkSnip" 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-slate-500 hover:text-sky-400 underline transition-colors'
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
 
export default App

