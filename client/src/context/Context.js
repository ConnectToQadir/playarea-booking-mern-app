import {createContext,useState,useEffect} from 'react'
import {useNavigate,useLocation} from 'react-router-dom'


export const SessionData = createContext()

const Context = ({children}) => {

    var navigate = useNavigate()
    var {pathname} = useLocation()
    var [user,setUser] = useState(null)


    var restrictedRoutes = ['/profile',"/playareas"]

    const FetchUserProfile = async () =>{
        try {
            var res = await fetch("http://localhost:4600/api/auth/profile",{
                credentials: "include"
            })
            res = await res.json()

            if(res.success && res.message ){
                setUser(res.message)
            }else{
                restrictedRoutes.includes(pathname) && navigate('/login')
            }

        } catch (error) {
            alert("Something went wrong! Please try again later.")
        }
    }

    useEffect(()=>{
        FetchUserProfile()
    },[pathname])


  return (
    <SessionData.Provider value={{user,setUser}} >
        {children}
    </SessionData.Provider>
  )
}

export default Context