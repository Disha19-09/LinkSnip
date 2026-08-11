import { useState } from 'react'
import './App.css'

function App() {
  const [longUrl, setlongUrl] = useState("")
  const [shortUrl, setshortUrl] = useState("")

  return (
    <>
      <div>
        <div>
          <input 
          type="text"
          placeholder = "Paste the URL Here"
          value={longUrl}
          onChange = {(e)=> {setlongUrl(e.target.value)}} />
        </div>
        <div>
          <input 
          type="text"
          placeholder='here shorturl will appear'
          readOnly
          value={shortUrl}
           />
        </div>
        <div>
          <button
          onClick={async ()=>{
            const response = await fetch(`${import.meta.env.VITE_API_URL}shorten`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ originalUrl: longUrl })
            });
            const data = await response.json();
            setshortUrl(`${import.meta.env.VITE_API_URL}${data.testcode}`);
          }}
          >
            generate short url
          </button>
        </div>
      </div>
    </>
  )
}

export default App
