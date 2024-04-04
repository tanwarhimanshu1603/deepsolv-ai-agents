import Head from "next/head";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div>
        <Head>
            <title>Dashboard</title>
        </Head>

        <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
            <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <div className="space-x-4">
                <Link href='http://34.42.153.11:8000/#form' className="btn bg-orange-400">DeepAgent</Link>
                <Link href='/chat' className="btn">DeepChat</Link>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default AboutPage;
