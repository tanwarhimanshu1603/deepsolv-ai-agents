import Head from "next/head";
import Link from "next/link";
import {useUser} from '@auth0/nextjs-auth0/client'
import { getSession } from "@auth0/nextjs-auth0";
import Navbar from "components/Navbar";

export default function Home() {
  const {isLoading, error, user} = useUser();

  if(isLoading)return <div>Loading....</div>
  if(error) return <div>{error.message}</div>



  return (
    <div>
      <Head>
        <title>Deepsolv AI</title>
      </Head>

      <Navbar isLoggedIn={false} />

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <img src="https://cdn.pixabay.com/photo/2023/05/24/17/49/ai-generated-8015425_640.jpg" className="lg:max-w-sm md:max-w-[300px] max-w-[225px] rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold">Welcome to DeepSolv AI</h1>
            <p className="py-6">Transforming Every Customer Interaction into Opportunities for Sales and Loyalty.</p>
            <div className="space-x-4">
              {
                !user && (
                  <>
                    <Link href='/api/auth/login' className="btn">Get Started</Link>
                  </>
                )
              }
            </div>
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