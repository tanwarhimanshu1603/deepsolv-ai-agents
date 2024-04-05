import Head from "next/head";
import Link from "next/link";
import {useUser} from '@auth0/nextjs-auth0/client'
import { getSession } from "@auth0/nextjs-auth0";
import ThemeSwitcher from "components/ThemeSwitcher";


export default function IndexCopy() {
  const {isLoading, error, user} = useUser();

  if(isLoading)return <div>Loading....</div>
  if(error) return <div>{error.message}</div>



  return (
    <div>
      <Head>
        <title>Deepsolv.AI</title>
      </Head>
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
            <a className="btn bg-emerald-400 text-xl hidden md:flex">DEEPSOLV AI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
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
            <Link href='/api/auth/login' className="btn">Login</Link>
            <Link href='/api/auth/signup' className="btn bg-gray-600 hover:bg-gray-500 hidden md:flex">Try Demo</Link>
        </div>
        </div>

        {/* Hero Section */}
        <div className="hero min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Conversations  that Convert, Connect and  Captivate</h1>
      <p className="py-6">Transforming Every Customer Interaction into Opportunities for Sales and Loyalty.</p>
      <Link href='/api/auth/login' className="btn">Get Started</Link>
    </div>
  </div>
</div>

    </div>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context.req, context.res);
  if(!!session){
    return {
      redirect: {
        destination: "/dashboard"
      }
    }
  }

  return {
    props: {}
  }
}