import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link"

export default function Navbar({isLoggedIn}) {
    return (
        <div className="navbar bg-transparent fixed">
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Pricing</a></li>
                <li>
                <a>Features</a>
                <ul className="p-2">
                    <li><a>Feature01</a></li>
                    <li><a>Feature02</a></li>
                </ul>
                </li>
                <li><a>Company</a></li>
            </ul>
            </div>
            <a className="btn bg-emerald-400 text-xl hidden lg:flex">DEEPSOLV AI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-xl">
            <li><a>Pricing</a></li>
            <li>
                <details>
                <summary>Features</summary>
                <ul className="p-2">
                    <li><a>Feature01</a></li>
                    <li><a>Feature02</a></li>
                </ul>
                </details>
            </li>
            <li><a>Company</a></li>
            </ul>
        </div>
        <div className="navbar-end space-x-2">
            <ThemeSwitcher />
            <Link href={`/api/auth/${isLoggedIn ? 'logout' : 'login'}`} className={`${isLoggedIn ? 'btn bg-gray-600 hover:bg-gray-500' : 'btn'}`}>{isLoggedIn ? 'Log Out' : 'Log In'}</Link>
            <Link href='/api/auth/signup' className={`btn bg-gray-600 hover:bg-gray-500 hidden ${!isLoggedIn && 'md:flex'}`}>Try Demo</Link>
        </div>
        </div>
    )
}