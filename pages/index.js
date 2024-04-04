import Head from "next/head";
import Link from "next/link";
import {useUser} from '@auth0/nextjs-auth0/client'
import { getSession } from "@auth0/nextjs-auth0";

export default function Home() {
  const {isLoading, error, user} = useUser();

  if(isLoading)return <div>Loading....</div>
  if(error) return <div>{error.message}</div>



  return (
    <div>
      <Head>
        <title>Deepsolv AI</title>
      </Head>

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <img src="https://cdn.pixabay.com/photo/2023/05/24/17/49/ai-generated-8015425_640.jpg" className="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold">Welcome to Deepsolv</h1>
            <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <div className="space-x-4">
              {
                !user && (
                  <>
                    <Link href='/api/auth/login' className="btn">Login</Link>
                    <Link href='/api/auth/signup' className="btn bg-orange-500">Signup</Link>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-center items-center min-h-screen w-full bg-gray-800 text-white text-center">
        <div>
          {
            !user && (
              <>
                <Link href='/api/auth/login' className="btn">Login</Link>
                <Link href='/api/auth/signup' className="btn">Signup</Link>
              </>
            )
          }
        </div>
      </div> */}
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