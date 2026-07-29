import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import logo from'../assets/logo.png';

function Navbar() {
    const { user } = useAuth();
    const initial = user?.email?.charAt(0).toUpperCase() ?? 'U';
    return (
        <nav className='bg-gray-900 text-white px-6 py-4'>
            <div className='max-w-7xl mx-auto flex items-center justify-between'>
                <div className='text-xl font-bold flex items-center'>
                    <Link to={user ? '/dashboard' : '/'}><img className='h-15 w-15'src={logo} /></Link>
                    FinSight
                </div>
                {user ? (
                    <>
                <div className="flex gap-6">
                    <Link to='/dashboard'>Dashboard</Link>
                    <Link to='/market-trends'>Market Trends</Link>
                    
                    
                    <Link to='/chat'>AI Chat</Link>
                    <Link to='/portfolio'>Portfolio</Link>
                </div>

                <div className="relative group flex items-center gap-4">
                    <button className="flex items-center justify-center text-2xl font-semibold w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-700 transition" 
                    >{initial}</button>
                    <div className="absolute right-0 mt-2 w-40 bg-slate-500 rounded-lg shadow-lg border hidden group-hover:block">
                        <Link to='/profile' className="block px-4 py-2 text-center hover:bg-slate-900 border-t rounded-lg" >
                            Profile
                        </Link>
                        <div className="flex justify-center">
                        <LogoutButton />
                        </div>
                    </div>
                    
                </div>
                </>
                ):
                 (
                    <>
                    
                <div className="flex items-center gap-4">

                        <SignupButton />
                        <LoginButton />
                       
                </div>
                </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
